import { faCopy, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  FetcherWithComponents,
  Link,
  useFetcher,
  useFetchers,
  useLoaderData,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import invariant from "tiny-invariant";
import {
  addTodo,
  deleteTodo,
  duplicateTodo,
  getTodo,
  getTodos,
} from "~/models/Todo.server";
import useTodoCount from "~/utils/useTodoCount";
import useOptimisticTodos from "~/utils/useTodoCount";
import { Box, TodolistItem } from "./index";

type LoaderData = {
  todos: Awaited<ReturnType<typeof getTodos>>;
};

export const loader: LoaderFunction = async () => {
  const todos = await getTodos();
  return json<LoaderData>({ todos });
};

export const action: ActionFunction = async ({ request }) => {
  // console.log(request);
  const data = await request.formData();

  const id = data.get("id");

  invariant(typeof id === "string", "Id must be a string");

  try {
    // if (Math.random() > 0.5) throw new Error("boom!");
  } catch (e) {
    return { error: true };
  }

  const intent = data.get("intent");

  if (intent === "delete") deleteTodo(id);
  if (intent === "duplicate") duplicateTodo(id);

  return null;
};

export default function Index() {
  const { todos } = useLoaderData() as LoaderData;

  const count = useTodoCount(todos);

  return (
    <Box>
      <h1>
        {count > 0 ? "Things you should do:" : "Nothing to do ⛱"} {count}
      </h1>
      <ul>
        {todos.map(({ task, id }, index) => (
          <TodoElem task={task} index={index} key={id} id={id} />
          // <RecursiveTodoElem task={task} key={id} id={id} />
          // {todos.map(({ task, id, optimistic }, index) => (
          //   <OptimisticTodoElem
          //     task={task}
          //     index={index}
          //     key={id}
          //     id={id}
          //     optimistic={optimistic}
          //   />
        ))}
      </ul>
    </Box>
  );
}

// function RecursiveTodoElem({ task, id }: { task: string; id?: string }) {
//   const fetcher = useFetcher();
//   const actionData = fetcher.data;

//   const isDeleting = Boolean(
//     fetcher.submission?.formData.get("intent") === "delete"
//   );
//   const isDuplicating = Boolean(
//     fetcher.submission?.formData.get("intent") === "duplicate"
//   );

//   return (
//     <>
//       {!fetcher.submission && (
//         <TodolistItem optimistic={!id}>
//           <Link to={`todo/${id}`}>{task}</Link>
//           <fetcher.Form method="delete">
//             <input type="hidden" name="id" value={id} />
//             <button type="submit" name="intent" value="delete">
//               <FontAwesomeIcon icon={faTrash} />
//               {actionData?.error && "retry"}
//             </button>

//             <button type="submit" name="intent" value="duplicate">
//               <FontAwesomeIcon icon={faCopy} />
//               {actionData?.error && "retry"}
//             </button>
//           </fetcher.Form>
//         </TodolistItem>
//       )}

//       {isDuplicating && (
//         <>
//           <RecursiveTodoElem task={task} id={id} />
//           <RecursiveTodoElem task={task + " - Copy"} />
//         </>
//       )}
//     </>
//   );
// }

function TodoRowElem({
  id,
  task,
  fetcher,
}: {
  id?: string;
  task: string;
  fetcher: FetcherWithComponents<any>;
}) {
  const actionData = fetcher.data;
  const isSubmitting = Boolean(fetcher.submission);

  return (
    <TodolistItem optimistic={!id}>
      {id ? (
        <Link to={`todo/${id}`}>
          {/* {index + 1}. {task} */}
          {task}
        </Link>
      ) : (
        <span>{task}</span>
      )}
      <fetcher.Form method="post">
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          name="intent"
          value="delete"
          disabled={isSubmitting}
        >
          <FontAwesomeIcon icon={faTrash} />
          {actionData?.error && "retry"}
        </button>

        <button
          type="submit"
          name="intent"
          value="duplicate"
          disabled={isSubmitting}
        >
          <FontAwesomeIcon icon={faCopy} />
          {actionData?.error && "retry"}
        </button>
      </fetcher.Form>
    </TodolistItem>
  );
}

function TodoElem({
  task,
  index,
  id,
}: {
  task: string;
  index: number;
  id: string;
}) {
  const fetcher = useFetcher();

  const isDeleting = Boolean(
    fetcher.submission?.formData.get("intent") === "delete"
  );
  const isDuplicating = Boolean(
    fetcher.submission?.formData.get("intent") === "duplicate"
  );

  return (
    <>
      {!isDeleting && <TodoRowElem id={id} task={task} fetcher={fetcher} />}
      {isDuplicating && (
        <TodoRowElem task={task + " - Copy"} fetcher={fetcher} />
      )}
    </>
  );
}

// function MultiAddTodoElem({
//   task,
//   index,
//   id,
// }: {
//   task: string;
//   index: number;
//   id: string;
// }) {
//   const fetcher = useFetcher();
//   const actionData = fetcher.data;

//   const isDeleting = Boolean(
//     fetcher.submission?.formData.get("intent") === "delete"
//   );
//   const isDuplicating = Boolean(
//     fetcher.submission?.formData.get("intent") === "duplicate"
//   );

//   const [copies, setCopies] = useState(0);

//   useEffect(() => {
//     if (fetcher.submission?.formData.get("intent") === "duplicate") {
//       if (fetcher.state === "submitting") {
//         setCopies((c) => c + 1);
//       }
//     }
//   }, [fetcher, fetcher.submission?.key]);

//   useEffect(() => {
//     if (fetcher.state === "idle") {
//       setCopies(0);
//     }
//   }, [fetcher.state]);

//   return (
//     <>
//       {!isDeleting && (
//         <TodolistItem>
//           <Link to={`todo/${id}`}>
//             {/* {index + 1}. {task} */}
//             {task}
//           </Link>
//           <fetcher.Form method="delete">
//             <input type="hidden" name="id" value={id} />
//             <button type="submit" name="intent" value="delete">
//               <FontAwesomeIcon icon={faTrash} />
//               {actionData?.error && "retry"}
//             </button>

//             <button type="submit" name="intent" value="duplicate">
//               <FontAwesomeIcon icon={faCopy} />
//               {actionData?.error && "retry"}
//             </button>
//           </fetcher.Form>
//         </TodolistItem>
//       )}
//       {/* {isDuplicating && (
//         <TodolistItem>
//           <Link to="#">#. {task} - Copy</Link>
//           <fetcher.Form method="delete">
//             <button type="submit" disabled>
//               <FontAwesomeIcon icon={faTrash} />
//             </button>
//             <button type="submit" disabled>
//               <FontAwesomeIcon icon={faCopy} />
//             </button>
//           </fetcher.Form>
//         </TodolistItem>
//       )} */}
//       {Array.from(Array(copies).keys()).map((val, index) => (
//         <TodolistItem key={index} optimistic={true}>
//           {/* <Link to="#">#. {task} - Copy</Link> */}
//           <Link to="#">{task} - Copy</Link>
//           <fetcher.Form method="post">
//             <button type="submit" disabled>
//               <FontAwesomeIcon icon={faTrash} />
//             </button>
//             <button type="submit" disabled>
//               <FontAwesomeIcon icon={faCopy} />
//             </button>
//           </fetcher.Form>
//         </TodolistItem>
//       ))}
//     </>
//   );
// }

// function OptimisticTodoElem({
//   task,
//   index,
//   id,
//   optimistic = false,
// }: {
//   task: string;
//   index: number;
//   id: string;
//   optimistic?: boolean;
// }) {
//   const fetcher = useFetcher();
//   const actionData = fetcher.data;

//   const isDeleting = Boolean(
//     fetcher.submission?.formData.get("intent") === "delete"
//   );
//   const isDuplicating = Boolean(
//     fetcher.submission?.formData.get("intent") === "duplicate"
//   );

//   // const [copies, setCopies] = useState(0);

//   // useEffect(() => {
//   //   if (isDuplicating) {
//   //     if (fetcher.state === "submitting") {
//   //       setCopies((c) => c + 1);
//   //     } else {
//   //       setCopies(0);
//   //     }
//   //     // console.log(fetcher);
//   //   }
//   //   // }, [fetcher.state]);
//   // }, [fetcher.state, fetcher.submission?.key]);
//   // console.log(fetcher);

//   // return (
//   //   <>
//   //     <TodolistItem>
//   //       <Link to={`todo/${id}`}>
//   //         {index + 1}. {task}
//   //       </Link>
//   //       <fetcher.Form method="delete">
//   //         <input type="hidden" name="id" value={id} />
//   //         <button type="submit" name="intent" value="delete">
//   //           <FontAwesomeIcon icon={faTrash} />
//   //           {actionData?.error && "retry"}
//   //         </button>

//   //         <button type="submit" name="intent" value="duplicate">
//   //           <FontAwesomeIcon icon={faCopy} />
//   //           {actionData?.error && "retry"}
//   //         </button>
//   //       </fetcher.Form>
//   //     </TodolistItem>
//   //     {Array.from(Array(copies).keys()).map((val, index) => (
//   //       <TodolistItem key={index}>
//   //         <Link to="#">#. {task} - Copy</Link>
//   //         <fetcher.Form method="delete">
//   //           <button type="submit" name="intent" value="delete" disabled>
//   //             <FontAwesomeIcon icon={faTrash} />
//   //           </button>

//   //           <button type="submit" name="intent" value="duplicate" disabled>
//   //             <FontAwesomeIcon icon={faCopy} />
//   //           </button>
//   //         </fetcher.Form>
//   //       </TodolistItem>
//   //     ))}
//   //   </>
//   // );

//   if (isDeleting) return null;

//   // if (optimistic)
//   //   return (
//   //     <TodolistItem>
//   //       <Link to="#">
//   //         {index + 1}. {task}
//   //       </Link>
//   //       <fetcher.Form method="delete">
//   //         <button type="submit" name="intent" value="delete" disabled>
//   //           <FontAwesomeIcon icon={faTrash} />
//   //         </button>

//   //         <button type="submit" name="intent" value="duplicate" disabled>
//   //           <FontAwesomeIcon icon={faCopy} />
//   //         </button>
//   //       </fetcher.Form>
//   //     </TodolistItem>
//   //   );

//   return (
//     <TodolistItem optimistic={optimistic}>
//       <Link to={`/todos/todo/${id}`}>
//         {index + 1}. {task}
//       </Link>
//       <fetcher.Form method="post">
//         <input type="hidden" name="id" value={id} />
//         <button type="submit" name="intent" value="delete">
//           <FontAwesomeIcon icon={faTrash} />
//           {actionData?.error && "retry"}
//         </button>

//         <button
//           type="submit"
//           name="intent"
//           value="duplicate"
//           disabled={isDuplicating}
//         >
//           <FontAwesomeIcon icon={faCopy} />
//           {actionData?.error && "retry"}
//         </button>
//       </fetcher.Form>
//     </TodolistItem>
//   );
// }

// export const ErrorBoundary = (error) => {
//   console.log(error);
//   return <div>something went wrong!</div>;
// };
