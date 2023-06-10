import { input, confirm } from "@inquirer/prompts";
import { TransformerOptions } from "./types/TransformerOptions";
import fs from "fs";

const BRIGHT_BLUE = "\x1b[94m";
const NORMAL_CYAN = "\x1b[36m";
const RESET = "\x1b[0m";
const BRIGHT_WHITE = "\x1b[97m";
const BRIGHT_BLUE_BG_WHITE_TEXT = "\x1b[44m\x1b[97m";

const WELCOME: string = `
${BRIGHT_BLUE_BG_WHITE_TEXT}TS${BRIGHT_WHITE}tevedore${RESET}: the TypeScript import refactoring tool!
`;

export async function inquirerPrompt(): Promise<TransformerOptions> {
  console.log(WELCOME);

  const identifiers = await getIdentifiers();
  const oldModuleName = await getModuleName(
    "What is the name of the OLD module the identifiers are currently exported from?"
  );
  const newModuleName = await getModuleName(
    "What is the name of the NEW module the identifiers should be exported from?"
  );
  const directory = await getPath();

  const shouldIgnoreNodeModules = await confirm({
    message: "Ignore `node_modules/**`?",
    default: true,
  });

  return {
    targetSymbols: identifiers,
    oldModuleName,
    newModuleName,
    directory,
    ignore: shouldIgnoreNodeModules ? ["**/node_modules/**"] : undefined,
  };
}

async function getIdentifiers(): Promise<any> {
  const identifiersInput = await input({
    message: "What identifier(s) do you want to target? (comma separated)",
    validate: validateIdentifiers,
  });

  return identifiersInput.split(",").map((v) => v.trim());
}

async function getModuleName(message: string): Promise<any> {
  let oldModuleNameInput = await input({
    message,
    validate: (value) => {
      return isValidModuleImportPath(value) ? true : "Invalid module name";
    },
  });

  if (isRelativeModuleImportPath(oldModuleNameInput)) {
    const relativePathIsOk = await confirm({
      message: `${oldModuleNameInput} appears to be a relative path. Is that correct?`,
      default: true,
    });

    if (!relativePathIsOk) {
      oldModuleNameInput = await getModuleName(message);
    }
  }

  return oldModuleNameInput;
}

async function getPath(): Promise<string> {
  const path = await input({
    message: "What is the path to the directory you want to target?",
    validate: isValidDirectory,
  });

  return path;
}

/**
 * A function to check if a string is a valid JavaScript identifier.
 *
 * The regex matches strings that start with a letter, underscore, or dollar sign ([a-zA-Z_$]),
 * followed by zero or more letters, digits, underscores, or dollar signs ([a-zA-Z0-9_$]*).
 * The ^ and $ anchors ensure that the entire string is matched.
 *
 * @param {string} str - The string to check.
 * @returns {boolean} Returns true if the string is a valid identifier, else false.
 */
function isValidIdentifier(str: string) {
  const identifierRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;

  return identifierRegex.test(str) && !reservedKeywords.includes(str);
}

// A list of reserved keywords in JavaScript/TypeScript
const reservedKeywords = [
  "abstract",
  "any",
  "as",
  "async",
  "await",
  "boolean",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "declare",
  "default",
  "delete",
  "do",
  "else",
  "enum",
  "export",
  "extends",
  "false",
  "finally",
  "for",
  "from",
  "function",
  "get",
  "if",
  "implements",
  "import",
  "in",
  "infer",
  "instanceof",
  "interface",
  "is",
  "keyof",
  "let",
  "module",
  "namespace",
  "never",
  "new",
  "null",
  "number",
  "object",
  "of",
  "package",
  "private",
  "protected",
  "public",
  "readonly",
  "require",
  "return",
  "set",
  "static",
  "string",
  "super",
  "switch",
  "symbol",
  "this",
  "throw",
  "true",
  "try",
  "type",
  "typeof",
  "unique",
  "unknown",
  "var",
  "void",
  "while",
  "with",
  "yield",
];

function validateIdentifiers(value: string) {
  const identifiers = value.split(",").map((v) => v.trim());
  const invalidIdentifiers = identifiers.filter((id) => !isValidIdentifier(id));
  return invalidIdentifiers.length === 0
    ? true
    : `Invalid identifier(s): ${invalidIdentifiers.join(", ")}`;
}

function isValidModuleImportPath(importPath: string): boolean {
  const moduleImportRegex = /^(@?[a-zA-Z0-9_./-]+)+$/;
  return moduleImportRegex.test(importPath);
}

function isRelativeModuleImportPath(importPath: string): boolean {
  return /^\.\.?\//.test(importPath);
}

function isValidDirectory(input: string) {
  const path = `${process.cwd()}/${input}`;
  if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
    return true;
  } else {
    return "Please enter a valid directory path";
  }
}
