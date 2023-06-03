import {
  Column,
  DataType,
  ForeignKey,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import Todo from './Todo';
import { Optional } from 'sequelize';

export interface TodoItemAttributes {
  id: string;
  todoId: string;
  task: string;
  done: boolean;
}

export interface TodoItemCreationAttributes
  extends Optional<TodoItemAttributes, 'id' | 'done'> {}

@Table
export default class TodoItem extends Model<
  TodoItemAttributes,
  TodoItemCreationAttributes
> {
  @IsUUID(4)
  @PrimaryKey
  @Column({ defaultValue: DataType.UUIDV4 })
  id!: string;

  @IsUUID(4)
  @ForeignKey(() => Todo)
  @Column
  todoId!: string;

  @Column(DataType.STRING(250))
  task!: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  done!: boolean;
}
