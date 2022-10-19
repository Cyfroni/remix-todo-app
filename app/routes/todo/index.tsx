import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import styled from "styled-components";
import type { Todo } from "~/models/Todo";
import { getTodos } from "~/models/Todo";

export const loader: LoaderFunction = async () => {
  return getTodos();
};

const Box = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 50rem;
  margin: 0 auto;
  margin-top: 10rem;
`;

export default function Index() {
  const todos = useLoaderData() as Todo[];

  return (
    <Box>
      <ul>
        {todos.map(({ task }) => (
          <li key={task}>
            <Link to={task}>{task}</Link>
          </li>
        ))}
      </ul>
    </Box>
  );
}
