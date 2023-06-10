# TStevedore

TStevedore is a utility that automates the task of changing typescript imports from one module to be from another module. 
It provides a straightforward API and an interactive prompt for ease of use.

For example if you have a module `my-utils` that exports a function `myFunction`, but you decide to create a new module
`my-functions` that exports the same function, you can use TStevedore to change all imports of `my-utils` to `my-functions`.

Outputs are prettier-formatted.

**Before:**
```
import { myFunction, someOtherModule } from 'my-utils';
```

**After:**
```
import { someOtherModule } from 'my-utils';
import { myFunction } from 'my-functions';
```

## Usage

To run TStevedore, use the following command:

```sh
npx tstevedore
``` 

### Command Line Interface

TStevedore is meant to be run interactively with the `npx tstevedore` To run TStevedore with command-line arguments, use:

```sh
npx stevedore --identifiers [identifiers] --oldModule [oldModule] --newModule [newModule] --regex [regex]
--directory [directory] --ignoreNodeModules
```

Arguments:

* `-i, --identifiers`: Identifiers to target (array of strings)
* `-o, --oldModule`: Old module name
* `-n, --newModule`: New module name
* `-r, --regex`: Regex to target (array of strings)
* `-d, --directory`: Path to the directory you want to target (default is current directory)
* `--ignoreNodeModules`: Ignore `node_modules/**`? (boolean, default is true)

The `identifiers`, `oldModule`, and `newModule` arguments are mandatory. If any are missing, the tool will not run.

## Installation

TStevedore doesn't require explicit installation if you're using `npx`. However, if you'd like to install it globally on
your system, use the following command:

```sh
npm install -g tstevedore
```
