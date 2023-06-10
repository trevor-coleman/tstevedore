// src/types/TargetImports.ts

import { namedTypes } from "ast-types";

export interface TargetImport {
  import: namedTypes.ImportDeclaration | null;
  index: number | null;
}

export interface TargetImports {
  old: TargetImport;
  new: TargetImport;
}
