import { z } from 'zod';
import { type CompositeType } from '../composite-types/composite-type.interface';
export declare const richTextCompositeType: CompositeType;
export declare const richTextValueSchema: z.ZodObject<{
    blocknote: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    markdown: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export type RichTextMetadata = z.infer<typeof richTextValueSchema>;
//# sourceMappingURL=rich-text.composite-type.d.ts.map