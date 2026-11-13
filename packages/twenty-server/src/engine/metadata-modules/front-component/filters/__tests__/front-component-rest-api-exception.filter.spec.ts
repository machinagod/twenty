import { type ArgumentsHost } from '@nestjs/common';

import { type Response } from 'express';

import { type HttpExceptionHandlerService } from 'src/engine/core-modules/exception-handler/http-exception-handler.service';
import { FrontComponentRestApiExceptionFilter } from 'src/engine/metadata-modules/front-component/filters/front-component-rest-api-exception.filter';
import {
  FrontComponentException,
  FrontComponentExceptionCode,
} from 'src/engine/metadata-modules/front-component/front-component.exception';

describe('FrontComponentRestApiExceptionFilter', () => {
  const handleError = jest.fn();
  const response = {} as Response;

  const httpExceptionHandlerService = {
    handleError,
  } as unknown as HttpExceptionHandlerService;

  const filter = new FrontComponentRestApiExceptionFilter(
    httpExceptionHandlerService,
  );

  const host = {
    switchToHttp: () => ({ getResponse: () => response }),
  } as unknown as ArgumentsHost;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    [FrontComponentExceptionCode.FRONT_COMPONENT_NOT_FOUND, 404],
    [FrontComponentExceptionCode.FRONT_COMPONENT_NOT_READY, 500],
    [FrontComponentExceptionCode.FRONT_COMPONENT_CREATE_FAILED, 400],
    [FrontComponentExceptionCode.INVALID_FRONT_COMPONENT_INPUT, 400],
    [FrontComponentExceptionCode.FRONT_COMPONENT_ALREADY_EXISTS, 409],
  ])('maps %s to HTTP %i', (code, expectedStatus) => {
    const exception = new FrontComponentException('boom', code);

    filter.catch(exception, host);

    expect(handleError).toHaveBeenCalledWith(
      exception,
      response,
      expectedStatus,
    );
  });

  it('falls back to 500 for an unknown code', () => {
    const exception = Object.assign(
      new FrontComponentException(
        'boom',
        FrontComponentExceptionCode.FRONT_COMPONENT_NOT_FOUND,
      ),
      { code: 'SOMETHING_ELSE' as FrontComponentExceptionCode },
    );

    filter.catch(exception, host);

    expect(handleError).toHaveBeenCalledWith(exception, response, 500);
  });
});
