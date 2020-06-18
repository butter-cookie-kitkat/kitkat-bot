import { Sequelize, DataTypes } from 'sequelize';

const TYPES = ['NPC', 'Item'];

/**
 * Adds the xivapi_things model to sequlize.
 *
 * @param {Sequelize} sequelize - the sequlize instance.
 */
export function things(sequelize) {
  sequelize.define('xivapi_things', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [Object.keys(TYPES)],
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hidden: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  });
}
