export type FromTo<T, K extends string = ''> = {
    [P in 'from' | 'to' as `${P}${Capitalize<K>}`]: T;
};
//# sourceMappingURL=FromToType.d.ts.map