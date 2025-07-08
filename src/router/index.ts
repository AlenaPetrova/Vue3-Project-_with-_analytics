import { createWebHistory, createRouter } from "vue-router";

const Layout = () => import("@/views/Layout.vue");
const Incomes = () => import("@/views/Incomes.vue");
const Orders = () => import("@/views/Orders.vue");
const Sales = () => import("@/views/Sales.vue");
const Stocks = () => import("@/views/Stocks.vue");
const MainPage = () => import("@/views/MainPage.vue");
const TotalPrice = () => import("@/views/TotalPrice.vue");
const DiscountPercent = () => import("@/views/DiscountPercent.vue");
const NumberOfSales = () => import("@/views/NumberOfSales.vue");
const NumberOfCancellations = () => import("@/views/NumberOfCancellations.vue");
const Article = () => import("@/views/Article.vue");


const routes = [
  {
    path: "/",
    name: "layout",
    component: Layout,
    children: [
      { path: "", redirect: "/main" },
      { path: "incomes", name: "incomes", component: Incomes },
      { path: "orders", name: "orders", component: Orders },
      { path: "sales", name: "sales", component: Sales },
      { path: "stocks", name: "stocks", component: Stocks },
      { path: "main", name: "main", component: MainPage },
      { path: "main/totalprice", name: "totalprice", component: TotalPrice },
      {
        path: "main/discountrcent",
        name: "discountrcent",
        component: DiscountPercent,
      },
      {
        path: "main/numofsales",
        name: "numofsales",
        component: NumberOfSales,
      },
      {
        path: "main/numofcancel",
        name: "numofcancel",
        component: NumberOfCancellations,
      },
      { path: "main/article/:id(\\d+)", name: "article", component: Article },
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
