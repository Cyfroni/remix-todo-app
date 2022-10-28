import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import styled from "styled-components";
import { getTodos } from "~/models/Todo.server";

type LoaderData = {
  amount: number;
};

export const loader: LoaderFunction = async () => {
  const todos = await getTodos();
  return json<LoaderData>({ amount: todos.length });
};

const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 1rem;

  padding-left: 1rem;
  background-color: ${({ theme }) => theme.colors.main};

  a {
    text-decoration: none;
    padding: 1rem 2rem;
    color: white;
    text-transform: capitalize;

    transition: all 0.3s;

    &:focus,
    &:hover {
      outline: none;
      background-color: ${({ theme }) => theme.colors.main_lighter};
    }
  }
`;

const Number = styled.div`
  color: ${({ theme }) => theme.colors.main_dark};
  background-color: ${({ theme }) => theme.colors.main_light};

  height: 3rem;
  width: 3rem;
  border-radius: 50%;
  padding: 0.5rem;

  text-align: center;

  margin-left: auto;
  margin-right: 1rem;
`;

export default function Index() {
  const { amount } = useLoaderData() as LoaderData;

  return (
    <>
      <Header>
        <Link to="/">home</Link>
        <Link to=".">todos</Link>
        <Link to="oui">todos OUI</Link>
        <Link to="todo/new">create todo</Link>
        {ENV.ADMIN === "true" && <Link to="admin">admin</Link>}
        <Number>{amount}</Number>
      </Header>
      <Outlet />
    </>
  );
}
