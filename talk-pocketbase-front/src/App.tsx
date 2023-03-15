import { FC, useEffect, useState } from "react";
import "./App.css";

import PocketBase from "pocketbase";
import { Collections, TodoRecord, TodoResponse } from "./pocketbase-types";

const pb = new PocketBase("http://127.0.0.1:8090");

const App: FC = () => {
  const [todos, setTodos] = useState<TodoResponse[]>([]);
  const [newTodo, setNewTodo] = useState("");

  const getTodos = async () => {
    const resultList = await pb
      .collection(Collections.Todo)
      .getList<TodoResponse>(1, 500, {
        sort: "created",
        filter: 'created >= "2022-01-01 00:00:00"',
      });
    setTodos(resultList.items);
  };

  const removeTodo = async (id: string) => {
    await pb.collection(Collections.Todo).delete(id);
  };

  const createNewTodo = async () => {
    const data: TodoRecord = { titre: newTodo };
    await pb.collection(Collections.Todo).create(data);
    setNewTodo("");
  };

  useEffect(() => {
    getTodos();
    pb.collection(Collections.Todo).subscribe("*", function (e) {
      if (
        e.action === "create" &&
        e.record.collectionName === Collections.Todo
      ) {
        setTodos((prev) => {
          const newList = [...prev];
          newList.push(e.record as TodoResponse);
          return newList;
        });
      } else if (
        e.action === "delete" &&
        e.record.collectionName === Collections.Todo
      ) {
        setTodos((prev) => {
          const index = prev.findIndex((td) => td.id === e.record.id);
          if (index >= 0) {
            const newList = [...prev];
            newList.splice(index, 1);
            return newList;
          }
          return prev;
        });
      }
    });
    return () => {
      pb.collection(Collections.Todo).unsubscribe();
    };
  }, []);

  return (
    <div className="App">
      <h1>Guiild PocketBase</h1>
      <section>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id} className="flex-container">
              <span>
                {todo.titre} - {new Date(todo?.created || "").toDateString()}
              </span>
              <button onClick={() => removeTodo(todo.id)}>Remove</button>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <form className="flex-container" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            name="newToDo"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button onClick={createNewTodo}>Add</button>
        </form>
      </section>
      <section>
        <button
          onClick={() => {
            pb.authStore.clear();
            window.location.reload();
          }}
        >
          Logout
        </button>
      </section>
    </div>
  );
};

export default App;
