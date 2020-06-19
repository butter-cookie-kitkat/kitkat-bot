import { outdent } from 'outdent';

export const Messages = {
  DMS_NOT_ALLOWED: outdent`
    Baka! This command only works inside of a Server!
  `,

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

  FORBIDDEN: outdent`
    Senpai, we're not supposed to touch that...
  `,

  PLAYLIST_NOT_FOUND: outdent`
    We were having issues finding a playlist at that url, are you sure that's the right one?
  `,

  VIDEO_NOT_FOUND: outdent`
    We were having issues finding a video at that url, are you sure that's the right one?
  `,

  CURRENT_SONG_NOT_FOUND: outdent`
    Looks like there aren't any songs in the queue?!? How in the world could this be!
  `,

  INVALID_YOUTUBE_URL: outdent`
    Hey Senpai what are you doing?!? This isn't a YouTube URL!
  `,
}

export const DEBUG_MESSAGES = {
  AUTO_LEAVE: (reason: string): string => `Automatically leaving voice channel. (Reason: ${reason})`,
}
