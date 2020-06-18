import { Sequelize } from 'sequelize';
import { things } from './things';
import { points } from './points';
import { thing_points } from './thing_points';

/**
 * Adds the xivapi models to sequlize.
 *
 * @param {Sequelize} sequelize - the sequlize instance.
 */
export function xivapi(sequelize) {
  things(sequelize);
  points(sequelize);
  thing_points(sequelize);
}
