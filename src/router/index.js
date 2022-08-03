import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/podaci",
    name: "podaci",
    component: () => import("../views/Podaci.vue"),
  },
  {
    path: "/dolazak",
    name: "dolazak",
    component: () => import("../views/Dolazak.vue"),
  },
  {
    path: "/odlazak",
    name: "odlazak",
    component: () => import("../views/Odlazak.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
