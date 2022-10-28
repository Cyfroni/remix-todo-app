import { faCopy, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import {
  addTodo,
  deleteTodo,
  duplicateTodo,
  getTodo,
  getTodos,
} from "~/models/Todo.server";
import { Box, TodolistItem } from "./index";

type LoaderData = {
  tasks: Awaited<ReturnType<typeof getTodos>>;
};

export const loader: LoaderFunction = async () => {
  const todos = await getTodos();
  return json<LoaderData>({ tasks: todos });
};

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();

  const id = data.get("id");

  invariant(typeof id === "string", "Id must be a string");

  try {
    // if (Math.random() > 0.5) throw new Error("boom!");
  } catch (e) {
    return { error: true };
  }

  const intent = data.get("intent");

  if (intent === "delete") deleteTodo(id);
  if (intent === "duplicate") duplicateTodo(id);

  return null;
};

export default function Index() {
  const { tasks } = useLoaderData() as LoaderData;

  return (
    <Box>
      <h1>{tasks.length > 0 ? "Things you should do:" : "Nothing to do ⛱"}</h1>
      <ul>
        {tasks.map(({ task, id }, index) => (
          <TodoElem task={task} index={index} key={id} id={id} />
        ))}
      </ul>
    </Box>
  );
}

function TodoElem({
  task,
  index,
  id,
}: {
  task: string;
  index: number;
  id: string;
}) {
  const fetcher = useFetcher();
  const actionData = fetcher.data;

  const isDeleting = Boolean(
    fetcher.submission?.formData.get("intent") === "delete"
  );
  const isDuplicating = Boolean(
    fetcher.submission?.formData.get("intent") === "duplicate"
  );

  if (isDeleting) return null;

  return (
    <>
      <TodolistItem>
        <Link to={`todo/${id}`}>
          {index + 1}. {task}
        </Link>
        <fetcher.Form method="delete">
          <input type="hidden" name="id" value={id} />
          <button type="submit" name="intent" value="delete">
            <FontAwesomeIcon icon={faTrash} />
            {actionData?.error && "retry"}
          </button>

          <button type="submit" name="intent" value="duplicate">
            <FontAwesomeIcon icon={faCopy} />
            {actionData?.error && "retry"}
          </button>
        </fetcher.Form>
      </TodolistItem>
      {isDuplicating && (
        <TodolistItem>
          <Link to="#">#. {task} - Copy</Link>
          <fetcher.Form method="delete">
            <button type="submit" disabled>
              <FontAwesomeIcon icon={faTrash} />
            </button>
            <button type="submit" disabled>
              <FontAwesomeIcon icon={faCopy} />
            </button>
          </fetcher.Form>
        </TodolistItem>
      )}
    </>
  );
}

// export const ErrorBoundary = (error) => {
//   console.log(error);
//   return <div>something went wrong!</div>;
// };
