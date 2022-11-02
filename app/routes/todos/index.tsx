import { faCopy, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type {
  ActionFunction,
  HeadersFunction,
  LoaderFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useFetcher, useLoaderData } from "@remix-run/react";
import { FidgetSpinner } from "react-loader-spinner";
import styled from "styled-components";
import invariant from "tiny-invariant";
import { deleteTodo, duplicateTodo, getTodos } from "~/models/Todo.server";

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    // "Cache-Control": `public, max-age=20`,
    // "Cache-Control": `no-cache, no-store, must-revalidate`,
  };
};

type LoaderData = {
  tasks: Awaited<ReturnType<typeof getTodos>>;
};

export const loader: LoaderFunction = async () => {
  const todos = await getTodos();
  return json<LoaderData>(
    { tasks: todos }
    // { headers: { "Cache-Control": "public, max-age=10" } }
  );
};

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();

  const id = data.get("id");

  invariant(typeof id === "string", "Id must be a string");

  const intent = data.get("intent");

  if (intent === "delete") deleteTodo(id);
  if (intent === "duplicate") duplicateTodo(id);

  return null;
};

export const Box = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 50rem;
  margin: 0 auto;
  margin-top: 5rem;

  ul {
    list-style: none;

    /* li {
      display: flex;
      align-items: center;
      margin-top: 1rem;
    }

    a {
      flex: 1;
      color: white;
      text-decoration: none;
      padding: 1rem 2rem;
      border-radius: 5px;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      background-color: ${({ theme }) => theme.colors.main};
      transition: all 0.3s;

      &:focus,
      &:hover {
        outline: none;
        box-shadow: 0 0 5px ${({ theme }) => theme.colors.main_lighter};
      }

      &:hover {
        background-color: ${({ theme }) => theme.colors.main_lighter};
      }
    } */
  }
`;

const FormStyled = styled(Form)`
  margin-left: 1rem;
  display: flex;
  button {
    background-color: transparent;
    border: none;
    color: white;
    padding: 0.25rem 0;

    display: block;
    border-bottom: 1px solid transparent;

    height: 3.5rem;
    width: 3.5rem;

    transition: all 0.3s;

    cursor: pointer;

    color: ${({ theme }) => theme.colors.error};

    &:hover {
      color: ${({ theme }) => theme.colors.error_lighter};
    }

    &:focus {
      outline: none;
      border-bottom: 1px solid ${({ theme }) => theme.colors.error_lighter};
    }

    svg {
      height: 100%;
    }
  }
  button[value="duplicate"] {
    color: #656839;

    &:hover {
      color: #737641;
    }

    &:focus {
      border-bottom: 1px solid #737641;
    }
  }
`;

// export default function Index() {
//   const { tasks } = useLoaderData() as LoaderData;
//   const transition = useTransition();

//   const isDeleting = Boolean(transition.submission);

//   return (
//     <Box>
//       <h1>{tasks.length > 0 ? "Things you should do:" : "Nothing to do ⛱"}</h1>
//       <ul>
//         {tasks.map(({ task }, index) => (
//           <li key={task}>
//             {/* <Link to={`todo/${task}`} prefetch="intent"> */}
//             <Link to={`todo/${task}`}>
//               {index + 1}. {task}
//             </Link>
//             <FormStyled method="delete">
//               <input type="hidden" name="task" value={task} />
//               {isDeleting ? (
//                 "deleting"
//               ) : (
//                 <button type="submit" name="intent" value="delete">
//                   <FontAwesomeIcon icon={faTrash} />
//                 </button>
//               )}

//               <button type="submit" name="intent" value="duplicate">
//                 <FontAwesomeIcon icon={faCopy} />
//               </button>
//             </FormStyled>
//           </li>
//         ))}
//       </ul>
//     </Box>
//   );
// }

export default function Index() {
  const { tasks } = useLoaderData() as LoaderData;

  return (
    <Box>
      <h1>{tasks.length > 0 ? "Things you should do:" : "Nothing to do ⛱"}</h1>
      <ul>
        {tasks.map(({ id, task }, index) => (
          <TodoElem task={task} index={index} key={id} id={id} />
        ))}
      </ul>
    </Box>
  );
}

export const TodolistItem = styled.li<{ optimistic?: boolean }>`
  display: flex;
  align-items: center;
  margin-top: 1rem;

  a,
  span {
    flex: 1;
    color: white;
    text-decoration: none;
    padding: 1rem 2rem;
    border-radius: 5px;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    background-color: ${({ theme }) => theme.colors.grey};
  }

  a {
    background-color: ${({ theme }) => theme.colors.main};
    transition: all 0.3s;

    &:focus,
    &:hover {
      outline: none;
      box-shadow: 0 0 5px ${({ theme }) => theme.colors.main_lighter};
    }

    &:hover {
      background-color: ${({ theme }) => theme.colors.main_lighter};
    }
  }

  form {
    margin-left: 1rem;
    display: flex;
    button {
      background-color: transparent;
      border: none;
      color: white;
      padding: 0.25rem 0;

      display: block;
      border-bottom: 1px solid transparent;

      height: 3.5rem;
      width: 3.5rem;

      transition: all 0.3s;

      color: ${({ theme }) => theme.colors.grey};

      visibility: ${({ optimistic }) => optimistic && "hidden"};

      &:not(:disabled) {
        cursor: pointer;

        color: ${({ theme }) => theme.colors.error};

        &:hover {
          color: ${({ theme }) => theme.colors.error_lighter};
        }

        &:focus {
          outline: none;
          border-bottom: 1px solid ${({ theme }) => theme.colors.error_lighter};
        }

        &[value="duplicate"] {
          color: #656839;

          &:hover {
            color: #737641;
          }

          &:focus {
            border-bottom: 1px solid #737641;
          }
        }
      }
    }

    svg {
      height: 100%;
    }
  }
`;

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

  // const FetcherFormStyled = styleForm(fetcher.Form);

  return (
    <TodolistItem>
      {/* <Link to={`todo/${task}`} prefetch="intent"> */}
      <Link to={`todo/${id}`}>
        {index + 1}. {task}
      </Link>
      <fetcher.Form method="post">
        <input type="hidden" name="id" value={id} />
        {isDeleting ? (
          <FidgetSpinner
            visible={true}
            height="35"
            width="35"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
            ballColors={["transparent", "transparent", "transparent"]}
            backgroundColor="#F93943"
          />
        ) : (
          <button type="submit" name="intent" value="delete">
            <FontAwesomeIcon icon={faTrash} />
          </button>
        )}
        {isDuplicating ? (
          <FidgetSpinner
            visible={true}
            height="35"
            width="35"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
            ballColors={["transparent", "transparent", "transparent"]}
            backgroundColor="#656839"
          />
        ) : (
          <button type="submit" name="intent" value="duplicate">
            <FontAwesomeIcon icon={faCopy} />
          </button>
        )}
      </fetcher.Form>
    </TodolistItem>
  );
}
