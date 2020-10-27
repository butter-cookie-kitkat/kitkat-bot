import { outdent } from 'outdent';

export function intl(name: string, args: { [key: string]: string } = {}): string {
  const message = Messages[name];

  if (!message) {
    throw new Error(`Message does not exist.`);
  }

  return message.replace(/{{([\w]+)}}/i, (_, name) => {
    const value = args[name];

    if (!value) {
      throw new Error(`Please provide a value for... (${name})`);
    }

    return value;
  });
}

const Messages: { [key: string]: string } = {
  DMS_NOT_ALLOWED: outdent`
    Baka! This command only works inside of a Server!
  `,

  UNHANDLED_ERROR: outdent`
    Whoa, looks like something went wrong.
    Don't worry though we're looking into it!
  `,

  STOP_TROLLING: outdent`
    Stop being a troll Senpai.
  `,

  FORBIDDEN: outdent`
    Senpai, we're not supposed to touch that...
  `,

  INVALID_OPT_ROLE: outdent`
    This isn't a valid Rank.
  `,
}
