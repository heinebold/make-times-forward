import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";
import HomeView from "../views/HomeView.vue";
import SettingsView from "../views/SettingsView.vue";
import EditScheduleView from "../views/EditScheduleView.vue";

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
      component: SettingsView,
    },
    {
      path: "/edit-schedule",
      name: "edit-schedule",
      component: EditScheduleView,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/:pathMatch(.*)",
      component: () => import("../views/NotFoundView.vue"),
    },
  ],
});

export default router;
