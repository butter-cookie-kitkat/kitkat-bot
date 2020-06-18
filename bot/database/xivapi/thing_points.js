import { Sequelize, DataTypes } from 'sequelize';

// TODO: Figure out why this one table keeps getting dumped every time the app is rerun...

/**
 * Adds the xivapi_thing_points model to sequlize.
 *
 * @param {Sequelize} sequelize - the sequlize instance.
 */
export function thing_points(sequelize) {
  const { xivapi_things, xivapi_points } = sequelize.models;

  const xivapi_thing_points = sequelize.define('xivapi_thing_points', {
    thing_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    point_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  });

  xivapi_things.belongsToMany(xivapi_points, {
    through: xivapi_thing_points,
    foreignKey: 'thing_id',
    otherKey: 'point_id',
  });
  xivapi_points.belongsToMany(xivapi_things, {
    through: xivapi_thing_points,
    foreignKey: 'point_id',
    otherKey: 'thing_id',
  });
  xivapi_things.hasMany(xivapi_thing_points, {
    foreignKey: 'thing_id',
  });
  xivapi_thing_points.belongsTo(xivapi_things, {
    foreignKey: 'thing_id',
  });
  xivapi_points.hasMany(xivapi_thing_points, {
    foreignKey: 'point_id',
  });
  xivapi_thing_points.belongsTo(xivapi_points, {
    foreignKey: 'point_id',
  });
}
