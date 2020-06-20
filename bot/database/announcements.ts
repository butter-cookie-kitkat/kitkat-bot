import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Announcements extends Model<Announcements> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    primaryKey: true,
  })
  marker!: string;

  @Column({
    type: DataType.STRING,
  })
  message_id!: string;
}
