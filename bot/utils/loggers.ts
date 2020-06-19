import debug from 'debug';

export const main = debug('kitkat-bot');
export const commands = main.extend('commands');
export const music = main.extend('music');
export const messages = main.extend('messages');
export const workers = main.extend('workers');
export const database = main.extend('database');
