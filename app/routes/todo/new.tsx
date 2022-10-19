import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import styled from "styled-components";
import invariant from "tiny-invariant";
import { addTodo } from "~/models/Todo";

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();

  const task = data.get("task");
  const description = data.get("description");
  const deadline = data.get("deadline");

  invariant(typeof task === "string", "Task must be a string");
  invariant(typeof description === "string", "Description must be a string");
  invariant(typeof deadline === "string", "Deadline must be a string");

  addTodo({ task, description, deadline });

  return redirect("todo");
};

export const FormStyled = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 50rem;
  margin: 0 auto;
  margin-top: 10rem;

  font-size: 2rem;

  input,
  textarea {
    display: block;
    width: 100%;
  }

  input[readOnly],
  textarea[readOnly] {
    border: none;
  }

  button {
    margin-top: 2rem;
  }
`;

export default function New() {
  return (
    <FormStyled method="post">
      <label>
        Task
        <input type="text" name="task" />
      </label>
      <label>
        Description
        <textarea name="description" cols={30} rows={10}></textarea>
      </label>
      <label>
        Deadline
        <input type="text" name="deadline" />
      </label>
      <button type="submit">Create</button>
    </FormStyled>
  );
}
