import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Songs extends Model<Songs> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  url!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  channelID!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  duration!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  order!: string;
}
