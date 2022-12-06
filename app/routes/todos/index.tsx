import { faCopy, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ActionFunction, HeadersFunction } from "@remix-run/node";
import { Link, useFetcher } from "@remix-run/react";
import { FidgetSpinner } from "react-loader-spinner";
import invariant from "tiny-invariant";
import { TodolistItem, TodosWrapper } from "~/components/TodoList";
import { deleteTodo, duplicateTodo } from "~/models/Todo.server";
import { useTodos } from "../todos";

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    // "Cache-Control": `public, max-age=20`,
    // "Cache-Control": `no-cache, no-store, must-revalidate`,
  };
};

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();

  const id = data.get("id");

  invariant(typeof id === "string", "Id must be a string");

  const intent = data.get("intent");

  if (intent === "delete") deleteTodo(id);
  if (intent === "duplicate") duplicateTodo(id);

  return null;
};

export default function Index() {
  const { todos: tasks } = useTodos();

  return (
    <TodosWrapper>
      <h1>{tasks.length > 0 ? "Things you should do:" : "Nothing to do ⛱"}</h1>
      <ul>
        {tasks.map(({ id, task }, index) => (
          <TodoElem task={task} index={index} key={id} id={id} />
        ))}
      </ul>
    </TodosWrapper>
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

  const isSubmitting = Boolean(fetcher.submission);
  const isDeleting = Boolean(
    fetcher.submission?.formData.get("intent") === "delete"
  );
  const isDuplicating = Boolean(
    fetcher.submission?.formData.get("intent") === "duplicate"
  );

  return (
    <TodolistItem>
      {/* <Link to={`todo/${task}`} prefetch="intent"> */}
      <Link to={`todo/${id}`}>
        {index + 1}. {task}
      </Link>
      <fetcher.Form method="post">
        <input type="hidden" name="id" value={id} />
        {isDeleting ? (
          <FidgetSpinner
            visible={true}
            height="35"
            width="35"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
            ballColors={["transparent", "transparent", "transparent"]}
            backgroundColor="#F93943"
          />
        ) : (
          <button
            type="submit"
            name="intent"
            value="delete"
            disabled={isSubmitting}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        )}
        {isDuplicating ? (
          <FidgetSpinner
            visible={true}
            height="35"
            width="35"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
            ballColors={["transparent", "transparent", "transparent"]}
            backgroundColor="#656839"
          />
        ) : (
          <button
            type="submit"
            name="intent"
            value="duplicate"
            disabled={isSubmitting}
          >
            <FontAwesomeIcon icon={faCopy} />
          </button>
        )}
      </fetcher.Form>
    </TodolistItem>
  );
}
