import { createWebHistory, createRouter } from "vue-router";

const Layout = () => import("@/views/Layout.vue");
const Incomes = () => import("@/views/Incomes.vue");
const Orders = () => import("@/views/Orders.vue");
const Sales = () => import("@/views/Sales.vue");
const Stocks = () => import("@/views/Stocks.vue");

const routes = [
  {
    path: "/",
    name: "layout",
    component: Layout,
    children: [
      { path: "", redirect: "/incomes" },
      { path: "incomes", name: "incomes", component: Incomes },
      { path: "orders", name: "orders", component: Orders },
      { path: "sales", name: "sales", component: Sales },
      { path: "stocks", name: "stocks", component: Stocks },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: "active-link",
  linkExactActiveClass: "exact-active-link",
});

export default router;
