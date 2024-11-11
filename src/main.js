import "./assets/index.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { VueQueryPlugin } from "@tanstack/vue-query";

import App from "./App.vue";
import router from "./router";
import { queryClient } from "./composables/apiClient";

const app = createApp(App);

app.use(VueQueryPlugin, {
  queryClient,
});
app.use(createPinia());
app.use(router);

app.mount("#app");
