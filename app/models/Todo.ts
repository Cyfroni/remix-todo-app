// var fs = require("fs");
import fs from "fs";

async function save<T>(key: string, data: T[]) {
  return new Promise((resolve, reject) => {
    fs.writeFile(__dirname + "/" + key, JSON.stringify(data), () =>
      resolve(null)
    );
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

export async function addTodo(todo: Todo) {
  const todos = await get<Todo>("todos");

  todos.push(todo);

  return save("todos", todos);
}

export async function getTodos() {
  return get<Todo>("todos");
}
