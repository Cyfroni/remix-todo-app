import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import React from "react";
import { createGlobalStyle } from "styled-components";
import { getEnv } from "./env.server";
import { ThemeProvider } from "./styles-context";

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

  :root {
    font-family: 'Fuzzy Bubbles', cursive;
  }

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
    background-color: ${({ theme }) => theme.colors.main_light};
    color: ${({ theme }) => theme.colors.main_dark};
  }

  input, textarea, button {
    font-family: inherit;
  }
`;

function Document({ children }: { children: React.ReactNode }) {
  const data = useLoaderData() as LoaderData;
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fuzzy+Bubbles:wght@400;700&display=swap"
          rel="stylesheet"
        />
        {typeof document === "undefined" ? "__STYLES__" : null}
      </head>
      <body>
        <ThemeProvider>
          {children}
          <GlobalStyle />
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data?.ENV)}`,
          }}
        />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

// export function CatchBoundary() {
//   return (
//     <Document>
//       <div>Got u covered!</div>
//     </Document>
//   );
// }

// export function ErrorBoundary({ error }: { error: Error }) {
//   return (
//     <Document>
//       <div>Whooops! {error.message}</div>;
//     </Document>
//   );
// }
