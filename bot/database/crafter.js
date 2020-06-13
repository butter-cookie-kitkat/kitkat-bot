import { Sequelize, Model, DataTypes } from 'sequelize';

import { JOBS } from '../constants';

/**
 * Adds the crafter model to sequlize.
 *
 * @param {Sequelize} sequelize - the sequlize instance.
 * @returns {Model} the crafter model.
 */
export function crafter(sequelize) {
  return sequelize.define('crafter', {
    uid: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    job: {
      type: DataTypes.ENUM(Object.keys(JOBS)),
      allowNull: false,
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    craftsmanship: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    control: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cp: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
}
