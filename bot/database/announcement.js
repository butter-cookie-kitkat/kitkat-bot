import { Sequelize, Model, DataTypes } from 'sequelize';

/**
 * Adds the announcement model to sequlize.
 *
 * @param {Sequelize} sequelize - the sequlize instance.
 * @returns {Model} the announcement model.
 */
export function announcement(sequelize) {
  return sequelize.define('announcement', {
    message_id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    marker: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
}
