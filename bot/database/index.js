import { Sequelize, ModelCtor, Model } from 'sequelize';
import { CONFIG } from '../config';
import { song } from './song';

/**
 * @typedef {Object} DatabaseResponse
 * @property {Sequelize} db - the sequlize instance.
 * @property {ModelCtor<Model<any, any>>} song - the song model.
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
      logging: !CONFIG.IS_LIVE,
      typeValidation: true,
      define: {
        timestamps: false,
      },
    });

    await song(sequelize);

    await sequelize.authenticate();
    await sequelize.sync();
  }

  return {
    db: sequelize,
    ...sequelize.models,
  };
}
