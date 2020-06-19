import { Table, Column, Model, DataType, BelongsToMany } from 'sequelize-typescript';

import { Things } from './things';
import { ThingPoints } from './thing_points';

export interface IPoints {
  id: string;
  map_id: number;
  x: number;
  y: number;
}

@Table
export class Points extends Model<Points> implements IPoints {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  map_id!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  x!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  y!: number;

  @BelongsToMany(() => Things, () => ThingPoints, 'point_id', 'thing_id')
  things!: Things[];
}
