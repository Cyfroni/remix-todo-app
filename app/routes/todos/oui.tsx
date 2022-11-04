import { faCopy, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ActionFunction } from "@remix-run/node";
import { Link, useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import invariant from "tiny-invariant";
import { deleteTodo, duplicateTodo } from "~/models/Todo.server";
import { useTodos } from "../todos";
import { Box, TodolistItem } from "./index";

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();

  const id = data.get("id");

  invariant(typeof id === "string", "Id must be a string");

  const intent = data.get("intent");

  try {
    // if (Math.random() > 0.5) throw new Error("boom!");
    // throw new Error("boom!");
  } catch (e) {
    // return { error: intent };
    return { error: true };
  }

  if (intent === "delete") {
    deleteTodo(id);
    return { deleted: id };
  }
  if (intent === "duplicate") {
    const newId = Math.random().toString();
    duplicateTodo(id, newId);
    return { duplicated: { newId, oldId: id } };
  }

  return null;
};

export default function Index() {
  const { todos, todoCount } = useTodos();

  return (
    <Box>
      <h1>
        {todoCount > 0 ? "Things you should do:" : "Nothing to do ⛱"}{" "}
        {todoCount}
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

function OptimisticTodoElem({
  originId,
  task,
}: {
  originId: string;
  task: string;
}) {
  const fetcher = useFetcher();

  useEffect(() => {
    fetcher.submit({ id: originId, intent: "duplicate" }, { method: "post" });
  }, []);

  const { todos } = useTodos();
  const id = fetcher.data?.duplicated.newId;
  if (todos.find((t) => t.id === id)) return null;

  return (
    <TodolistItem optimistic={true}>
      <span>{task}</span>
    </TodolistItem>
  );
}

// function TodoRowElem({
//   id,
//   task,
//   fetcher,
//   optimistic,
// }: {
//   id?: string;
//   task: string;
//   fetcher: FetcherWithComponents<any>;
//   optimistic?: boolean;
// }) {
//   // const actionData = fetcher.data;
//   // const isSubmitting = Boolean(fetcher.submission);

//   const deleteFetcher = useFetcher();

//   if (deleteFetcher.submission) return null;

//   return (
//     <TodolistItem optimistic={optimistic}>
//       {optimistic ? (
//         <span>{task}</span>
//       ) : (
//         <Link to={`todo/${id}`}>
//           {/* {index + 1}. {task} */}
//           {task}
//         </Link>
//       )}
//       <deleteFetcher.Form method="delete">
//         <input type="hidden" name="id" value={id ?? ""} />
//         <button
//           type="submit"
//           name="intent"
//           value="delete"
//           disabled={!!deleteFetcher.submission}
//         >
//           <FontAwesomeIcon icon={faTrash} />
//           {!deleteFetcher.submission && deleteFetcher.data?.error && "retry"}
//         </button>
//       </deleteFetcher.Form>
//       <fetcher.Form method="post">
//         <input type="hidden" name="id" value={id ?? ""} />
//         <button
//           type="submit"
//           name="intent"
//           value="duplicate"
//           disabled={!!fetcher.submission}
//         >
//           <FontAwesomeIcon icon={faCopy} />
//           {!fetcher.submission && fetcher.data?.error && "retry"}
//         </button>
//       </fetcher.Form>
//     </TodolistItem>
//   );
// }

function TodoElem({
  task,
  index,
  id,
}: {
  task: string;
  index: number;
  id: string;
}) {
  const deleteFetcher = useFetcher();
  const duplicationFetcher = useFetcher();

  const isDeleting = Boolean(deleteFetcher.submission);
  const deletionError = deleteFetcher.data?.error;
  const isDuplicating = Boolean(duplicationFetcher.submission);
  const duplicationError = duplicationFetcher.data?.error;

  // const [newId, setNewId] = useState();
  // useEffect(() => {
  //   if (duplicationFetcher.state === "idle") setNewId(undefined);
  //   if (duplicationFetcher.state === "loading")
  //     setNewId(duplicationFetcher.data?.duplicated?.newId);
  // }, [duplicationFetcher]);

  // const [newIds, setNewIds] = useState([] as string[]);

  // console.log(duplicationFetcher);

  // useEffect(() => {
  //   if (duplicationFetcher.state === "idle") setNewIds([]);
  //   if (duplicationFetcher.state === "loading")
  //     setNewIds((ids) => [...ids, duplicationFetcher.data?.duplicated?.newId]);
  // }, [duplicationFetcher]);

  const [copies, setCopies] = useState([] as object[]);

  const doCopy = () => setCopies((cs) => [...cs, {}]);

  return (
    <>
      {!isDeleting && (
        <TodolistItem>
          <Link to={`todo/${id}`}>
            {/* {index + 1}. {task} */}
            {task}
          </Link>
          <deleteFetcher.Form method="delete">
            <input type="hidden" name="id" value={id} />
            <button type="submit" name="intent" value="delete">
              <FontAwesomeIcon icon={faTrash} />
              {deletionError && "retry"}
            </button>
          </deleteFetcher.Form>
          <FontAwesomeIcon
            icon={faCopy}
            onClick={doCopy}
            style={{ width: "35px", height: "35px" }}
          />
          {/* <duplicationFetcher.Form method="post">
            <input type="hidden" name="id" value={id} />
            <button
              type="submit"
              name="intent"
              value="duplicate"
              disabled={duplicationFetcher.state === "submitting"}
              // disabled={isDuplicating}
            >
              <FontAwesomeIcon icon={faCopy} />
              {!isDuplicating && duplicationError && "retry"}
            </button>
          </duplicationFetcher.Form> */}
        </TodolistItem>
      )}
      {/* {duplicationFetcher.state === "submitting" && (
        <OptimisticTodoElem task={task + " - Copy"} />
      )}
      {newIds.map((nId) => (
        <OptimisticTodoElem key={nId} id={nId} task={task + " - Copy"} />
      ))} */}

      {copies.map((val, index) => (
        <OptimisticTodoElem key={index} originId={id} task={task + " - Copy"} />
      ))}
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
