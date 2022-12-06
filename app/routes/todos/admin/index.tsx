import type { ActionFunction } from "@remix-run/node";
import { Form, useTransition } from "@remix-run/react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import invariant from "tiny-invariant";
import { removeAll } from "~/models/Todo.server";
import { DeleteButton } from "~/components/button";

export const action: ActionFunction = ({ request }) => {
  invariant(process.env.ADMIN === "true", "You're not an admin");

  removeAll();

  return null;
};

const Box = styled.div`
  line-height: 1.4;
  text-align: center;
  margin-top: 5rem;
`;

const DeletedText = styled.div`
  margin-top: 2rem;
  font-size: 3rem;
`;

export default function Index() {
  const [deleted, setDeleted] = useState(false);
  const transition = useTransition();

  useEffect(() => {
    if (transition.type === "actionReload") setDeleted(true);
  }, [transition]);

  return (
    <Box>
      <h1>What's up admin?</h1>
      {deleted ? (
        <DeletedText>Deleted! 🥳</DeletedText>
      ) : (
        <Form method="delete">
          <DeleteButton type="submit" primary>
            delete all 😱
          </DeleteButton>
        </Form>
      )}
    </Box>
  );
}
