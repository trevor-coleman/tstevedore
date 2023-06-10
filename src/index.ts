import { parseArgs } from './args';
import { glob } from 'glob';
import { transformAndPrint } from './parse';
import * as process from 'process';
import { inquirerPrompt } from './inquirer';
import { TransformerOptions } from './types/TransformerOptions';
import { input, select } from '@inquirer/prompts';


async function main() {

  let files: string[] = [];
  let transformerOptions: TransformerOptions;

  if (process.argv.length > 2) {
    transformerOptions = parseArgs();

  } else {
    transformerOptions = await inquirerPrompt();
  }

  files = await glob(`${transformerOptions.directory}/**/*.ts?(x)`);

  console.log(`
  Ready to begin? 
  
  BEFORE: 
  import { ${transformerOptions.targetSymbols?.join(', ') ??
             'MISSING TARGETS'}, baz } from '${transformerOptions.oldModuleName}';
  
  AFTER:
  import { baz } from '${transformerOptions.oldModuleName}'; 
  import { ${transformerOptions.targetSymbols?.join(', ') ??
             'MISSING TARGETS'} } from '${transformerOptions.newModuleName}';
  
  FILES: 
  ${transformerOptions.directory}/**/*.ts?(x)
  
  `);

  const proceed = await select({
    message: 'Proceed?', choices: [
      {name: 'Yes', value: 'yes', description: 'Begin transformation (Warning! Destructive!)'},
      {name: 'Dry Run', value: 'dry-run', description: 'Print a list of files that will be changed'},
      {name: 'CANCEL', value: 'cancel', description: 'Exit without making changes'},
    ],
  });

  if (proceed === 'cancel') {
    console.log('Exiting...');
    process.exit(0);
  }

  const makeChanges = proceed === 'yes';

  await Promise.all(// files.map((file) => console.log(file))
      files.map((file) => transformAndPrint(file, transformerOptions, makeChanges)));
}


main();
