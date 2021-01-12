import { Sequelize, ModelCtor, Model } from 'sequelize-typescript';

import { CONFIG } from '../config';
import { Announcements } from './announcements';
import * as Loggers from '../utils/loggers';

/**
 * The sequlize instance.
 */
let db: Promise<Sequelize>;

/**
 * Initializes the database.
 */
function init(models?: any[]): Sequelize {
  return new Sequelize(CONFIG.DATABASE_URL, {
    logging: CONFIG.SEQUELIZE_LOGGING ? Loggers.database : false,
    typeValidation: true,
    define: {
      timestamps: false,
    },
    models: models,
  });
}

/**
 * Returns the sequelize instance.
 *
 * @param excludeModels - doesn't attach the models to the sequelize instance.
 * @returns the sequelize instance.
 */
export async function database(): Promise<DatabaseModelResponse>
export async function database(excludeModels: true): Promise<DatabaseResponse>
export async function database(excludeModels?: boolean): Promise<DatabaseResponse|DatabaseModelResponse> {
  if (excludeModels) {
    const sequelize = init();

    await sequelize.authenticate();

    return { db: sequelize };
  } else if (!db) {
    Loggers.database('Connecting to database...');

    db = Promise.resolve().then(async () => {
      const sequelize = init([
        Announcements,
      ]);

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
    Announcements,
  };
}

export interface DatabaseResponse {
  db: Sequelize;
}

export interface DatabaseModelResponse extends DatabaseResponse {
  Announcements: typeof Announcements;
}
