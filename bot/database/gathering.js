import { Sequelize, Model, DataTypes } from 'sequelize';

import { JOBS } from '../constants';

/**
 * Adds the gathering model to sequlize.
 *
 * @param {Sequelize} sequelize - the sequlize instance.
 * @returns {Model} the gathering model.
 */
export function gathering(sequelize) {
  return sequelize.define('gathering', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hidden: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    zone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    region: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    place: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    map_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    x: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    y: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  });
}
