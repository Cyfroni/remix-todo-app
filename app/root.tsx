import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import styled, { createGlobalStyle } from "styled-components";
import { getEnv } from "./env.server";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

type LoaderData = {
  ENV: ReturnType<typeof getEnv>;
};

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    ENV: getEnv(),
  });
};

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    
    box-sizing: border-box;
  }

  html {
    font-size: 62.5%;
  }
  
  body {
    font-size: 2rem;
  }
`;

export default function App() {
  const data = useLoaderData() as LoaderData;
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        {typeof document === "undefined" ? "__STYLES__" : null}
      </head>
      <body>
        <Outlet />
        <GlobalStyle />
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
        <LiveReload />
      </body>
    </html>
  );
}
