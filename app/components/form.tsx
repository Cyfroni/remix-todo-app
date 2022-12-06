import { Form } from "@remix-run/react";
import styled from "styled-components";

export const FormStyled = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 50rem;
  margin: 0 auto;
  margin-top: 10rem;

  font-size: 2.5rem;

  em {
    color: ${({ theme }) => theme.colors.error};
    font-size: 1.2rem;
    margin-left: 1rem;
  }

  label {
    color: ${({ theme }) => theme.colors.secondary_dark};
  }

  input,
  textarea {
    display: block;
    width: 100%;
    border-radius: 5px;
    padding: 5px;

    border: 1px solid ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.secondary_dark};

    background-color: ${({ theme }) => theme.colors.secondary_light};

    font-size: 2rem;
  }

  input:focus,
  textarea:focus {
    outline: none;
    box-shadow: 0 0 3px ${({ theme }) => theme.colors.secondary};
  }

  input[readOnly],
  textarea[readOnly] {
    border-color: ${({ theme }) => theme.colors.grey_light};
  }
`;
