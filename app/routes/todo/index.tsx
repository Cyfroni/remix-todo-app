import { useLoaderData } from "@remix-run/react";
import type { Todo } from "~/models/Todo";
import { getTodos } from "~/models/Todo";

export async function loader() {
  return getTodos();
}

export default function Index() {
  const todos = useLoaderData() as Todo[];

  return (
    <div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.task}</li>
        ))}
      </ul>
    </div>
  );
}
