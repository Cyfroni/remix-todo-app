import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData, useTransition } from "@remix-run/react";
import { FidgetSpinner } from "react-loader-spinner";
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

  addTodo({ task, description, deadline, id: Math.random().toString() });

  return redirect("todos");
};

export const FormStyled = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 50rem;
  margin: 0 auto;
  margin-top: 10rem;

  font-size: 2.5rem;

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

    font-size: 2rem;
  }

  input:focus,
  textarea:focus {
    outline: none;
    box-shadow: 0 0 3px ${({ theme }) => theme.colors.secondary};
  }

  input[readOnly],
  textarea[readOnly] {
    border-color: ${({ theme }) => theme.colors.grey_light};
  }
`;

export const ButtonStyled = styled.button<{ primary?: boolean }>`
  background-color: ${({ primary, theme }) =>
    primary ? theme.colors.main : "white"};

  border: 1px solid ${({ theme }) => theme.colors.main};
  border-radius: 20px;
  padding: 2rem 4rem;
  color: ${({ primary, theme }) => (primary ? "white" : theme.colors.main)};

  font-size: 3rem;

  align-self: center;

  text-transform: capitalize;

  width: 20rem;

  transition: all 0.3s, color 0s;

  &:disabled {
    border: 1px solid
      ${({ primary, theme }) =>
        primary ? theme.colors.main : theme.colors.grey};
    color: ${({ primary, theme }) => (primary ? "white" : theme.colors.grey)};
  }

  &:not(:disabled) {
    cursor: pointer;

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
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    position: absolute;
    z-index: 100;
  }

  button[disabled] {
    color: transparent;
  }
`;

export function SubmitButtonWithLoader({
  loading,
  label,
  className,
}: {
  loading: boolean;
  label: string;
  className?: string;
}) {
  return (
    <ButtonWrapper className={className}>
      <FidgetSpinner
        visible={loading}
        height="70"
        width="70"
        ariaLabel="dna-loading"
        wrapperStyle={{}}
        wrapperClass="dna-wrapper"
        ballColors={["transparent", "transparent", "transparent"]}
        backgroundColor="white"
      />
      <ButtonStyled type="submit" disabled={loading} primary>
        {label}
      </ButtonStyled>
    </ButtonWrapper>
  );
}

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
