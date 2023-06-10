import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { TransformerOptions } from './types/TransformerOptions';

interface CommandLineArgs {
  s: string[];
  o: string;
  r: string[];
  n: string;
  _: (string | number)[];
  $0: string;
}



const argv = yargs(hideBin(process.argv))
    .option('s', {
      alias: 'symbols',
      description: 'Symbols to target',
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
    .demandOption(['s', 'o', 'n'], 'Please provide all arguments to work with this tool')
    .help()
    .argv as unknown as CommandLineArgs;


export const args:TransformerOptions = {
  targetSymbols: argv?.s ?? [],
  targetRegex: argv.r?.map((regex) => new RegExp(regex)) ?? [],
  oldModuleName: argv.o,
  newModuleName: argv.n,
  directory: argv._[0] as string,
}

