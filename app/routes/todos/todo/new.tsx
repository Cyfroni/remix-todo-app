import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useTransition } from "@remix-run/react";
import styled from "styled-components";
import invariant from "tiny-invariant";
import { addTodo } from "~/models/Todo.server";
import { SubmitButtonWithLoader } from "~/components/button";
import { FormStyled } from "~/components/form";

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

  addTodo({ task, description, deadline, id: Math.random().toString() });

  return redirect("todos");
};

const SubmitButtonWithLoaderStyled = styled(SubmitButtonWithLoader)`
  margin-top: 2rem;
`;

export default function New() {
  const errors = useActionData() as ActionData;
  const transition = useTransition();

  const isSubmitting = Boolean(transition.submission);

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
        <textarea name="description" rows={5}></textarea>
      </label>
      <label>
        Deadline
        {errors?.deadline && <em>{errors.deadline}</em>}
        <input type="text" name="deadline" />
      </label>
      <SubmitButtonWithLoaderStyled loading={isSubmitting} label="Create" />
    </FormStyled>
  );
}
