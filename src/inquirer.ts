import {input} from '@inquirer/prompts'


async function inquirerPrompt() {
   const answer = await input({message: 'What is your name?'})
}
