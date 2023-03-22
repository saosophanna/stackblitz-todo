import { TodoItem } from '/models/todo.model';
import { NextApiRequest, NextApiResponse } from 'next';

let todo_datasource: Array<TodoItem> = [];
let todo_index: { [index: string]: TodoItem | undefined } = {};

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

const controller: { [method: string]: Function } = {
  POST: (req: NextApiRequest, res: NextApiResponse<TodoItem>) => Post(req, res),
  PUT: (req: NextApiRequest, res: NextApiResponse<TodoItem>) => Put(req, res),
  GET: (req: NextApiRequest, res: NextApiResponse<TodoItem[]>) => Get(req, res),
  DELETE: (req: NextApiRequest, res: NextApiResponse<TodoItem>) =>
    Delete(req, res),
};

export async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (!req.method) return res.status(405);

  return await controller[req.method](req, res);
}

export async function Post(req: NextApiRequest, res: NextApiResponse<any>) {
  let todo: TodoItem = req.body;

  if (todo_index[todo.id])
    return res.status(400).json({
      message: 'Item Already exist',
    });

  todo_datasource.push(todo);
  todo_index[todo.id] = todo;

  await syncDatasource();
  return res.status(201).json(req.body);
}

export async function Put(req: NextApiRequest, res: NextApiResponse<any>) {
  let data: TodoItem = req.body;
  let item = todo_datasource.find((p) => p.id == data.id);
  if (!item)
    return res.status(400).json({
      message: 'Item not found',
    });

  item.todo = data.todo;
  item.isComplated = data.isComplated;

  await syncDatasource();
  return res.status(200).json({
    message: 'Success',
  });
}

export async function Get(
  req: NextApiRequest,
  res: NextApiResponse<TodoItem[]>
) {
  await fetchDatasource();

  return res.status(200).json(todo_datasource);
}

export async function Delete(
  req: NextApiRequest,
  res: NextApiResponse<TodoItem>
) {
  let { id } = req.query;
  let index = todo_datasource.findIndex((p) => p.id == id);
  todo_datasource.splice(index, 1);

  await syncDatasource();
  return res.status(200).json(todo_datasource[0]);
}

export default handler;
