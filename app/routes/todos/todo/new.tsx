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

  return redirect("todos");
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
    color: ${({ theme }) => theme.colors.error};
    font-size: 1.2rem;
    margin-left: 1rem;
  }

  label {
    color: ${({ theme }) => theme.colors.secondary_dark};
  }

  input,
  textarea {
    display: block;
    width: 100%;
    border-radius: 5px;
    padding: 5px;

    border: 1px solid ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.secondary_dark};

    background-color: ${({ theme }) => theme.colors.secondary_light};
  }

  input:focus,
  textarea:focus {
    outline: none;
    box-shadow: 0 0 3px ${({ theme }) => theme.colors.secondary};
  }

  input[readOnly],
  textarea[readOnly] {
    border-color: #ddd;
  }
`;

export const ButtonStyled = styled.button<{ primary?: Boolean }>`
  margin-top: 2rem;
  background-color: ${({ primary, theme }) =>
    primary ? theme.colors.main : "white"};

  border: 1px solid ${({ theme }) => theme.colors.main};
  border-radius: 20px;
  padding: 2rem 4rem;
  color: ${({ primary, theme }) => (primary ? "white" : theme.colors.main)};

  font-size: 3rem;

  align-self: center;

  cursor: pointer;

  text-transform: capitalize;

  transition: all 0.3s;

  width: 20rem;

  &:focus,
  &:hover {
    outline: none;
    box-shadow: 0 0 5px ${({ theme }) => theme.colors.main_lighter};
    color: white;
  }

  &:focus {
    color: ${({ primary, theme }) =>
      primary ? "white" : theme.colors.main_lighter};
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.main_lighter};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(1px);
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
      <ButtonStyled type="submit" disabled={isCreating} primary>
        {isCreating ? "Creating..." : "Create"}
      </ButtonStyled>
    </FormStyled>
  );
}
