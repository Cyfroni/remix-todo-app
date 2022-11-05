import styled from "styled-components";

export const TodosWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 50rem;
  margin: 0 auto;
  margin-top: 5rem;

  ul {
    list-style: none;
  }
`;

export const TodolistItem = styled.li`
  display: flex;
  align-items: center;
  margin-top: 1rem;

  a {
    flex: 1;
    color: white;
    text-decoration: none;
    padding: 1rem 2rem;
    border-radius: 5px;
    margin-right: 1rem;

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
  }

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
  form {
    display: flex;
  }
`;

export const OptimisticTodolistItem = styled(TodolistItem)`
  span {
    flex: 1;
    color: white;
    text-decoration: none;
    padding: 1rem 2rem;
    border-radius: 5px;
    margin-right: 1rem;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    background-color: ${({ theme }) => theme.colors.grey};
  }
`;
