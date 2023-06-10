import fs from 'fs'
import { input } from '@inquirer/prompts'

export async function getPath(): Promise<string> {
    return await input({
        message: 'What is the path to the directory you want to target?',
        validate: isValidDirectory,
    })
}

function isValidDirectory(input: string) {
    const path = `${process.cwd()}/${input}`
    if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
        return true
    } else {
        return 'Please enter a valid directory path'
    }
}
