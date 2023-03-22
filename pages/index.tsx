import Head from 'next/head';
import Image from 'next/image';
import { useApp } from '/hook/app.hook';
import { Todo } from '/components/todo.item';

export default function Home() {
  const { todo_hooker } = useApp();

  const handleReturnTodo = function (e: any) {
    if (e.key == 'Enter') todo_hooker.handleAddTodo();
  };
  return (
    <>
      <Head>
        <title>TODO item</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <div>
          <h1>Daily TODO</h1>
          <div>
            <input
              onKeyUp={handleReturnTodo}
              value={todo_hooker.todo}
              onChange={(e) =>
                todo_hooker.handleTodoTextChanged(e.target.value)
              }
              placeholder="Write something here.."
            />
          </div>
          <ul>
            {todo_hooker.items.length > 0 ? (
              todo_hooker.items.map((todo) => (
                <Todo hook={todo_hooker} key={todo.id} item={todo} />
              ))
            ) : (
              <p>{todo_hooker.message}</p>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
