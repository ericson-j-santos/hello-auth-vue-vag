// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Vuetify
import { createVuetify } from "vuetify";

const temaPadrao = {
  dark: false,
  colors: {
    primary: "#005CA9",
    accent: "#0D6EFD",
    secondary: "#8A8D93",
    success: "#56CA00",
    info: "#16B1FF",
    warning: "#FFB400",
    error: "#FF4C51",
  },
};

const temaEscuro = {
  dark: true,
  colors: {
    backgroud: "#777",
    primary: "#005CA9",
    accent: "#0D6EFD",
    secondary: "#8A8D93",
    success: "#56CA00",
    info: "#16B1FF",
    warning: "#FFB400",
    error: "#FF4C51",
  },
};

export default createVuetify({
  theme: {
    defaultTheme: "temaPadrao",
    themes: {
      temaPadrao,
      temaEscuro,
    },
  },
});
