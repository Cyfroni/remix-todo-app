import type { LoaderFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import invariant from "tiny-invariant";

export const loader: LoaderFunction = () => {
  invariant(process.env.ADMIN === "true", "You're not an admin");
  console.log(process.env.SECRET);
  return null;
};

export default function Admin() {
  return <Outlet />;
}
