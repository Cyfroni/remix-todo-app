import { useFetchers } from "@remix-run/react";
import type { Todo } from "~/models/Todo.server";

export default function useTodoCount(todos: Todo[]): number {
  const fetchers = useFetchers();
  let completedTasks = 0;

  const myFetchers = new Map();
  for (const f of fetchers) {
    if (f.submission && f.submission.action.startsWith("/todos/oui")) {
      const taskId = f.submission.formData.get("id");
      if (myFetchers.has(taskId)) {
        myFetchers.get(taskId).push(f);
      } else {
        myFetchers.set(taskId, [f]);
      }
    }
  }

  for (const task of todos) {
    if (myFetchers.has(task.id)) {
      for (const fetcher of myFetchers.get(task.id)) {
        const formData = fetcher.submission.formData;
        const actionData = fetcher.data;
        const intent = formData.get("intent");
        if (intent === "duplicate") {
          if (fetcher.state === "submitting") completedTasks++;
          else {
            const newId = actionData?.duplicated?.newId;
            if (!todos.find(({ id }) => id === newId)) completedTasks++;
          }
        }
        if (intent === "delete") completedTasks--;
      }
    }
    completedTasks++;
  }

  return completedTasks;
}
