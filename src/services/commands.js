import dedent from 'dedent';
import * as Normalize from '../utils/normalize.js';
import * as Random from '../utils/random.js';
import * as Concat from '../utils/concat.js';

const commands = Normalize.commands({
    help: {
        command: help,
        description: 'Display a list of the available commands.'
    },
    roll: {
        command: roll,
        description: 'Roll a dice with the given max value.',
        args: {
            max: 'The maximum dice value.'
        }
    },
    rolld4: {
        command: rolld4,
        description: 'Roll a d4.'
    },
    rolld6: {
        command: rolld6,
        description: 'Roll a d6.'
    },
    rolld8: {
        command: rolld8,
        description: 'Roll a d8.'
    },
    rolld12: {
        command: rolld12,
        description: 'Roll a d12.'
    },
    rolld20: {
        command: rolld20,
        description: 'Roll a d20.'
    },
    rolld100: {
        command: rolld100,
        description: 'Roll a d100.'
    }
});

const aliases = {
    halp: commands.help,
    roll4: commands.rolld4,
    roll6: commands.rolld6,
    roll8: commands.rolld8,
    roll12: commands.rolld12,
    roll20: commands.rolld20,
    roll100: commands.rolld100
};

export async function help(message) {
    await message.reply(dedent`
        Here's a list of the available commands!

        ${Object.entries(commands).map(([name, { description, args }]) => dedent`
            \`${Concat.concat(
                `.${name}`,
                ...Object.entries(args).map(([name]) => `<${name}>`)
            )}\` - ${description}
        `).join('\r\n')}
    `);
}

export async function roll(message, size) {
    await message.reply(`You rolled a ${Random.integer(1, size)}.`);
}

export async function rolld4(message) {
    await roll(message, 4);
}

export async function rolld6(message) {
    await roll(message, 6);
}

export async function rolld8(message) {
    await roll(message, 6);
}

export async function rolld12(message) {
    await roll(message, 12);
}

export async function rolld20(message) {
    const result = Random.integer(1, 20);
    
    await message.reply(Concat.concat(
        `You rolled a ${result}.`,
        result === 20 ? 'Critical Hit!' : null
    ));
}

export async function rolld100(message) {
    await roll(message, 100);
}

export function FindCommand(name) {
    if (aliases[name]) return aliases[name].command;
    else if (commands[name]) return commands[name].command;
    else return null;
}

export function ProcessCommand(message) {
    const match = message.content.match(/^\.(.+)/);

    if (!match) return;

    const [, rawCommand] = match;

    const [name, ...args] = rawCommand.split(' ');

    console.log(`Processing command... (${rawCommand})`);

    const command = FindCommand(name);

    if (!command) return;

    console.log(`Match found, executing! (${rawCommand})`);

    command(message, ...args);
}