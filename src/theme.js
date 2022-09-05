import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Lato",
  },
  variantMapping: {
    h1: "h2",
    h2: "h2",
    h3: "h2",
    h4: "h2",
    h5: "h2",
    h6: "h2",
    subtitle1: "h2",
    subtitle2: "h2",
    body1: "span",
    body2: "span",
  },
  palette: {
    primary: {
      light: "#45c09f",
      main: "#00a278",
      dark: "#00845c",
      contrastText: "#fff",
    },
  },
});

export default theme;
