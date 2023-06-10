// src/types/TransformerOptions.ts
export interface TransformerOptions {
  targetSymbols?: string[];
  targetRegex?: RegExp[];
  oldModuleName: string;
  newModuleName: string;
  directory: string;
}
