import { Response } from 'express';
import IRequest from '../interfaces/IRequest';
import TodoService from '../services/TodoService';
import validate from '../validators/validate';
import {
  TodoCreationSchema,
  TodoItemCreationSchema,
  TodoItemUpdateSchema,
  TodoUpdateSchema,
} from '../validators/schemas/TodoSchema';
import User from '../models/User';

export default class TodoController {
  static async getDashboardPage(req: IRequest, res: Response) {
    const page = Number(req.query.page) || 1;
    try {
      const todoService = new TodoService();
      const data = await todoService.getTodos(page, req.user as User);
      res.render('todos/dashboard', {
        page: {
          title: 'My Todos - Todos',
          description: 'Start organizing your tasks',
        },
        path: req.path,
        isLoggedIn: !!req.user,
        todos: data.results,
      });
      console.log(data);
    } catch (error: any) {
      req.flash('error', error.message);
      res.redirect('/');
    }
  }

  static async createTodo(req: IRequest, res: Response) {
    const todoService = new TodoService();
    console.log(req.body);
    try {
      const data = await validate(TodoCreationSchema, req.body);
      const todo = await todoService.createTodo(data, req.user as User);

      req.flash('info', `todo created successfully`);
      res.redirect(`/todos/${todo.id}`);
    } catch (error: any) {
      req.flash('error', error.message);
      res.redirect('/dashboard');
    }
  }

  static async updateTodo(req: IRequest, res: Response) {
    const { id } = req.params;
    const todoService = new TodoService();

    try {
      const data = await validate(TodoUpdateSchema, req.body);
      data.id = id;
      const todo = await todoService.updateTodo(data, req.user as User);

      req.flash('info', `todo updated successfully`);
      res.send(todo);
    } catch (error: any) {
      req.flash('error', error.message);
      res.redirect(`/todos/${id}`);
    }
  }

  static async getTodoPage(req: IRequest, res: Response) {
    const { id } = req.params;
    const todoService = new TodoService();

    try {
      const todo = await todoService.getTodo(id, req.user as User);
      console.log(todo.toJSON());
      res.render('todos/todo', {
        page: {
          title: 'Todo Details',
          description: 'Manage your todos',
        },
        path: req.path,
        isLoggedIn: !!req.user,
        todo: todo.toJSON(),
      });
    } catch (error: any) {
      req.flash('error', error.message);
      res.redirect(`/dashboard`);
    }
  }

  static async addTodoItem(req: IRequest, res: Response) {
    const { id } = req.params;
    const todoService = new TodoService();

    try {
      const data = await validate(TodoItemCreationSchema, req.body);
      const item = await todoService.addTodoItem(data, id);

      req.flash('info', `item added successfully`);
      res.send(item);
    } catch (error: any) {
      res.send({ error: error.message });
    }
  }

  static async updateTodoItem(req: IRequest, res: Response) {
    const { id } = req.params;
    const todoService = new TodoService();

    try {
      const data = await validate(TodoItemUpdateSchema, req.body);
      data.id = id;
      const todo = await todoService.updateTodoItem(data, id);

      req.flash('info', `todo updated successfully`);
      res.send(todo);
    } catch (error: any) {
      req.flash('error', error.message);
      res.redirect(`/todos/${id}`);
    }
  }

  static async removeTodoItem(req: IRequest, res: Response) {
    const { id } = req.params;
    const todoService = new TodoService();

    try {
      const item = await todoService.deleteTodoItem(id);
      res.send(true);
    } catch (error: any) {
      res.send({ error: error.message });
    }
  }

  static async markTodoItemAsDone(req: IRequest, res: Response) {
    const { id } = req.params;
    const todoService = new TodoService();

    try {
      const item = await todoService.markTodoItemAsDone(id);
      res.send(item);
    } catch (error: any) {
      res.send({ error: error.message });
    }
  }

  static async markTodoItemAsUndone(req: IRequest, res: Response) {
    const { id } = req.params;
    const todoService = new TodoService();

    try {
      const item = await todoService.markTodoItemAsUndone(id);
      res.send(item);
    } catch (error: any) {
      res.send({ error: error.message });
    }
  }

  static async deleteTodo(req: IRequest, res: Response) {
    const { id } = req.params;
    const todoService = new TodoService();

    try {
      await todoService.deleteTodo(id);
      res.send(true);
    } catch (error: any) {
      res.send({ error: error.message });
    }
  }
}
