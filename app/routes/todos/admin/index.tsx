import type { ActionFunction } from "@remix-run/node";
import { Form, useTransition } from "@remix-run/react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import invariant from "tiny-invariant";
import { removeAll } from "~/models/Todo.server";
import { ButtonStyled } from "../todo/new";

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

const DeleteButton = styled(ButtonStyled)`
  background-color: ${({ theme }) => theme.colors.error};
  border: transparent;
  &:not(:disabled) {
    &:focus,
    &:hover {
      box-shadow: 0 0 5px ${({ theme }) => theme.colors.error_lighter};
    }

    &:hover {
      background-color: ${({ theme }) => theme.colors.error_lighter};
    }
  }
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

  console.log(transition);

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
