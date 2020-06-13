import debug from 'debug';

import { Sequelize, ModelCtor, Model } from 'sequelize';

import { CONFIG } from '../config';
import { song } from './song';
import { crafter } from './crafter';

/**
 * @typedef {Object} DatabaseResponse
 * @property {Sequelize} db - the sequlize instance.
 * @property {ModelCtor<Model<any, any>>} song - the song model.
 * @property {ModelCtor<Model<any, any>>} crafter - the crafter model.
 */

/**
 * @type {Sequelize} the sequlize instance.
 */
let sequelize;

/**
 * Returns the sequelize instance.
 *
 * @returns {Promise<DatabaseResponse>} the sequelize instance.
 */
export async function database() {
  if (!sequelize) {
    sequelize = new Sequelize(CONFIG.DATABASE_URL, {
      logging: CONFIG.SEQUELIZE_LOGGING ? debug('kitkat-bot:database') : () => {},
      typeValidation: true,
      define: {
        timestamps: false,
      },
    });

    await song(sequelize);
    await crafter(sequelize);

    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
  }

  return {
    db: sequelize,
    ...sequelize.models,
  };
}
