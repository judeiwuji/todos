import { Router } from 'express';
import TodoController from '../controllers/TodoController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const todoRoutes = Router();

todoRoutes.get(
  '/dashboard',
  ensureAuthenticated,
  TodoController.getDashboardPage
);
todoRoutes.post('/todos', ensureAuthenticated, TodoController.createTodo);
todoRoutes.get('/todos/:id', ensureAuthenticated, TodoController.getTodoPage);
todoRoutes.put('/todos/:id', ensureAuthenticated, TodoController.updateTodo);
todoRoutes.delete('/todos/:id', ensureAuthenticated, TodoController.deleteTodo);
todoRoutes.post(
  '/todos/:id/items',
  ensureAuthenticated,
  TodoController.addTodoItem
);
todoRoutes.put(
  '/todos/items/:id',
  ensureAuthenticated,
  TodoController.updateTodoItem
);
todoRoutes.put(
  '/todos/items/:id/done',
  ensureAuthenticated,
  TodoController.markTodoItemAsDone
);
todoRoutes.put(
  '/todos/items/:id/undone',
  ensureAuthenticated,
  TodoController.markTodoItemAsUndone
);
todoRoutes.delete(
  '/todos/items/:id',
  ensureAuthenticated,
  TodoController.removeTodoItem
);
export default todoRoutes;
