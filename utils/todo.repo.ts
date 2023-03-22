import { TodoItem } from '/models/todo.model';
import { json } from 'stream/consumers';

export function submit(todo: TodoItem) {
  //TODO: Write code to submit todo item to db

  return fetch('/api/todo', {
    body: JSON.stringify(todo),
    method: 'POST',
    headers: {
      'content-type': 'Application/json',
    },
  }).then((res) => res.json());
}

export function fetchTodo(): Promise<TodoItem[]> {
  return fetch('/api/todo', {
    method: 'GET',
  }).then((res) => res.json());
}

export function removeTodo(id: string) {
  return fetch('/api/todo?id=' + id, {
    method: 'DELETE',
  });
}

export function updateTodo(todo: TodoItem) {
  return fetch('/api/todo', {
    method: 'PUT',
    body: JSON.stringify(todo),
    headers: {
      'content-type': 'application/json',
    },
  }).then((res) => res.json());
}
