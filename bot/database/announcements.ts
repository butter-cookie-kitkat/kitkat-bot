import { Table, Column, Model, DataType } from 'sequelize-typescript';

export interface IAnnouncements {
  marker: string;
  message_id: string;
}

@Table
export class Announcements extends Model<IAnnouncements> implements IAnnouncements {
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
