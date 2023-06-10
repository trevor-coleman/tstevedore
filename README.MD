# TStevedore

TStevedore is a utility that automates the task of changing imports from one module to be from another module. It
provides a straightforward API and an interactive prompt for ease of use.

For example if you have a module `my-utils` that exports a function `myFunction`, but you decide to create a new module
`my-functions` that exports the same function, you can use TStevedore to change all imports of `my-utils` to `my-functions`.

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

To run TStevedore with command-line arguments, use:

```sh
npx tstevedore --symbols [symbols] --oldModule [oldModule] --newModule [newModule]
```

Arguments:

* `-s, --symbols`: Symbols to target
* `-o, --oldModule`: Old module name
* `-n, --newModule`: New module name

These arguments are mandatory. If any are missing, the tool will not run.

## Installation

TStevedore doesn't require explicit installation if you're using `npx`. However, if you'd like to install it globally on
your system, use the following command:

```sh
npm install -g tstevedore
```
