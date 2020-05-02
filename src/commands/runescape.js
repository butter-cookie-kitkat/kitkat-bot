import AsciiTable from 'ascii-table';
import outdent from 'outdent';
import { RS3, OSRS } from '../services/runescape.js';

function CreateTable({ columns, results }) {
  const table = new AsciiTable();
  table.setHeading(...columns);

  for (const result of results.slice(0, 10)) {
    table.addRow(...Object.values(result));
  }

  return table.toString();
}

export const ge = {
  name: 'ge',
  description: 'Searches the GE for a given item in RS3 and OSRS',
  args: {
    name: 'The item name to search for.'
  },
  command: async ({ message }, ...args) => {
    const name = args.join(' ');
    const [rs3, osrs] = await Promise.all([
      RS3.search(name),
      OSRS.search(name)
    ]);

    await message.reply(outdent`
      Here's the current price of all items matching "${name}" on the Grand Exchange!
    `);

    if (rs3.results.length > 0) {
      await message.channel.send(outdent`
        **RuneScape 3**
        \`\`\`
        ${CreateTable(rs3)}
        \`\`\`
      `);
    }

    if (osrs.results.length > 0) {
      await message.channel.send(outdent`
        **OldSchool RuneScape**
        \`\`\`
        ${CreateTable(osrs)}
        \`\`\`
      `);
    }
  }
};

export default [
  ge
].map((command) => ({
  ...command,
  group: 'RuneScape'
}));
