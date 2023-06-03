import {
  Column,
  DataType,
  ForeignKey,
  HasMany,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import User from './User';
import { Optional } from 'sequelize';
import TodoItem from './TodoItem';

export interface TodoAttributes {
  totalDone: number;
  total: number;
  id: string;
  userId: string;
  title: string;
  items: TodoItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoCreationAttributes
  extends Optional<
    TodoAttributes,
    'id' | 'items' | 'totalDone' | 'total' | 'createdAt' | 'updatedAt'
  > {}
@Table
export default class Todo extends Model<
  TodoAttributes,
  TodoCreationAttributes
> {
  @IsUUID(4)
  @PrimaryKey
  @Column({ defaultValue: DataType.UUIDV4 })
  id!: string;

  @IsUUID(4)
  @ForeignKey(() => User)
  @Column
  userId!: string;

  @Column(DataType.STRING(150))
  title!: string;

  @HasMany(() => TodoItem)
  items!: TodoItem[];
}
