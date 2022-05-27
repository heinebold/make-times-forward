import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { store, key } from "./store";

const app = createApp(App);

app.use(router);
app.use(store, key);
app.use(createPinia());

app.mount("#app");
