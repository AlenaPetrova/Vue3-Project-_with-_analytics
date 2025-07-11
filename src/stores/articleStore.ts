import { defineStore, storeToRefs } from "pinia";
import { computed, type ComputedRef } from "vue";
import type { Article, ArticleMetrics, OrderMetrics } from "@/types";
import { useOrderStore } from "@/stores/orderStore";

export const useArticleStore = defineStore("article", () => {
  const orderStore = useOrderStore();
  const {
    allArticles: allOrderNMID,
    salesMetrics,
    cancelMetrics,
    discPercentMetrics,
    totalPriceMetrics,
  } = storeToRefs(orderStore);

  const loadingArticles = computed(() =>
    orderArticles.value.length ? false : true
  );

  const orderArticles = computed(() => getArticles(allOrderNMID.value));

  const getArticles = (unicArticles: Set<number>): Article[] =>
    Array.from(unicArticles).map((nm_id) => ({
      nm_id,
      name: "Букет белых лилий",
      brand: "Магазин цветов",
      category: "Живые цветы",
      img: "test_img.jpg",
      date: "2025-07-09",
      size: "7-21 шт",
      count: 50,
      price: 5000,
    }));

  const getArticle = (nm_id: number, storeName = "order"): Article | null => {
    if (storeName === "order")
      return orderArticles.value.find((obj) => obj.nm_id === nm_id) ?? null;
    return null;
  };

  const getArticleMetrics = (
    nm_id: number,
    storeName = "order"
  ): ArticleMetrics[] | null => {
    const transformMetric = (
      obj: OrderMetrics,
      name: string
    ): ArticleMetrics => {
       if (!obj) {
         return {
           name,
           prev: 0,
           current: 0,
           change: "0%",
           svg: 0,
         };
       }
      const { nm_id, ...rest } = obj ;
      return {
        ...rest,
        name,
      };
    };

    if (storeName === "order") {
      const objPrice = (
        totalPriceMetrics as ComputedRef<OrderMetrics[]>
      ).value.find((obj) => obj.nm_id === nm_id);
      const objDiscount = (
        discPercentMetrics as ComputedRef<OrderMetrics[]>
      ).value.find((obj) => obj.nm_id === nm_id);
      const objSale = (salesMetrics as ComputedRef<OrderMetrics[]>).value.find(
        (obj) => obj.nm_id === nm_id
      );
      const objCancel = (
        cancelMetrics as ComputedRef<OrderMetrics[]>
      ).value.find((obj) => obj.nm_id === nm_id);

      return [
        transformMetric(objPrice as OrderMetrics, "Средняя цена продаж"),
        transformMetric(objDiscount as OrderMetrics, "Средний размер скидки"),
        transformMetric(objSale as OrderMetrics, "Кол-во продаж"),
        transformMetric(objCancel as OrderMetrics, "Кол-во отмен"),
      ];
    }
    return null;
  };

  return {
    loadingArticles,
    orderArticles,
    getArticles,
    getArticle,
    getArticleMetrics,
  };
});
