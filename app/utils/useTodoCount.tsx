import { useFetchers } from "@remix-run/react";
import type { Todo } from "~/models/Todo.server";

export default function useTodoCount(todos: Todo[]): number {
  const fetchers = useFetchers();
  let completedTasks = 0;

  // 1) Find my task's submissions
  const myFetchers = new Map();
  for (const f of fetchers) {
    if (f.submission && f.submission.action.startsWith("/todos/oui")) {
      const taskId = f.submission.formData.get("id");
      myFetchers.set(taskId, f.submission.formData);
    }
  }

  for (const task of todos) {
    // 2) use the optimistic version
    if (myFetchers.has(task.id)) {
      const formData = myFetchers.get(task.id);
      const intent = formData.get("intent");
      if (intent === "duplicate") {
        completedTasks += 1;
        const newId = formData.get("newId");
        if (!todos.find(({ id }) => id === newId)) completedTasks += 1;
      }
    }
    // 3) use the normal version
    else completedTasks++;
  }

  return completedTasks;
}
