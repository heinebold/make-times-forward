import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { clockPlugin } from "@/stores/clock";

const app = createApp(App);

app.use(router);
const pinia = createPinia();
pinia.use(clockPlugin);
app.use(pinia);

app.mount("#app");
