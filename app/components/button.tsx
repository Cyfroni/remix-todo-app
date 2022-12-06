import { FidgetSpinner } from "react-loader-spinner";
import styled from "styled-components";

export const ButtonStyled = styled.button<{ primary?: boolean }>`
  background-color: ${({ primary, theme }) =>
    primary ? theme.colors.main : "white"};

  border: 1px solid ${({ theme }) => theme.colors.main};
  border-radius: 20px;
  padding: 2rem 4rem;
  color: ${({ primary, theme }) => (primary ? "white" : theme.colors.main)};

  font-size: 3rem;

  align-self: center;

  text-transform: capitalize;

  width: 20rem;

  transition: all 0.3s, color 0s;

  &:disabled {
    border: 1px solid
      ${({ primary, theme }) =>
        primary ? theme.colors.main : theme.colors.grey};
    color: ${({ primary, theme }) => (primary ? "white" : theme.colors.grey)};
  }

  &:not(:disabled) {
    cursor: pointer;

    &:focus,
    &:hover {
      outline: none;
      box-shadow: 0 0 5px ${({ theme }) => theme.colors.main_lighter};
      color: white;
    }

    &:focus {
      color: ${({ primary, theme }) =>
        primary ? "white" : theme.colors.main_lighter};
    }

    &:hover {
      background-color: ${({ theme }) => theme.colors.main_lighter};
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(1px);
    }
  }
`;

export const DeleteButton = styled(ButtonStyled)`
  background-color: ${({ theme }) => theme.colors.error};
  border: transparent;
  &:not(:disabled) {
    &:focus,
    &:hover {
      box-shadow: 0 0 5px ${({ theme }) => theme.colors.error_lighter};
    }

    &:hover {
      background-color: ${({ theme }) => theme.colors.error_lighter};
    }
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    position: absolute;
    z-index: 100;
  }

  button[disabled] {
    color: transparent;
  }
`;

export function SubmitButtonWithLoader({
  loading,
  label,
  className,
}: {
  loading: boolean;
  label: string;
  className?: string;
}) {
  return (
    <ButtonWrapper className={className}>
      <FidgetSpinner
        visible={loading}
        height="70"
        width="70"
        ariaLabel="dna-loading"
        wrapperStyle={{}}
        wrapperClass="dna-wrapper"
        ballColors={["transparent", "transparent", "transparent"]}
        backgroundColor="white"
      />
      <ButtonStyled type="submit" disabled={loading} primary>
        {label}
      </ButtonStyled>
    </ButtonWrapper>
  );
}
