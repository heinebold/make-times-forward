import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";
import HomeView from "../views/HomeView.vue";

const historyMode = import.meta.env.VITE_SERVER_SUPPORTS_HISTORY
  ? createWebHistory
  : createWebHashHistory;

const router = createRouter({
  history: historyMode(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/settings",
      name: "settings",
      component: () => import("../views/SettingsView.vue"),
    },
    {
      path: "/edit-schedule",
      name: "edit-schedule",
      component: () => import("../views/EditScheduleView.vue"),
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/:pathMatch(.*)",
      component: () => import("../views/NotFoundView.vue"),
    },
  ],
});

export default router;
