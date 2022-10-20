import { Link, Outlet } from "@remix-run/react";
import styled from "styled-components";

const Header = styled.header`
  display: flex;
  gap: 1rem;
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
