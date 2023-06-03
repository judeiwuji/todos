import { Optional } from 'sequelize';
import {
  Column,
  DataType,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';

export interface UserAttributes {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, 'id'> {}

@Table
export default class User extends Model<
  UserAttributes,
  UserCreationAttributes
> {
  @IsUUID(4)
  @PrimaryKey
  @Column({ defaultValue: DataType.UUIDV4 })
  id!: string;

  @Unique
  @Column(DataType.STRING(60))
  email!: string;

  @Column(DataType.STRING(30))
  firstname!: string;

  @Column(DataType.STRING(30))
  lastname!: string;
}
