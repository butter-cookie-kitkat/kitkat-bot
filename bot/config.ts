import 'dotenv/config';
import pkg from '../package.json';

export function defaults<T>(...values: T[]): T;
export function defaults(...values: any[]): any;
export function defaults(...values: any[]): any {
  return values.find(Boolean) || null;
}

export function env<T>(name: string): string;
export function env<T>(name: string, defaultValue: T): (T|string);
export function env<T>(name: string, defaultValue?: T): (T|string) {
  const value = defaults(process.env[name], defaultValue);

  if (value === undefined) {
    throw new Error(`Expected the "${name}" environment variable to be defined.`);
  }

  return value;
}

export const CONFIG = {
  SEQUELIZE_LOGGING: Boolean(env('SEQUELIZE_LOGGING', false)) && !Boolean(env('CI', false)),
  DATABASE_URL: env('DATABASE_URL', 'sqlite://db.sqlite'),
  DISCORD_TOKEN: env('DISCORD_TOKEN'),
  YOUTUBE_API_KEY: env('YOUTUBE_API_KEY', null),
  XIVAPI_KEY: env('XIVAPI_KEY', null),

  IS_LIVE: Boolean(env('IS_LIVE', false)),
  NOTIFICATIONS_CHANNEL_ID: env('NOTIFICATIONS_CHANNEL_ID', null),
  ANNOUNCEMENTS_CHANNEL_ID: env('ANNOUNCEMENTS_CHANNEL_ID', null),

  VERSION: pkg.sha,
}
