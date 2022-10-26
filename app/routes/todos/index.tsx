import { faCopy, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type {
  ActionFunction,
  HeadersFunction,
  LoaderFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import styled from "styled-components";
import invariant from "tiny-invariant";
import { addTodo, deleteTodo, getTodo, getTodos } from "~/models/Todo.server";

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    // "Cache-Control": `public, max-age=20`,
    // "Cache-Control": `no-cache, no-store, must-revalidate`,
  };
};

type LoaderData = {
  tasks: Awaited<ReturnType<typeof getTodos>>;
};

export const loader: LoaderFunction = async () => {
  const todos = await getTodos();
  return json<LoaderData>(
    { tasks: todos }
    // { headers: { "Cache-Control": "public, max-age=10" } }
  );
};

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();

  const task = data.get("task");

  invariant(typeof task === "string", "Task must be a string");

  const intent = data.get("intent");

  if (intent === "delete") deleteTodo(task);
  if (intent === "duplicate") {
    const todo = await getTodo(task);
    invariant(todo, "Todo is required");
    await addTodo({
      ...todo,
      task: todo.task + " - Copy",
    });
  }

  return null;
};

const Box = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 50rem;
  margin: 0 auto;
  margin-top: 5rem;

  ul {
    list-style: none;

    li {
      display: flex;
      align-items: center;
      margin-top: 1rem;
    }

    a {
      flex: 1;
      color: white;
      text-decoration: none;
      padding: 1rem 2rem;
      border-radius: 5px;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      background-color: ${({ theme }) => theme.colors.main};
      transition: all 0.3s;

      &:focus,
      &:hover {
        outline: none;
        box-shadow: 0 0 5px ${({ theme }) => theme.colors.main_lighter};
      }

      &:hover {
        background-color: ${({ theme }) => theme.colors.main_lighter};
      }
    }
  }
`;

const FormStyled = styled(Form)`
  margin-left: 1rem;
  display: flex;
  button {
    background-color: transparent;
    border: none;
    color: white;
    padding: 0.25rem 0;

    display: block;
    border-bottom: 1px solid transparent;

    height: 3.5rem;
    width: 3.5rem;

    transition: all 0.3s;

    cursor: pointer;

    color: ${({ theme }) => theme.colors.error};

    &:hover {
      color: ${({ theme }) => theme.colors.error_lighter};
    }

    &:focus {
      outline: none;
      border-bottom: 1px solid ${({ theme }) => theme.colors.error_lighter};
    }

    svg {
      height: 100%;
    }
  }
  button[value="duplicate"] {
    color: #656839;

    &:hover {
      color: #737641;
    }

    &:focus {
      border-bottom: 1px solid #737641;
    }
  }
`;

export default function Index() {
  const { tasks } = useLoaderData() as LoaderData;

  return (
    <Box>
      <h1>{tasks.length > 0 ? "Things you should do:" : "Nothing to do ⛱"}</h1>
      <ul>
        {tasks.map(({ task }, index) => (
          <li key={task}>
            {/* <Link to={`todo/${task}`} prefetch="intent"> */}
            <Link to={`todo/${task}`}>
              {index + 1}. {task}
            </Link>
            <FormStyled method="delete">
              <input type="hidden" name="task" value={task} />
              <button type="submit" name="intent" value="delete">
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <button type="submit" name="intent" value="duplicate">
                <FontAwesomeIcon icon={faCopy} />
              </button>
            </FormStyled>
          </li>
        ))}
      </ul>
    </Box>
  );
}
