import { Sequelize, Model, DataTypes } from 'sequelize';

/**
 * Adds the song model to sequlize.
 *
 * @param {Sequelize} sequelize - the sequlize instance.
 * @returns {Model} the song model.
 */
export function song(sequelize) {
  return sequelize.define('song', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    channelID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
}
