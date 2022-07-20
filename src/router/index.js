import Vue from "vue";
import VueRouter from "vue-router";
import Podaci from "../views/Podaci.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "podaci",
    component: Podaci,
  },
  {
    path: "/dolazak",
    name: "dolazak",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Dolazak.vue"),
  },
  {
    path: "/odlazak",
    name: "odlazak",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Odlazak.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
