import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import styled from "styled-components";
import invariant from "tiny-invariant";
import { addTodo } from "~/models/Todo";

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();

  const id = data.get("id");
  const task = data.get("task");

  invariant(typeof id === "string", "Id must be a string");
  invariant(typeof task === "string", "Task must be a string");

  addTodo({ id, task });

  return redirect("todo");
};

const FormStyled = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 50rem;
  margin: 0 auto;
  margin-top: 10rem;

  input {
    display: block;
    width: 100%;
  }

  button {
    margin-top: 2rem;
  }
`;

export default function New() {
  return (
    <FormStyled method="post">
      <label>
        Id
        <input type="text" name="id" />
      </label>
      <label>
        Task
        <input type="text" name="task" />
      </label>
      <button type="submit">submit</button>
    </FormStyled>
  );
}
