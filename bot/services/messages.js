import { outdent } from 'outdent';

export const Messages = {
  NOT_IN_VOICE_CHANNEL: outdent`
    I would if you were in a channel. Baka!
  `,

  BOT_NOT_IN_VOICE_CHANNEL: outdent`
    I would if I were in a channel. Baka!
  `,

  BAD_EFFECT_NAME: outdent`
    Baka! Who would name an effect that?!?
  `,

  NOT_PLAYING_AUDIO: outdent`
    I'm not playing anything, what _exactly_ do you expect me to stop?
  `,

  UNHANDLED_ERROR: outdent`
    Whoa, looks like something went wrong.
    Don't worry though we're looking into it!
  `,

  STOP_TROLLING: outdent`
    Stop being a troll Senpai.
  `,
}

export const DEBUG_MESSAGES = {
  AUTO_LEAVE: (reason) => `Automatically leaving voice channel. (Reason: ${reason})`,
}
