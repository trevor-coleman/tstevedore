// src/types/TransformerOptions.ts
export interface TransformerOptions {
    identifiers?: string[]
    regexes?: RegExp[]
    oldModuleName: string
    newModuleName: string
    directory: string
    ignore?: string[]
}
