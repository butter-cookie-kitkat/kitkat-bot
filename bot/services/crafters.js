import { database } from '../database';
import { Model } from 'sequelize';

/**
 * @typedef {Object} Crafter
 * @property {number} level - the crafter level
 * @property {number} craftsmanship - the craftsmanship of the crafter
 * @property {number} control - the control of the crafter
 * @property {number} cp - the cp of the crafter
 */

export class Crafters {
  /**
   * Replaces the users crafter.
   *
   * @param {string} uid - the id of the user
   * @param {string} job - the job of the user
   * @param {Crafter} crafterInfo - the crafter information.
   */
  async replace(uid, job, crafterInfo) {
    const { crafter } = await database();

    await crafter.upsert({
      uid,
      job,
      ...crafterInfo,
    });
  }

  /**
   * Finds the crafter for the given user.
   *
   * @param {string} uid - the id of the user
   * @param {string} job - the job of the user
   * @returns {Promise<Model>} - the crafter associated with the user and job.
   */
  async get(uid, job) {
    const { crafter } = await database();

    return crafter.findOne({
      where: {
        uid,
        job,
      },
      raw: true,
    });
  }

  /**
   * Finds the crafters for the given user.
   *
   * @param {string} uid - the id of the user
   * @returns {Promise<Model>} - the crafters associated with the user.
   */
  async getAll(uid) {
    const { crafter } = await database();

    return crafter.findAll({
      where: {
        uid,
      },
      raw: true,
    });
  }
}

export const crafters = new Crafters();
