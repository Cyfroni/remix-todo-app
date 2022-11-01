import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useFetchers, useLoaderData } from "@remix-run/react";
import React from "react";
import { useContext } from "react";
import styled from "styled-components";
import { getTodos, Todo } from "~/models/Todo.server";
import useTodoCount from "~/utils/useTodoCount";
import useOptimisticTodos from "~/utils/useTodoCount";

// type LoaderData = {
//   amount: number;
// };
type LoaderData = {
  todos: Todo[];
};

export const loader: LoaderFunction = async () => {
  const todos = await getTodos();
  // return json<LoaderData>({ amount: todos.length });
  return json<LoaderData>({ todos });
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

const TodosContext = React.createContext({ todos: [] as Todo[], todoCount: 0 });

export const useTodos = () => useContext(TodosContext);

export default function Index() {
  const { todos } = useLoaderData() as LoaderData;
  const todoCount = useTodoCount(todos);

  return (
    <>
      <Header>
        <Link to="/">home</Link>
        <Link to=".">todos</Link>
        <Link to="oui">todos OUI</Link>
        <Link to="todo/new">create todo</Link>
        {ENV.ADMIN === "true" && <Link to="admin">admin</Link>}
        {/* <Number>{todoCount}</Number> */}
      </Header>
      <TodosContext.Provider value={{ todos, todoCount }}>
        <Outlet />
      </TodosContext.Provider>
    </>
  );
}
