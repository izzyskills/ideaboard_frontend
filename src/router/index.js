import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import SignupView from "@/views/SignupView.vue";
import LoginView from "@/views/LoginView.vue";
import AboutProjectView from "@/views/AboutProjectView.vue";
import IdeaView from "@/views/IdeaView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/signup",
      name: "signup",
      component: SignupView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/project/:id",
      name: "project",
      component: AboutProjectView,
    },
    {
      path: "/idea/:id",
      name: "idea",
      component: IdeaView,
    },
  ],
});

export default router;
