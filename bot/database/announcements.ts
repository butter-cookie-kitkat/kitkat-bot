import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Announcements extends Model<Announcements> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  message_id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  marker!: string;
}
