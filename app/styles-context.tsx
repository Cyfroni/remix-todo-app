import * as React from "react";
import { ThemeProvider as TProvider } from "styled-components";
// import {} from "styled-components/cssprop";

const StylesContext = React.createContext<null | React.ReactNode>(null);
export const StylesProvider = StylesContext.Provider;
export const useStyles = () => React.useContext(StylesContext);

const theme = {
  colors: {
    main: "#1ba3c6",
    main_lighter: "#1DB2D7",
    main_light: "#EDF9FD",
    main_dark: "#0A3B48",

    secondary: "#43b929",
    secondary_lighter: "#49C92C",
    secondary_light: "#F1FBEE",
    secondary_dark: "#256515",

    error: "#F93943",
    error_lighter: "#F94D56",

    grey: "#aaa",
    grey_light: "#ddd",
  },
};

export const ThemeProvider = ({ children }: { children: any }): JSX.Element => (
  <TProvider theme={theme}>{children}</TProvider>
);
