import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Response } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  useActionData,
  useCatch,
  useLoaderData,
  useParams,
} from "@remix-run/react";
import { useState } from "react";
import styled from "styled-components";
import invariant from "tiny-invariant";
import type { Todo } from "~/models/Todo.server";
import { getTodo, updateTodo } from "~/models/Todo.server";
import { ButtonStyled, FormStyled } from "./new";

type ActionData =
  | {
      description: null | string;
    }
  | undefined;

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();

  const task = data.get("task");
  const description = data.get("description");

  const errors = {
    description: description ? null : "Description is required",
  };

  if (errors.description) {
    return json<ActionData>(errors);
  }

  invariant(typeof task === "string", "Task must be a string");
  invariant(typeof description === "string", "Description must be a string");

  updateTodo(task, { description });

  return redirect("todos");
};

type LoaderData = Todo;

export const loader: LoaderFunction = async ({ params }) => {
  const { todoId } = params;

  invariant(todoId, "TodoId is required");

  const todo = await getTodo(todoId);

  if (!todo) throw new Response("Not Found", { status: 404 });

  return json<LoaderData>(todo);
};

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-around;
`;

export default function TodoRoute() {
  const { task, description, deadline } = useLoaderData() as LoaderData;
  const errors = useActionData() as ActionData;
  const [editing, setEditing] = useState(false);

  return (
    <FormStyled method="put">
      <label>
        Task
        <input type="text" name="task" readOnly defaultValue={task} />
      </label>
      <label>
        Description
        {errors?.description && <em>{errors.description}</em>}
        <textarea
          name="description"
          rows={5}
          readOnly={!editing}
          defaultValue={description}
        ></textarea>
      </label>
      <label>
        Deadline
        <input type="text" name="deadline" readOnly defaultValue={deadline} />
      </label>
      <ButtonsWrapper>
        {!editing && (
          <ButtonStyled primary onClick={() => setEditing(true)}>
            edit
          </ButtonStyled>
        )}
        {editing && (
          <ButtonStyled onClick={() => setEditing(false)}>cancel</ButtonStyled>
        )}
        {editing && (
          <ButtonStyled primary type="submit">
            save
          </ButtonStyled>
        )}
      </ButtonsWrapper>
    </FormStyled>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  const params = useParams();
  if (caught.status === 404) {
    return <div>Uh oh! The task "{params.todoId}" does not exist!</div>;
  }
  throw new Error(`Unsupported thrown response status code: ${caught.status}`);
}
