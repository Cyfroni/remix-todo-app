import { useParams } from "@remix-run/react";
import { getTodos } from "~/models/Todo";

export default function Todo() {
  const { todoId } = useParams();

  console.log(todoId);

  console.log(getTodos());
  return <div>Todo</div>;
}
