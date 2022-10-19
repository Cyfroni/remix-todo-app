import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import invariant from "tiny-invariant";
import { getTodo, updateTodo } from "~/models/Todo";
import { FormStyled } from "./new";

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();

  const task = data.get("task");
  const description = data.get("description");

  invariant(typeof task === "string", "Task must be a string");
  invariant(typeof description === "string", "Description must be a string");

  updateTodo(task, { description });

  return redirect("todo");
};

export const loader: LoaderFunction = async ({ params }) => {
  const { todoId } = params;

  invariant(todoId, "todoId not provided");

  return getTodo(todoId);
};

export default function Todo() {
  const { task, description, deadline } = useLoaderData();
  const [editing, setEditing] = useState(false);

  return (
    <FormStyled method="put">
      <label>
        Task
        <input type="text" name="task" readOnly defaultValue={task} />
      </label>
      <label>
        Description
        <textarea
          name="description"
          // cols={30}
          // rows={10}
          readOnly={!editing}
          defaultValue={description}
        ></textarea>
      </label>
      <label>
        Deadline
        <input type="text" name="deadline" readOnly defaultValue={deadline} />
      </label>
      {!editing && <button onClick={() => setEditing(true)}>edit</button>}
      {editing && <button onClick={() => setEditing(false)}>cancel</button>}
      {editing && <button type="submit">save</button>}
    </FormStyled>
  );
}
