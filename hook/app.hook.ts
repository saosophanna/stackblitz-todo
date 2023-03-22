import { useTodo } from './todo.hook';

export function useApp() {
  const todo_hooker = useTodo();

  return { todo_hooker };
}
