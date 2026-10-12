import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { createVfm } from "vue-final-modal";

const app = createApp(App);

app.use(router);
app.use(createVfm());
app.use(createPinia());

app.mount("body");
