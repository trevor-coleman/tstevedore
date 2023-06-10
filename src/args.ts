import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { TransformerOptions } from './types/TransformerOptions'

interface CommandLineArgs {
    s: string[]
    o: string
    r: string[]
    n: string
    _: (string | number)[]
    $0: string
}

const helpMessage = `

TStevedore: A tool to help you move your imports around! 

NOTE: Run without arguments for interactive prompts'

`
export function parseArgs() {
    const argv = yargs(hideBin(process.argv))
        .usage(`${helpMessage}Usage: $0 [options]`)
        .option('i', {
            alias: 'identifiers',
            description: 'Identifiers to target',
            type: 'array',
        })
        .option('r', {
            alias: 'regex',
            description: 'Regex to target',
            type: 'array',
        })
        .option('o', {
            alias: 'oldModule',
            description: 'Old module name',
            type: 'string',
        })
        .option('n', {
            alias: 'newModule',
            description: 'New module name',
            type: 'string',
        })
        .option('ignore-node', {
            alias: 'ignoreNodeModules',
            description: 'Ignore `node_modules/**`?',
            type: 'boolean',
            default: true,
        })
        .option('d', {
            alias: 'directory',
            description: 'Path to the directory you want to target',
            type: 'string',
            default: '.',
        })
        .demandOption(
            ['s', 'o', 'n'],
            'Please provide all arguments to work with this tool'
        )
        .help().argv as unknown as CommandLineArgs

    const args: TransformerOptions = {
        identifiers: argv?.s ?? [],
        regexes: argv.r?.map((regex) => new RegExp(regex)) ?? [],
        oldModuleName: argv.o,
        newModuleName: argv.n,
        directory: argv._[0] as string,
    }

    return args
}
