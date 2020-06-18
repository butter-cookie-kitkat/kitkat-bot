import { Sequelize, DataTypes } from 'sequelize';

/**
 * Adds the xivapi_points model to sequlize.
 *
 * @param {Sequelize} sequelize - the sequlize instance.
 */
export function points(sequelize) {
  sequelize.define('xivapi_points', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    map_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    x: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    y: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });
}
