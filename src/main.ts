import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";
import i18n from "./i18n";
import { store, key } from "./store";

const app = createApp(App);

app.use(i18n);
app.use(router);
app.use(store, key);

console.log(i18n.global.messages.value);

app.mount("#app");
