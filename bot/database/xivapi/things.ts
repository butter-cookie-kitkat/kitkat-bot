import { Table, Column, Model, DataType, BelongsToMany } from 'sequelize-typescript';

import { Points } from './points';
import { ThingPoints } from './thing_points';

export type THING_TYPE = ('BNPC'|'Node');

export interface IThings {
  id: number;
  type: THING_TYPE;
  name: string;
  hidden: boolean;
}

@Table
export class Things extends Model<Things> implements IThings {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type!: THING_TYPE;

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
