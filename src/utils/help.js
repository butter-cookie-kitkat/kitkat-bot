import { outdent } from 'outdent';
import { concat } from './concat';
import { padLeft } from './pad';

export class HelpFormatter {
  static example(command) {
    const example = concat(
      `.${command.name}`,
      ...Object.entries(command.args).filter(([, arg]) => arg.positional).map(([name]) => `<${name}>`),
    );

    return `\`${example}\``;
  }

  static args(args, detailed) {
    if (Object.keys(args).length === 0) return null;

    if (detailed) {
      const maxLength = Math.max(...Object.entries(args).map(([name, arg]) => arg.positional ? name.length : name.length + 2));

      return outdent`
        \`\`\`
        ${Object.entries(args).map(([name, arg]) => HelpFormatter.arg(name, arg, { maxLength, detailed: true })).join('\r\n')}
        \`\`\`
      `;
    }

    return concat(...Object.entries(args).filter(([, arg]) => arg.positional).map(([name, arg]) => HelpFormatter.arg(name, arg)));
  }

  static arg(name, arg, { maxLength = 0, detailed = false } = {}) {
    if (detailed) {
      const prefix = arg.positional ? '' : '--';

      return outdent`
        ${padLeft(prefix + name, maxLength)} - ${arg.description}
      `;
    }

    return `<${name}>`;
  }

  static command(command, detailed = false) {
    if (detailed) {
      const args = HelpFormatter.args(command.args, true);

      return outdent`
        **Usage:** ${HelpFormatter.example(command)}

        > ${command.description}

        ${args ? outdent`
          **Options**

          ${args}
        ` : ''}
      `;
    }

    return `${HelpFormatter.example(command)} - ${command.description}`;
  }

  static group(name, commands) {
    const filteredCommands = commands.filter((command) => !command.hidden);

    if (name === '.') {
      return filteredCommands.map((command) => HelpFormatter.command(command)).join('\r\n');
    }

    return outdent`
      **${name}**

        ${filteredCommands.map((command) => HelpFormatter.command(command)).join('\r\n  ')}
    `;
  }
}
