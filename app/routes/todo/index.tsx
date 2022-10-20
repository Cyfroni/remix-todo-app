import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import styled from "styled-components";
import invariant from "tiny-invariant";
import { deleteTodo, getTodos } from "~/models/Todo";
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
`;

const FormStyled = styled(Form)`
  display: inline;
  button {
    margin: 0.5rem;
    background-color: red;
    border: none;
    color: white;
    padding: 1rem;
  }
  button[value="duplicate"] {
    background-color: blue;
  }
`;

export default function Index() {
  const { tasks } = useLoaderData() as LoaderData;

  return (
    <Box>
      <ul>
        {tasks.map(({ task }) => (
          <li key={task}>
            <Link to={task} prefetch="intent">
              {task}
            </Link>
            <FormStyled method="delete">
              <input type="text" name="task" hidden readOnly value={task} />
              <button type="submit">x</button>
              {/* <button type="submit" name="intent" value="delete">
                x
              </button> */}
              {/* <button type="submit" name="intent" value="duplicate">
                duplicate
              </button> */}
            </FormStyled>
          </li>
        ))}
      </ul>
    </Box>
  );
}
