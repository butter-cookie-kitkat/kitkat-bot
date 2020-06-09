import 'dotenv/config';

export const CONFIG = {
  SEQUELIZE_LOGGING: Boolean(process.env.SEQUELIZE_LOGGING) && !process.env.CI,
  DATABASE_URL: process.env.DATABASE_URL || 'sqlite://:memory',
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,

  IS_LIVE: process.env.IS_LIVE || false,
  NOTIFICATIONS_CHANNEL_ID: process.env.NOTIFICATIONS_CHANNEL_ID,
  ANNOUNCEMENTS_CHANNEL_ID: process.env.ANNOUNCEMENTS_CHANNEL_ID,
}
