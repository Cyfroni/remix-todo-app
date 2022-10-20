import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import styled from "styled-components";
import invariant from "tiny-invariant";
import { deleteTodo, getTodos } from "~/models/Todo";

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

  deleteTodo(task);

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
  margin-left: 1rem;
  button {
    background-color: red;
    border: none;
    color: white;
    padding: 1rem;
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
            </FormStyled>
          </li>
        ))}
      </ul>
    </Box>
  );
}
