import { TodoItem } from '/models/todo.model';

let todo_datasource: Array<TodoItem> = [];

export function fetchDatasource() {
  return fetch('https://kafe-39ba8.firebaseio.com/todo.json', {
    method: 'GET',
  })
    .then(async (res) => (todo_datasource = (await res.json()) as TodoItem[]))
    .then((res) => (todo_datasource = todo_datasource ?? []));
}

export function syncDatasource() {
  return fetch('https://kafe-39ba8.firebaseio.com/todo.json', {
    method: 'PUT',
    body: JSON.stringify(todo_datasource),
    headers: {
      'content-type': 'application/json',
    },
  });
}

fetchDatasource();

export function datasource() {
  return todo_datasource;
}
