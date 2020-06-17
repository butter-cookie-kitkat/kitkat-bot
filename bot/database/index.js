import debug from 'debug';

import { Sequelize } from 'sequelize';

import { CONFIG } from '../config';
import { song } from './song';
import { crafter } from './crafter';
import { gathering } from './gathering';
import { announcement } from './announcement';

/**
 * @typedef {Object} DatabaseResponse
 * @property {Sequelize} db - the sequlize instance.
 * @property {import('sequelize').ModelCtor<import('sequelize').Model<any, any>>} song - the song model.
 * @property {import('sequelize').ModelCtor<import('sequelize').Model<any, any>>} crafter - the crafter model.
 * @property {import('sequelize').ModelCtor<import('sequelize').Model<any, any>>} gathering - the gathering model.
 * @property {import('sequelize').ModelCtor<import('sequelize').Model<any, any>>} announcement - the announcement model.
 */

/**
 * @type {Sequelize} the sequlize instance.
 */
let db;

/**
 * Returns the sequelize instance.
 *
 * @param {boolean} excludeModels - doesn't attach the models to the sequelize instance.
 * @returns {Promise<DatabaseResponse>} the sequelize instance.
 */
export async function database(excludeModels) {
  if (!db || excludeModels) {
    const sequelize = new Sequelize(CONFIG.DATABASE_URL, {
      logging: CONFIG.SEQUELIZE_LOGGING ? debug('kitkat-bot:database') : () => {},
      typeValidation: true,
      define: {
        timestamps: false,
      },
    });

    if (!excludeModels) {
      await song(sequelize);
      await crafter(sequelize);
      await gathering(sequelize);
      await announcement(sequelize);
    }

    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    if (excludeModels) {
      return { db: sequelize };
    } else {
      db = sequelize;
    }
  }

  return {
    db,
    ...db.models,
  };
}
