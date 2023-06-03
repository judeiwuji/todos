import { array, boolean, object, string } from 'yup';

export const TodoCreationSchema = object({
  title: string().required(),
  items: array(string().optional()).optional(),
});

export const TodoUpdateSchema = object({
  title: string().optional(),
});

export const TodoItemCreationSchema = object({
  task: string().required(),
});

export const TodoItemUpdateSchema = object({
  task: string().optional(),
  done: boolean().optional(),
});
