import { TodoItem } from '/models/todo.model';
import { useEffect, useMemo, useReducer, useState } from 'react';
import * as todoRepo from '../utils/todo.repo';
export enum TODOActon {
  Mark,
  Edit,
  Complate,
}
export interface TodoHooker {
  todo: string;
  items: Array<TodoItem>;
  message: string;
  handleAddTodo: () => void;
  handleTodoTextChanged: (value: string) => void;
  handleRemoveTodo: (todo: TodoItem) => void;
  handleEditTodo: (todo: TodoItem) => void;
  handleMakeComplate: (todo: TodoItem) => void;
}

export function useTodo(): TodoHooker {
  const [todo, setTodo] = useState('');
  const [items, setItems] = useState<TodoItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<TodoItem | undefined>();

  function handleFetchTodo() {
    return todoRepo.fetchTodo().then((res) => setItems(res));
  }

  const filterResult = useMemo(() => {
    return items.filter((p) => p.todo.startsWith(todo));
  }, [items, todo]);

  const message = useMemo(() => {
    if (!selectedItem && todo != '')
      return '“No result. Create a new one instead!';

    return '';
  }, [todo, items, selectedItem]);

  function todoAction(todo: TodoItem, action: TODOActon) {
    switch (action) {
      case TODOActon.Complate:
        return handleMakeComplate(todo);
        break;
      case TODOActon.Edit:
        return handleEditTodo(todo);
        break;
      case TODOActon.Mark:
        return handleMakeComplate(todo);
        break;
      default:
        throw new Error();
    }
  }

  const handleTodoTextChanged = function (value: string) {
    setTodo(value);
  };

  const handleAddTodo = function () {
    if (todo.trim() == '') return;

    //Check exsting
    let is_existed = items.some(
      (p) => p.todo.toLocaleLowerCase() == todo.toLocaleLowerCase()
    );
    if (is_existed) {
      alert('Item already exist.');
      return;
    }

    //Update
    if (selectedItem) {
      let update_todo: TodoItem | undefined = items.find(
        (p) => p.id == selectedItem.id
      );
      if (update_todo) {
        update_todo.todo = todo;
        //Update todo item to api
        todoRepo.updateTodo(update_todo).then((res) => {
          handleFetchTodo();
          setSelectedItem(undefined);
          setTodo('');
        });
      }

      return;
    }

    let todo_item: TodoItem = {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      isComplated: false,
      todo: todo,
    };

    todoRepo.submit(todo_item).then((res) => {
      handleFetchTodo();
      setTodo('');
    });
  };

  const handleRemoveTodo = function (todo: TodoItem) {
    todoRepo.removeTodo(todo.id).then((res) => {
      let index = items.indexOf(todo);
      items.splice(index, 1);
      setItems([...items]);
      console.log(items);
    });
  };

  const handleEditTodo = function (todo: TodoItem) {
    setSelectedItem(todo);
    setTodo(todo.todo);
  };

  const handleMakeComplate = function (todo: TodoItem) {
    todo.isComplated = !todo.isComplated;
    return todoRepo.updateTodo(todo).then((res) => {
      handleFetchTodo();
    });
  };

  useEffect(() => {
    handleFetchTodo();
  }, []);

  return {
    todo,
    items: filterResult,
    handleAddTodo,
    handleTodoTextChanged,
    handleRemoveTodo,
    handleEditTodo,
    handleMakeComplate,
    message,
  };
}
