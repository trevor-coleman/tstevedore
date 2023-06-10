import { input, select } from '@inquirer/prompts'
import { TransformerOptions } from '../types/TransformerOptions'

async function getIdentifiers(): Promise<any> {
    const identifiersInput = await input({
        message: 'What identifier(s) do you want to target? (comma separated)',
        validate: validateIdentifiers,
    })

    return identifiersInput.split(',').map((v) => v.trim())
}

async function getRegexes(): Promise<any> {
    const regexInput = await input({
        message: 'Enter a comma separated list of regexes expressions?',
        validate: (value) => {
            const regexes = value.split(',').map((v) => v.trim())
            const invalidRegexes = regexes.filter((r) => {
                try {
                    new RegExp(r)
                    return false
                } catch (e) {
                    return true
                }
            })
            return invalidRegexes.length === 0
                ? true
                : `Invalid regexes: ${invalidRegexes.join(', ')}`
        },
    })

    return regexInput.split(',').map((v) => new RegExp(v.trim()))
}

export async function getSelectors(): Promise<
    Pick<TransformerOptions, 'identifiers' | 'regexes'>
> {
    const listOrRegex = await select({
        message: 'Target identifiers by:',
        choices: [
            {
                name: 'Entering a list  (e.g. `myFunction, MyClass`)',
                value: 'list',
                description: 'Enter a comma separated list of identifiers',
            },
            {
                name: 'Select via Regex  (e.g. `[mM]y(Function|Class)`)',
                value: 'regex',
                description:
                    'Use one or more regular expressions to target identifiers',
            },
            {
                name: 'Both',
                value: 'both',
                description:
                    'Provde using both a list of identifiers and one ore more regexes expressions',
            },
        ],
    })

    let regexes: RegExp[] | undefined = []
    let identifiers: string[] | undefined

    switch (listOrRegex) {
        case 'regex':
            regexes = await getRegexes()
            break
        case 'both':
            identifiers = await getIdentifiers()
            regexes = await getRegexes()
            break
        case 'list':
            return await getIdentifiers()
        default:
            throw new Error('Invalid selection')
    }

    return { regexes, identifiers }
}

/**
 * A function to check if a string is a valid JavaScript identifier.
 *
 * The regexes matches strings that start with a letter, underscore, or dollar sign ([a-zA-Z_$]),
 * followed by zero or more letters, digits, underscores, or dollar signs ([a-zA-Z0-9_$]*).
 * The ^ and $ anchors ensure that the entire string is matched.
 *
 * @param {string} str - The string to check.
 * @returns {boolean} Returns true if the string is a valid identifier, else false.
 */
function isValidIdentifier(str: string) {
    const identifierRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/

    return identifierRegex.test(str) && !reservedKeywords.includes(str)
}

// A list of reserved keywords in JavaScript/TypeScript
const reservedKeywords = [
    'abstract',
    'any',
    'as',
    'async',
    'await',
    'boolean',
    'break',
    'case',
    'catch',
    'class',
    'const',
    'continue',
    'debugger',
    'declare',
    'default',
    'delete',
    'do',
    'else',
    'enum',
    'export',
    'extends',
    'false',
    'finally',
    'for',
    'from',
    'function',
    'get',
    'if',
    'implements',
    'import',
    'in',
    'infer',
    'instanceof',
    'interface',
    'is',
    'keyof',
    'let',
    'module',
    'namespace',
    'never',
    'new',
    'null',
    'number',
    'object',
    'of',
    'package',
    'private',
    'protected',
    'public',
    'readonly',
    'require',
    'return',
    'set',
    'static',
    'string',
    'super',
    'switch',
    'symbol',
    'this',
    'throw',
    'true',
    'try',
    'type',
    'typeof',
    'unique',
    'unknown',
    'var',
    'void',
    'while',
    'with',
    'yield',
]

function validateIdentifiers(value: string) {
    const identifiers = value.split(',').map((v) => v.trim())
    const invalidIdentifiers = identifiers.filter(
        (id) => !isValidIdentifier(id)
    )
    return invalidIdentifiers.length === 0
        ? true
        : `Invalid identifier(s): ${invalidIdentifiers.join(', ')}`
}
