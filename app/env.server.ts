import invariant from "tiny-invariant";

export function getEnv() {
  invariant(process.env.ADMIN, "ADMIN should be defined");

  return {
    ADMIN: process.env.ADMIN,
  };
}

type ENV = ReturnType<typeof getEnv>;

declare global {
  var ENV: ENV;
  interface Window {
    ENV: ENV;
  }
}
