import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import styled from "styled-components";
import { getTodos } from "~/models/Todo";

type LoaderData = {
  tasks: Awaited<ReturnType<typeof getTodos>>;
};

export const loader: LoaderFunction = async () => {
  const todos = await getTodos();
  return json<LoaderData>({ tasks: todos });
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
  const { tasks } = useLoaderData() as LoaderData;

  return (
    <Box>
      <ul>
        {tasks.map(({ task }) => (
          <li key={task}>
            <Link to={task} prefetch="intent">
              {task}
            </Link>
          </li>
        ))}
      </ul>
    </Box>
  );
}
