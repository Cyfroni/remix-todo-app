import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData, useTransition } from "@remix-run/react";
import styled from "styled-components";
import invariant from "tiny-invariant";
import { addTodo } from "~/models/Todo.server";

type ActionData =
  | {
      task: null | string;
      description: null | string;
      deadline: null | string;
    }
  | undefined;

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();

  const task = data.get("task");
  const description = data.get("description");
  const deadline = data.get("deadline");

  const errors: ActionData = {
    task: task ? null : "Task is required",
    description: description ? null : "Description is required",
    deadline: deadline ? null : "Deadline is required",
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json<ActionData>(errors);
  }

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

  em {
    color: red;
    font-size: 1.2rem;
    margin-left: 1rem;
  }

  input,
  textarea {
    display: block;
    width: 100%;
  }

  input[readOnly],
  textarea[readOnly] {
    border-color: transparent;
  }

  button {
    margin-top: 2rem;
  }
`;

export default function New() {
  const errors = useActionData() as ActionData;
  const transition = useTransition();

  const isCreating = Boolean(transition.submission);

  console.log(transition);

  return (
    <FormStyled method="post">
      <label>
        Task
        {errors?.task && <em>{errors.task}</em>}
        <input type="text" name="task" />
      </label>
      <label>
        Description
        {errors?.description && <em>{errors.description}</em>}
        <textarea name="description" cols={30} rows={10}></textarea>
      </label>
      <label>
        Deadline
        {errors?.deadline && <em>{errors.deadline}</em>}
        <input type="text" name="deadline" />
      </label>
      <button type="submit" disabled={isCreating}>
        {isCreating ? "Creating..." : "Create"}
      </button>
    </FormStyled>
  );
}
