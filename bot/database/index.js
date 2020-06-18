import debug from 'debug';

import { Sequelize } from 'sequelize';

import { CONFIG } from '../config';
import { song } from './song';
import { crafter } from './crafter';
import { xivapi } from './xivapi';
import { announcement } from './announcement';
import * as Loggers from '../utils/loggers';

/**
 * @typedef {Object} DatabaseResponse
 * @property {Sequelize} db - the sequlize instance.
 * @property {import('sequelize').ModelCtor<import('sequelize').Model<any, any>>} song - the song model.
 * @property {import('sequelize').ModelCtor<import('sequelize').Model<any, any>>} crafter - the crafter model.
 * @property {import('sequelize').ModelCtor<import('sequelize').Model<any, any>>} announcement - the announcement model.
 * @property {import('sequelize').ModelCtor<import('sequelize').Model<any, any>>} xivapi_things - the xivapi_things model.
 * @property {import('sequelize').ModelCtor<import('sequelize').Model<any, any>>} xivapi_points - the xivapi_points model.
 * @property {import('sequelize').ModelCtor<import('sequelize').Model<any, any>>} xivapi_thing_points - the xivapi_thing_points model.
 */

/**
 * @type {Promise<Sequelize>} the sequlize instance.
 */
let db;

/**
 *
 */
function init() {
  return new Sequelize(CONFIG.DATABASE_URL, {
    logging: CONFIG.SEQUELIZE_LOGGING ? Loggers.database : () => {},
    typeValidation: true,
    define: {
      timestamps: false,
    },
  });
}

/**
 * Returns the sequelize instance.
 *
 * @param {boolean} excludeModels - doesn't attach the models to the sequelize instance.
 * @returns {Promise<DatabaseResponse>} the sequelize instance.
 */
export async function database(excludeModels) {
  if (excludeModels) {
    const sequelize = init();

    await sequelize.authenticate();

    return { db: sequelize };
  } else if (!db) {
    Loggers.database('Connecting to database...');

    db = Promise.resolve().then(async () => {
      const sequelize = init();

      Loggers.database('Initializing Models...');
      song(sequelize);
      crafter(sequelize);
      xivapi(sequelize);
      announcement(sequelize);

      Loggers.database('Authenticating...');
      await sequelize.authenticate();
      Loggers.database('Syncing...');
      await sequelize.sync({ alter: true });

      Loggers.database('Database initialized successfully!');
      return sequelize;
    })
  }

  const sequelize = await db;

  return {
    db: sequelize,
    ...sequelize.models,
  };
}
