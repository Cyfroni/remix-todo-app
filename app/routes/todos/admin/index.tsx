import styled from "styled-components";

const Box = styled.div`
  font-family: system-ui, sans-serif;
  line-height: 1.4;
  text-align: center;

  h1 {
    box-shadow: 0 1px 2px black;
  }
`;

export default function Index() {
  return (
    <Box>
      <h1>Hello admin</h1>
    </Box>
  );
}
