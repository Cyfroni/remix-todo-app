import type { LoaderFunction } from "@remix-run/node";
import { Outlet, useCatch } from "@remix-run/react";
import styled from "styled-components";

function authorize() {
  if (process.env.ADMIN !== "true")
    throw new Response("Not an admin", { status: 403 });
  const user = {};
  return user;
}

export const loader: LoaderFunction = () => {
  const user = authorize();

  console.log(user);
  console.log(process.env.SECRET);
  return null;
};

export const ErrorMessage = styled.div`
  text-align: center;
  background-color: ${({ theme }) => theme.colors.error};
  border-radius: 10px;
  color: ${({ theme }) => theme.colors.error_light};
  line-height: 5rem;
`;

export default function Admin() {
  return <Outlet />;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 403) {
    return <ErrorMessage>Not Authorized</ErrorMessage>;
  }

  throw new Error(`Unsupported thrown response status code: ${caught.status}`);
}

// export function ErrorBoundary({ error }: { error: Error }) {
//   return <div>Whooops! {error.message}</div>;
// }
