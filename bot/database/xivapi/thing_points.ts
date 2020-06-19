import { Table, Column, Model, DataType } from 'sequelize-typescript';

export interface IThingPoints {
  thing_id: string;
  point_id: string;
}

@Table
export class ThingPoints extends Model<ThingPoints> implements IThingPoints {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  thing_id!: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  point_id!: string;
}
