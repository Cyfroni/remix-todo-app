import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import styled from "styled-components";
import invariant from "tiny-invariant";
import { deleteTodo, getTodos } from "~/models/Todo.server";
// import { faTrash, faCopy } from "@fortawesome/free-solid-svg-icons";
// import { addTodo, deleteTodo, getTodo, getTodos } from "~/models/Todo";

type LoaderData = {
  tasks: Awaited<ReturnType<typeof getTodos>>;
};

export const loader: LoaderFunction = async () => {
  const todos = await getTodos();
  return json<LoaderData>({ tasks: todos });
};

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();

  const task = data.get("task");

  invariant(typeof task === "string", "Task must be a string");

  // const intent = data.get("intent");

  deleteTodo(task);

  // if (intent === "delete") deleteTodo(task);
  // if (intent === "duplicate") {
  //   const todo = await getTodo(task);
  //   invariant(todo, "Todo is required");
  //   await addTodo(todo);
  // }

  return null;
};

const Box = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 50rem;
  margin: 0 auto;
  margin-top: 10rem;

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
      padding: 0.5rem 1rem;
      border-radius: 5px;

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
  display: flex;
  align-self: stretch;
  button {
    background-color: transparent;
    border: none;
    color: white;
    margin: 0 0.5rem;
    padding: 0.5rem 0;

    display: block;
    height: 100%;
    border-bottom: 1px solid transparent;

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
        {tasks.map(({ task }) => (
          <li key={task}>
            <Link to={`todo/${task}`} prefetch="intent">
              {task}
            </Link>
            <FormStyled method="delete">
              <input type="text" name="task" hidden readOnly value={task} />
              <button type="submit">
                <FontAwesomeIcon icon={faTrash} />
              </button>
              {/* <button type="submit" name="intent" value="delete">
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <button type="submit" name="intent" value="duplicate">
                <FontAwesomeIcon icon={faCopy} />
              </button> */}
            </FormStyled>
          </li>
        ))}
      </ul>
    </Box>
  );
}
