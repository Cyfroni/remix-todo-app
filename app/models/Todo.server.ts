import fs from "fs";

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

export async function getTodo(task: string): Promise<Todo | undefined> {
  const todos = await getTodos();

  const todo = todos.find((todo) => task === todo.task);

  return todo;
}

export async function updateTodo(
  task: string,
  todo: Partial<Todo>
): Promise<void> {
  const todos = await getTodos();

  const todoindex = todos.findIndex((todo) => task === todo.task);

  const newTodo = {
    ...todos[todoindex],
    ...todo,
  };

  todos[todoindex] = newTodo;

  save("todos", todos);
}

export async function deleteTodo(task: string) {
  const todos = await getTodos();

  save(
    "todos",
    todos.filter((todo) => task !== todo.task)
  );
}

export async function duplicateTodo(task: string) {
  const todo = await getTodo(task);

  addTodo(todo!);
}
