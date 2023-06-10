import { input, confirm } from '@inquirer/prompts'

export async function getModuleName(message: string): Promise<any> {
    let oldModuleNameInput = await input({
        message,
        validate: (value) => {
            return isValidModuleImportPath(value) ? true : 'Invalid module name'
        },
    })

    if (isRelativeModuleImportPath(oldModuleNameInput)) {
        const relativePathIsOk = await confirm({
            message: `${oldModuleNameInput} appears to be a relative path. Is that correct?`,
            default: true,
        })

        if (!relativePathIsOk) {
            oldModuleNameInput = await getModuleName(message)
        }
    }

    return oldModuleNameInput
}

function isValidModuleImportPath(importPath: string): boolean {
    const moduleImportRegex = /^(@?[a-zA-Z0-9_./-]+)+$/
    return moduleImportRegex.test(importPath)
}

function isRelativeModuleImportPath(importPath: string): boolean {
    return /^\.\.?\//.test(importPath)
}
