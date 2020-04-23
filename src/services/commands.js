import * as Random from '../utils/random.js';

export async function rolld20(message) {
    await message.reply(`You rolled a ${Random.integer(0, 20)}!`);
}

const commands = {
    roll20: rolld20,
    rolld20
};

export function ProcessCommand(message) {
    const match = message.content.match(/^\.([^\s]+)/);

    if (!match) return;

    const [, command] = match;

    console.log(`Processing command... (${command})`);

    if (commands[command]) {
        console.log(`Match found, executing! (${command})`);
        
        commands[command](message);
    }
}