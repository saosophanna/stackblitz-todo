import { TodoItem } from '../models/todo.model';
import { useEffect, useMemo, useReducer, useState } from 'react';
import * as todoRepo from '../utils/todo.repo';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '/firebase/firebase.config';
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

  function updateTodo(todo: TodoItem) {
    let todo_doc = doc(db(), 'todo', todo.id);
    setDoc(todo_doc, todo).then((res) => {
      setSelectedItem(undefined);
      setTodo('');
    });
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
        updateTodo(update_todo);
      }

      return;
    }

    let todo_item: TodoItem = {
      id: crypto.randomUUID(),
      createdAt: Timestamp.now(),
      isComplated: false,
      todo: todo,
    };

    // todoRepo.submit(todo_item).then((res) => {
    //   handleFetchTodo();
    //   setTodo('');
    // });
    let todo_collection = collection(db(), 'todo');
    addDoc(todo_collection, todo_item).then((res) => {
      setTodo('');
    });
  };

  const handleRemoveTodo = function (todo: TodoItem) {
    let todo_doc = doc(db(), 'todo', todo.id);
    deleteDoc(todo_doc).then((res) => {});
  };

  const handleEditTodo = function (todo: TodoItem) {
    setSelectedItem(todo);
    setTodo(todo.todo);
  };

  const handleMakeComplate = function (todo: TodoItem) {
    todo.isComplated = !todo.isComplated;
    updateTodo(todo);
  };

  useEffect(() => {
    //handleFetchTodo();
    //
    let todo_col = collection(db(), 'todo');
    let todo_quary = query(todo_col, orderBy('createdAt', 'desc'));

    return onSnapshot(todo_quary, (snapshot) => {
      let items: TodoItem[] = [];
      snapshot.forEach((docShapshot) => {
        let data = docShapshot.data();

        items.push({
          id: docShapshot.id,
          createdAt: data.createdAt,
          isComplated: data.isComplated,
          todo: data.todo,
        });
      });
      setItems(items);
    });
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
