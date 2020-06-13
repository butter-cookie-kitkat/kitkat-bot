import DiscordJS from 'discord.js';
import { chance } from './chance';

const ACK_REACTIONS = ['👍'];
const AWAITING_REACTIONS = ['a:loading:718307876724015105']
const FAILURE_REACTIONS = ['⛔'];

export class Reactor {
  /**
   * Automatically adds emoji to indicate the state of a request.
   *
   * @template T
   * @param {DiscordJS.Message} message - the message to react to.
   * @param {Promise<T>} promise - the promise to wait for.
   * @returns {Promise<T>} - the promise in question.
   */
  async loading(message, promise) {
    /**
     * @type {DiscordJS.MessageReaction}
     */
    const reaction = await this.awaiting(message);

    let response;

    try {
      response = await promise;

      await this.success(message);
    } catch (error) {
      await this.failure(message);

      throw error;
    } finally {
      await Promise.all(
        Array.from(reaction.users.cache.values())
          .filter((user) => user.bot)
          .map(({ id }) => reaction.users.remove(id)),
      );
    }

    return response;
  }


  /**
   * Indicates to the user that the command failed for some reason.
   *
   * @param {DiscordJS.Message} message - the message to react to.
   * @returns {Promise<DiscordJS.MessageReaction>} the reaction
   */
  failure(message) {
    return message.react(chance.pickone(FAILURE_REACTIONS));
  }

  /**
   * Indicates to the user that the command was executed successfully.
   *
   * @param {DiscordJS.Message} message - the message to react to.
   * @returns {Promise<DiscordJS.MessageReaction>} the reaction
   */
  success(message) {
    return message.react(chance.pickone(ACK_REACTIONS));
  }

  /**
   * Indicates to the user that the command is in progress.
   *
   * @param {DiscordJS.Message} message - the message to react to.
   * @returns {Promise<DiscordJS.MessageReaction>} the reaction
   */
  awaiting(message) {
    return message.react(chance.pickone(AWAITING_REACTIONS));
  }
}

export const reactor = new Reactor();
