import { Logger } from '@nestjs/common';

import RedisStore from 'connect-redis';
import { createClient } from 'redis';

import type session from 'express-session';

import { CacheStorageType } from 'src/engine/core-modules/cache-storage/types/cache-storage-type.enum';
import { resolveSessionCookieSecretsOrThrow } from 'src/engine/core-modules/secret-encryption/utils/resolve-session-cookie-secrets.util';
import { type TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';

const sessionStorageLogger = new Logger('SessionStorage');

const REDIS_PING_INTERVAL_MS = 60_000;

export const getSessionStorageOptions = (
  twentyConfigService: TwentyConfigService,
): session.SessionOptions => {
  const sessionStorageType = twentyConfigService.get('SESSION_STORAGE_TYPE');

  const SERVER_URL = twentyConfigService.get('SERVER_URL');

  const sessionSecrets = resolveSessionCookieSecretsOrThrow({
    twentyConfigService,
  });

  const sessionStorage: session.SessionOptions = {
    secret: sessionSecrets,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      secure: !!(SERVER_URL && SERVER_URL.startsWith('https')),
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 30, // 30 minutes
    },
  };

  switch (sessionStorageType) {
    case CacheStorageType.Memory: {
      // express-session's default per-instance MemoryStore (Redis-free, Deno Deploy
      // target). NOTE: OIDC SSO stores its PKCE verifier/state in the session across
      // the redirect→callback round-trip, so this breaks SSO when those requests hit
      // different instances — use a shared store (redis, or a future PG store) for SSO.
      sessionStorageLogger.warn(
        'Using in-memory session storage — OIDC SSO across multiple instances requires a shared store.',
      );

      return sessionStorage;
    }
    case CacheStorageType.Redis: {
      const connectionString = twentyConfigService.get('REDIS_URL');

      if (!connectionString) {
        throw new Error(
          `${CacheStorageType.Redis} session storage requires REDIS_URL to be defined, check your .env file`,
        );
      }

      const redisClient = createClient({
        url: connectionString,
        pingInterval: REDIS_PING_INTERVAL_MS,
      });

      redisClient.on('error', (err) => {
        sessionStorageLogger.error('Redis session-store client error', err);
      });

      redisClient.connect().catch((err) => {
        throw new Error(`Redis connection failed: ${err}`);
      });

      return {
        ...sessionStorage,
        store: new RedisStore({
          client: redisClient,
          prefix: 'engine:session:',
        }),
      };
    }
    default:
      throw new Error(
        `Invalid session-storage (${sessionStorageType}), check your .env file`,
      );
  }
};
