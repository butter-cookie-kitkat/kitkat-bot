import DiscordJS from 'discord.js';

/**
 * @typedef {Object} LoadingOptions
 * @property {DiscordJS.Message} message - the discord.js message.
 * @property {Promise} promise - the promise to wait for
 * @property {string} fallback - the fallback emoji
 * @property {string} emoji - the emoji to update to upon completion.
 */

/**
 * @param {LoadingOptions} options - the options to provide to loading
 */
export async function loading(options) {
  const { message, promise, fallback, emoji } = {
    fallback: 'a:loading:718307876724015105',
    emoji: '👍',
    ...options,
  };

  /**
   * @type {DiscordJS.MessageReaction}
   */
  const reaction = await message.react(fallback);

  try {
    await promise;

    await message.react(emoji);
  } finally {
    await Promise.all(
      Array.from(reaction.users.cache.values())
        .filter((user) => user.bot)
        .map(({ id }) => reaction.users.remove(id)),
    );
  }
}
