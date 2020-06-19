import { Table, Column, Model, DataType, BelongsToMany } from 'sequelize-typescript';

import { Points } from './points';
import { ThingPoints } from './thing_points';

const TYPES = ['NPC', 'Item'];

export interface IThings {
  id: string;
  type: string;
  name: string;
  hidden: boolean;
}

@Table
export class Things extends Model<Things> implements IThings {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      isIn: [Object.keys(TYPES)],
    },
  })
  type!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  hidden!: boolean;

  @BelongsToMany(() => Points, () => ThingPoints, 'thing_id', 'point_id')
  points!: Points[];
}
