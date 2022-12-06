import { faCopy, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ActionFunction } from "@remix-run/node";
import { Link, useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import invariant from "tiny-invariant";
import {
  OptimisticTodolistItem,
  TodolistItem,
  TodosWrapper,
} from "~/components/TodoList";
import { deleteTodo, duplicateTodo } from "~/models/Todo.server";
import { useTodos } from "../todos";

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();

  const id = data.get("id");

  invariant(typeof id === "string", "Id must be a string");

  const intent = data.get("intent");

  try {
    // if (Math.random() > 0.5) throw new Error("boom!");
    // throw new Error("boom!");
  } catch (e) {
    return { error: true };
  }

  if (intent === "delete") {
    deleteTodo(id);
    return { deleted: id };
  }
  if (intent === "duplicate") {
    const newId = Math.random().toString();
    duplicateTodo(id, newId);
    return { duplicated: { newId, oldId: id } };
  }

  return null;
};

export default function Index() {
  const { todos, todoCount } = useTodos();

  return (
    <TodosWrapper>
      <h1>
        {todoCount > 0 ? "Things you should do:" : "Nothing to do ⛱"}
        {/* {todoCount} */}
      </h1>
      <ul>
        {todos.map(({ task, id }, index) => (
          // <TodoElem task={task} index={index} key={id} id={id} />
          <TodoElem task={task} key={id} id={id} />
        ))}
      </ul>
    </TodosWrapper>
  );
}

function OptimisticTodoElem({
  originId,
  task,
}: {
  originId: string;
  task: string;
}) {
  const fetcher = useFetcher();
  const { todos } = useTodos();
  const id = fetcher.data?.duplicated?.newId;

  // const duplicate = () => fetcher.submit({ id: originId, intent: "duplicate" }, { method: "post" });

  useEffect(() => {
    // console.log(fetcher);
    if (fetcher.type === "init")
      fetcher.submit({ id: originId, intent: "duplicate" }, { method: "post" });
    if (fetcher.type === "done") {
      if (!fetcher.data.error) {
        console.log("done!", fetcher.data?.duplicated?.newId);
        // todo: remove from parent
      }
    }
  }, [fetcher, originId]);

  if (todos.find((t) => t.id === id)) return null;

  return (
    <OptimisticTodolistItem>
      <span>{task}</span>
      {fetcher.data?.error && "failed"}
      <button type="submit" name="intent" value="delete" disabled>
        <FontAwesomeIcon icon={faTrash} />
      </button>
      <button type="submit" name="intent" value="duplicate" disabled>
        <FontAwesomeIcon icon={faCopy} />
      </button>
      {/* <button
        type="submit"
        name="intent"
        value="duplicate"
        onClick={() => console.log(fetcher)}
      >
        info
      </button> */}
    </OptimisticTodolistItem>
  );
}

function TodoElem({
  task,
  // index,
  id,
}: {
  task: string;
  // index: number;
  id: string;
}) {
  const deleteFetcher = useFetcher();

  const isDeleting = Boolean(deleteFetcher.submission);
  const deletionError = deleteFetcher.data?.error;

  const [copies, setCopies] = useState([] as object[]);

  const doCopy = () => setCopies((cs) => [...cs, {}]);

  return (
    <>
      {!isDeleting && (
        <TodolistItem>
          <Link to={`todo/${id}`}>
            {/* {index + 1}. {task} */}
            {task}
          </Link>
          <deleteFetcher.Form method="delete">
            <input type="hidden" name="id" value={id} />
            <button type="submit" name="intent" value="delete">
              <FontAwesomeIcon icon={faTrash} />
              {deletionError && "retry"}
            </button>
          </deleteFetcher.Form>
          <button
            // type="submit"
            // name="intent"
            value="duplicate"
            onClick={doCopy}
          >
            <FontAwesomeIcon icon={faCopy} />
          </button>
        </TodolistItem>
      )}
      {copies.map((val, index) => (
        <OptimisticTodoElem key={index} originId={id} task={task + " - Copy"} />
      ))}
    </>
  );
}
