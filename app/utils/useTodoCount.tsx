import { useFetchers } from "@remix-run/react";
import { useEffect } from "react";
import type { Todo } from "~/models/Todo.server";

export default function useTodoCount(todos: Todo[]): number {
  const fetchers = useFetchers();
  let completedTasks = 0;

  // 1) Find my task's submissions
  const myFetchers = new Map();
  for (const f of fetchers) {
    if (f.submission && f.submission.action.startsWith("/todos/oui")) {
      const taskId = f.submission.formData.get("id");
      myFetchers.set(taskId, f.submission.formData.get("intent"));
    }
  }

  for (const task of todos) {
    // 2) use the optimistic version
    if (myFetchers.has(task.id)) {
      const intent = myFetchers.get(task.id);
      if (intent === "duplicate") completedTasks += 2;
    }
    // 3) use the normal version
    else completedTasks++;
  }

  // const fetchers = useFetchers();
  // let count = todos.length;

  // useEffect(() => {
  //   console.log(fetchers);
  // }, [fetchers]);

  // for (const f of fetchers) {
  //   if (
  //     f.submission &&
  //     f.submission.action.startsWith("/todos/oui")
  //     // && f.state !== "loading"
  //   ) {
  //     const intent = f.submission?.formData.get("intent");

  //     if (intent === "duplicate") {
  //       count += 1;
  //     }
  //     if (intent === "delete") {
  //       count -= 1;
  //     }
  //   }
  // }

  // return count;
  return completedTasks;
}
