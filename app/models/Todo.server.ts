import fs from "fs";

async function save<T>(key: string, data: T[]): Promise<void> {
  // console.log("saving", data);
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
  description: string;
  deadline: string;
};

export async function addTodo(todo: Todo): Promise<void> {
  const todos = await get<Todo>("todos");

  todos.push(todo);

  return save("todos", todos);
}

export async function getTodos(): Promise<Todo[]> {
  return get<Todo>("todos");
}

export async function getTodo(id: string): Promise<Todo | undefined> {
  const todos = await getTodos();

  const todo = todos.find((todo) => id === todo.id);

  return todo;
}

export async function updateTodo(
  id: string,
  todo: Partial<Todo>
): Promise<void> {
  const todos = await getTodos();

  const todoindex = todos.findIndex((todo) => id === todo.id);

  const newTodo = {
    ...todos[todoindex],
    ...todo,
  };

  todos[todoindex] = newTodo;

  save("todos", todos);
}

export async function deleteTodo(id: string) {
  const todos = await getTodos();

  save(
    "todos",
    todos.filter((todo) => id !== todo.id)
  );
}

export async function duplicateTodo(id: string, newId?: string) {
  const todos = await getTodos();

  const todoindex = todos.findIndex((todo) => id === todo.id);
  const todo = todos[todoindex];

  const newTodo = {
    ...todo,
    id: newId ?? Math.random().toString(),
    task: todo.task + " - Copy",
  };

  save("todos", [
    ...todos.slice(0, todoindex + 1),
    newTodo,
    ...todos.slice(todoindex + 1),
  ]);
}

export async function removeAll() {
  save("todos", []);
}
