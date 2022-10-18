import fs from "fs";
import invariant from "tiny-invariant";

async function save<T>(key: string, data: T[]): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(__dirname + "/" + key, JSON.stringify(data), () => resolve());
  });
}

async function get<T>(key: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    fs.readFile(__dirname + "/" + key, (a, b) => {
      const data = JSON.parse((b || "[]").toString());
      resolve(data);
    });
  });
}

export type Todo = {
  id: string;
  task: string;
};

export async function addTodo(todo: Todo): Promise<void> {
  const todos = await get<Todo>("todos");

  todos.push(todo);

  return save("todos", todos);
}

export async function getTodos(): Promise<Todo[]> {
  return get<Todo>("todos");
}

export async function getTodo(id: string): Promise<Todo> {
  const todos = await getTodos();

  const todo = todos.find((todo) => id === todo.id);

  invariant(todo, "Todo not found");

  return todo;
}
