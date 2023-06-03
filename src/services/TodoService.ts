import Pagination from '../models/Pagination';
import Todo, { TodoAttributes, TodoCreationAttributes } from '../models/Todo';
import TodoItem, {
  TodoItemAttributes,
  TodoItemCreationAttributes,
} from '../models/TodoItem';
import User from '../models/User';
import DB from '../models/engine/DBStorage';
import NotFoundError from '../models/errors/NotFoundError';

export default class TodoService {
  async createTodo(data: TodoCreationAttributes, user: User) {
    const transaction = await DB.transaction();

    try {
      const { id } = await Todo.create(
        {
          title: data.title,
          userId: user.id,
        },
        { transaction }
      );

      if (data.items) {
        if (!Array.isArray(data.items)) {
          data.items = [data.items];
        }
        data.items = data.items.filter((d) => !!d);
        const items: TodoItemCreationAttributes[] = data.items.map(
          (task: any) => ({
            task,
            todoId: id,
          })
        );

        await TodoItem.bulkCreate(items, { transaction });
      }
      await transaction.commit();

      return (await Todo.findByPk(id, { include: [TodoItem] })) as Todo;
    } catch (error: any) {
      transaction.rollback();
      console.debug(error);
      throw new Error(error.message);
    }
  }

  async updateTodo(data: TodoAttributes, user: User) {
    const todo = await Todo.findOne({
      where: {
        id: data.id,
        userId: user.id,
      },
    });

    if (!todo) {
      throw new NotFoundError('Todo not found');
    }

    todo.title = data.title;
    return todo.set('title', data.title).save();
  }

  async getTodo(id: string, user: User) {
    const todo = await Todo.findOne({
      where: {
        id: id,
        userId: user.id,
      },
      include: [TodoItem],
    });

    if (!todo) {
      throw new NotFoundError('Todo not found');
    }
    return todo;
  }

  async getTodos(page = 1, user: User) {
    const pager = new Pagination(page, 20);
    const { rows, count } = await Todo.findAndCountAll({
      where: {
        userId: user.id,
      },
      offset: pager.startIndex,
      limit: pager.pageSize,
      order: [['createdAt', 'DESC']],
      include: [TodoItem],
    });

    return {
      page,
      totalPages: pager.totalPages(count, pager.pageSize),
      results: rows.map((d) => {
        const todo = d.toJSON();
        const doneTasks = todo.items.filter((d) => d.done);
        todo.totalDone = doneTasks.length;
        todo.total = todo.items.length;
        return todo;
      }),
    };
  }

  async addTodoItem(data: TodoItemCreationAttributes, todoId: string) {
    return TodoItem.create({
      task: data.task,
      todoId,
    });
  }

  async updateTodoItem(data: TodoItemAttributes, id: string) {
    const item = await TodoItem.findOne({
      where: {
        id,
      },
    });

    if (!item) {
      throw new NotFoundError('Todo item not found');
    }

    item.set({ task: data.task });
    return item.save();
  }

  async markTodoItemAsDone(id: string) {
    const item = await TodoItem.findOne({
      where: {
        id: id,
      },
    });

    if (!item) {
      throw new NotFoundError('Todo item not found');
    }

    item.set('done', true);
    return item.save();
  }

  async markTodoItemAsUndone(id: string) {
    const item = await TodoItem.findOne({
      where: {
        id: id,
      },
    });

    if (!item) {
      throw new NotFoundError('Todo item not found');
    }

    item.set('done', false);
    return item.save();
  }

  async deleteTodoItem(id: string) {
    const item = await TodoItem.findOne({
      where: {
        id: id,
      },
    });

    if (!item) {
      throw new NotFoundError('Todo item not found');
    }

    return item.destroy();
  }

  async deleteTodo(id: string) {
    const todo = await Todo.findOne({
      where: {
        id: id,
      },
    });

    if (!todo) {
      throw new NotFoundError('Todo not found');
    }

    return todo.destroy();
  }
}
