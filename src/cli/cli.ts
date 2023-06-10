import { confirm } from '@inquirer/prompts'

import { TransformerOptions } from '../types/TransformerOptions'
import { getSelectors } from './getSelectors'
import { getModuleName } from './getModuleName'
import { getPath } from './getPath'

const RESET = '\x1b[0m'
const BRIGHT_WHITE = '\x1b[97m'
const BRIGHT_BLUE_BG_WHITE_TEXT = '\x1b[44m\x1b[97m'

const WELCOME: string = `
${BRIGHT_BLUE_BG_WHITE_TEXT}TS${
    RESET + BRIGHT_WHITE
}tevedore${RESET}: the TypeScript import refactoring tool!
`

export async function cli(): Promise<TransformerOptions> {
    console.log(WELCOME)

    const selectors = await getSelectors()

    const oldModuleName = await getModuleName(
        'What is the name of the OLD module the identifiers are currently exported from?'
    )
    const newModuleName = await getModuleName(
        'What is the name of the NEW module the identifiers should be exported from?'
    )
    const directory = await getPath()

    const shouldIgnoreNodeModules = await confirm({
        message: 'Ignore `node_modules/**`?',
        default: true,
    })

    return {
        ...selectors,
        oldModuleName,
        newModuleName,
        directory,
        ignore: shouldIgnoreNodeModules ? ['**/node_modules/**'] : undefined,
    }
}
