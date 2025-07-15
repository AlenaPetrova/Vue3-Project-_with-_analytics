import {
  createWebHistory,
  createRouter,
  type RouteLocationNormalized,
} from "vue-router";

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

const routesWithFilter = [
  "main",
  "totalprice",
  "discountrcent",
  "numofsales",
  "numofcancel",
  "article",
];

const setQueryParams = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized
) => {
  const isFromRouteWithFilter = routesWithFilter.find(
    (route) => route === from.name
  );
  const isToRouteWithFilter = routesWithFilter.find(
    (route) => route === to.name
  );
  const { filterSelected: fromSelected, filterValue: fromValue } = from.query;
  const { filterSelected: toSelected, filterValue: toValue } = to.query;

  if (
    isFromRouteWithFilter &&
    isToRouteWithFilter &&
    (fromSelected !== toSelected || fromValue !== toValue)
  )
    return {
      name: to.name,
      query: {
        ...to.query,
        filterSelected: from.query.filterSelected,
        filterValue: from.query.filterValue,
      },
      hash: to.hash,
    };
};

const routes = [
  {
    path: "/",
    component: Layout,
    children: [
      { path: "", name: "layout", redirect: "/main" },
      {
        path: "incomes",
        name: "incomes",
        component: Incomes,
      },
      {
        path: "orders",
        name: "orders",
        component: Orders,
      },
      {
        path: "sales",
        name: "sales",
        component: Sales,
      },
      {
        path: "stocks",
        name: "stocks",
        component: Stocks,
      },
      {
        path: "main",
        name: "main",
        component: MainPage,
        beforeEnter: [setQueryParams],
      },
      {
        path: "main/totalprice",
        name: "totalprice",
        component: TotalPrice,
        beforeEnter: [setQueryParams],
      },
      {
        path: "main/discountrcent",
        name: "discountrcent",
        component: DiscountPercent,
        beforeEnter: [setQueryParams],
      },
      {
        path: "main/numofsales",
        name: "numofsales",
        component: NumberOfSales,
        beforeEnter: [setQueryParams],
      },
      {
        path: "main/numofcancel",
        name: "numofcancel",
        component: NumberOfCancellations,
        beforeEnter: [setQueryParams],
      },
      {
        path: "article/:id(\\d+)",
        name: "article",
        component: Article,
        beforeEnter: [setQueryParams],
      },
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
