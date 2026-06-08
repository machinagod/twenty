export declare const TIPTAP_MARK_TYPES: {
    readonly BOLD: "bold";
    readonly ITALIC: "italic";
    readonly UNDERLINE: "underline";
    readonly STRIKE: "strike";
    readonly LINK: "link";
};
export declare const TIPTAP_NODE_TYPES: {
    readonly PARAGRAPH: "paragraph";
    readonly TEXT: "text";
    readonly HEADING: "heading";
    readonly VARIABLE_TAG: "variableTag";
    readonly IMAGE: "image";
    readonly BULLET_LIST: "bulletList";
    readonly ORDERED_LIST: "orderedList";
    readonly LIST_ITEM: "listItem";
    readonly HARD_BREAK: "hardBreak";
};
export type TipTapMarkType = (typeof TIPTAP_MARK_TYPES)[keyof typeof TIPTAP_MARK_TYPES];
export type TipTapNodeType = (typeof TIPTAP_NODE_TYPES)[keyof typeof TIPTAP_NODE_TYPES];
export declare const TIPTAP_MARKS_RENDER_ORDER: readonly TipTapMarkType[];
export interface LinkMarkAttributes {
    href?: string;
    target?: string;
    rel?: string;
}
export interface TipTapMark {
    type: TipTapMarkType;
    attrs?: LinkMarkAttributes | Record<string, unknown>;
}
//# sourceMappingURL=tiptap-marks.d.ts.map