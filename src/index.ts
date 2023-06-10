import { args } from './args';
import { glob } from 'glob';
import { transformAndPrint } from './parse';


async function main() {


  const files = await glob(`${args.directory}/**/*.ts?(x)`);
  await Promise.all(
      files.map((file) => transformAndPrint(file, args))
  );
}


main();
