import { Random } from '../utils/random.js';

let activeTroll;

const TROLL_EFFECTS = [
  'private.discord-notification'
];

export function ToggleTroll(client) {
  if (activeTroll) {
    clearTimeout(activeTroll);
    activeTroll = null;
  } else {
    Troll(client);
  }
}

export function Troll(client) {
  activeTroll = setTimeout(async () => {
    if (client.music.isInVoiceChannel) {
      await client.music.effect(client.music._voiceChannel.id, Random.item(TROLL_EFFECTS), true);
    }

    Troll(client);
  }, Random.integer(60000, 3600000));
}
