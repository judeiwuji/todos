import { Sequelize } from 'sequelize-typescript';
import * as mysql from 'mysql2';
import * as dotenv from 'dotenv';
import User from '../User';
import TodoItem from '../TodoItem';
import Todo from '../Todo';
dotenv.config();

const DB = new Sequelize({
  database: process.env['DB_NAME'],
  host: process.env['DB_HOST'],
  password: process.env['DB_PASS'],
  username: process.env['DB_USER'],
  dialect: 'mysql',
  dialectModule: mysql,
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    paranoid: true,
    timestamps: true,
  },
  //   logging: false,
  timezone: '+01:00',
  models: [User, Todo, TodoItem],
});

export default DB;
