import VueCookies from "vue-cookies";
import { createApp } from "vue";
import { registerPlugins } from "@/plugins";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";

// Carregamento de fontes adicionais, se necessário
loadFonts();

const app = createApp(App);

//uso de plugins
app.use(vuetify);
app.use(VueCookies);

//registro de plugins
registerPlugins(app);

//montar a aplicação no elemento #app
app.mount("#app");
