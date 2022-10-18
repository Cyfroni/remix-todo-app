import { useLoaderData } from "@remix-run/react";
import styled from "styled-components";

export async function loader() {
  return new Promise((resolve) => resolve({ abc: "123" }));
}

const Box = styled.div`
  font-family: system-ui, sans-serif;
  line-height: 1.4;
  text-align: center;

  h1 {
    box-shadow: 0 1px 2px black;
  }
`;

export default function Index() {
  const data = useLoaderData();

  console.log(data);

  return (
    <Box>
      <h1>Welcome to Remix (With Styled Component)</h1>
    </Box>
  );
}
