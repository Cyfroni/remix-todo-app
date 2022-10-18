import type { ActionFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { addTodo } from "~/models/Todo";

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();

  const id = data.get("id");
  const task = data.get("task");
  addTodo({ id, task });
  //   return json({ abc: "123" });

  return null;
};

export default function New() {
  return (
    <div>
      <Form method="post">
        <label>
          Id
          <input type="text" name="id" />
        </label>
        <input type="text" name="task" />
        <button type="submit">submit</button>
      </Form>
    </div>
  );
}
