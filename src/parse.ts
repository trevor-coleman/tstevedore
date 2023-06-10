import * as recast from "recast";
import { parse, ParserOptions } from "@babel/parser";
import { TransformerOptions } from "./types/TransformerOptions";
import { NodePath, namedTypes, builders } from "ast-types";
import { readFileSync, writeFileSync } from "fs";
import * as prettier from "prettier";
import getBabelOptions from "recast/parsers/_babel_options";
import { printFileDiff } from "./diff";

const babelOptions = getBabelOptions();
const parserOptions: ParserOptions = {
  ...babelOptions,
  plugins: [...babelOptions.plugins, "typescript", "jsx", "estree"],
  sourceType: "module",

  tokens: true,
};

function parseAST(sourceCode: string): any {
  return recast.parse(sourceCode, {
    parser: {
      parse: (source: string) =>
        parse(source, {
          sourceType: "module",
          plugins: ["jsx", "typescript", "classProperties", "dynamicImport"], // enable jsx and typescript
          tokens: true,
          attachComment: true,
        }),
    },
  });
}

export async function transformAndPrint(
  filename: string,
  {
    targetSymbols,
    targetRegex,
    oldModuleName,
    newModuleName,
  }: TransformerOptions,
  makeChanges: boolean
) {
  let newImportPaths: Array<{
    path: NodePath;
    node: namedTypes.ImportDeclaration;
  }> = [];
  console.log(`Checking ${filename}`);
  const sourceCode: string = readFileSync(filename, "utf-8");

  let ast: any;

  try {
    ast = parseAST(sourceCode);
  } catch (e: any) {
    console.error(`Error while parsing the file: ${filename}`);
    console.log(`Source code of ${filename} before parsing: \n${sourceCode}`);
    console.error(e);
    throw new Error(`Error while parsing the file: ${filename}`);
  }

  let hasChanged = false;

  recast.visit(ast, {
    visitImportDeclaration: function (path) {
      const node = path.node;
      if (node.source.value === oldModuleName && node.specifiers?.length) {
        const oldSpecifiers: any[] = [];
        const newSpecifiers: any[] = [];

        node.specifiers?.forEach((specifier: any) => {
          if (isATarget(specifier.imported?.name)) {
            // If the import has been renamed, keep the renaming
            if (
              specifier.type === "ImportSpecifier" &&
              specifier.imported?.name !== specifier.local.name
            ) {
              const renamedSpecifier = builders.importSpecifier(
                builders.identifier(specifier.imported?.name),
                builders.identifier(specifier.local.name)
              );
              newSpecifiers.push(renamedSpecifier);
            } else {
              newSpecifiers.push(specifier);
            }
          } else {
            oldSpecifiers.push(specifier);
          }
        });

        if (newSpecifiers.length > 0) {
          hasChanged = true;

          const newImportDeclaration = builders.importDeclaration(
            newSpecifiers,
            builders.literal(newModuleName)
          );

          path.insertAfter(newImportDeclaration);

          if (oldSpecifiers.length === 0) {
            path.prune();
          } else {
            node.specifiers = oldSpecifiers;
          }

          newImportPaths.forEach(({ path, node }) => {
            // Merge the specifiers with the existing new module import declaration
            node.specifiers = [...(node.specifiers ?? []), ...newSpecifiers];

            // Remove the newly created import declaration
            path.prune();
          });
        }
      }

      // Check if the node is an import declaration for the new module
      if (path.node?.source?.value === newModuleName) {
        newImportPaths.push({
          path: path as NodePath,
          node: path.node as namedTypes.ImportDeclaration,
        });
      }

      return false;
    },
  });

  function isATarget(name?: string): boolean {
    if (!name) return false;

    return Boolean(
      targetSymbols?.includes(name) ||
        targetRegex?.some((regex) => regex.test(name))
    );
  }

  if (hasChanged) {
    // Traverse the AST and append comments to nodes
    recast.visit(ast, {
      visitNode(path) {
        const { node, parent } = path;
        if (node.comments) {
          const leadingComments = node.comments.filter(
            (comment) => comment.leading
          );
          const trailingComments = node.comments.filter(
            (comment) => comment.trailing
          );

          // Append leading comments to the node
          if (leadingComments.length > 0 && parent && parent.node !== null) {
            const parentNode = parent.node;
            if (!parentNode.leadingComments) {
              parentNode.leadingComments = [];
            }
            parentNode.leadingComments.push(...leadingComments);
          }

          // Append trailing comments to the node
          if (trailingComments.length > 0 && parent && parent.node !== null) {
            const parentNode = parent.node;
            if (!parentNode.trailingComments) {
              parentNode.trailingComments = [];
            }
            parentNode.trailingComments.push(...trailingComments);
          }
        }

        this.traverse(path);
      },
    });

    const output = recast.print(ast).code;
    const config = await prettier.resolveConfig.sync(filename);
    console.log(
      `using prettier config: ${JSON.stringify(config)} for file ${filename}`
    );
    const formattedCode = prettier.format(output, {
      ...config,
      parser: "typescript",
    });
    if (makeChanges) {
      writeFileSync(filename, formattedCode);
    } else {
      console.log(`\n\n${filename}:\n\n`);
      printFileDiff(sourceCode, formattedCode);
    }
  }
}
