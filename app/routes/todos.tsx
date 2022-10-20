import { Link, Outlet } from "@remix-run/react";
import styled from "styled-components";

const Header = styled.header`
  display: flex;
  gap: 1rem;

  padding-left: 1rem;
  background-color: ${({ theme }) => theme.colors.main};

  a {
    text-decoration: none;
    padding: 1rem 2rem;
    color: white;
    text-transform: capitalize;

    transition: all 0.3s;

    &:hover {
      background-color: ${({ theme }) => theme.colors.main_lighter};
    }
  }
`;

export default function Index() {
  return (
    <>
      <Header>
        <Link to="/">home</Link>
        <Link to="todo">todo</Link>
        <Link to="todo/new">todonew</Link>
        {ENV.ADMIN === "true" && <Link to="admin">admin</Link>}
      </Header>
      <Outlet />
    </>
  );
}
