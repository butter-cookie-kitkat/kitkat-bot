import { Table, Column, Model, DataType } from 'sequelize-typescript';

export interface IThingPoints {
  thing_id: number;
  point_id: string;
}

@Table
export class ThingPoints extends Model<ThingPoints> implements IThingPoints {
  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  thing_id!: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  point_id!: string;
}
