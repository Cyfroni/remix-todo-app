import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import styled from "styled-components";
import invariant from "tiny-invariant";
import { getTodo } from "~/models/Todo";

export const loader: LoaderFunction = async ({ params }) => {
  const { todoId } = params;

  invariant(todoId, "todoId not provided");

  return getTodo(todoId);
};

const Box = styled.div`
  /* display: flex;
  flex-direction: column;
  gap: 1rem; */
  max-width: 50rem;
  margin: 0 auto;
  margin-top: 10rem;
`;

export default function Todo() {
  const { id, task } = useLoaderData();
  return <Box>{task}</Box>;
}
