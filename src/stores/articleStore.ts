import { defineStore, storeToRefs } from "pinia";
import { computed } from "vue";
import type { Article, ArticleMetrics, Order, OrderMetrics } from "@/types";
import { useOrderStore } from "@/stores/orderStore";
import { getAllPeriodByDays } from "@/composables/useDate";

export const useArticleStore = defineStore("article", () => {
  const orderStore = useOrderStore();
  const {
    startPrevPeriod,
    endCurrPeriod,
    allOrders,
    allArticles: allOrderNMID,
    salesMetrics,
    cancelMetrics,
    discPercentMetrics,
    totalPriceMetrics,
  } = storeToRefs(orderStore);

  const loadingArticles = computed(() =>
    orderArticles.value.length ? false : true
  );

  const allPeriodByDays = computed(() => {
    if (!startPrevPeriod.value || !endCurrPeriod.value) return [];
    return getAllPeriodByDays(startPrevPeriod.value, endCurrPeriod.value);
  });

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
          change: "0%",
          svg: 0,
        };
      }
      const { change, svg } = obj;
      return {
        name,
        change,
        svg,
      };
    };

    if (storeName === "order") {
      const objPrice = (totalPriceMetrics.value as OrderMetrics[]).find(
        (obj) => obj.nm_id === nm_id
      );
      const objDiscount = (discPercentMetrics.value as OrderMetrics[]).find(
        (obj) => obj.nm_id === nm_id
      );
      const objSale = (salesMetrics.value as OrderMetrics[]).find(
        (obj) => obj.nm_id === nm_id
      );
      const objCancel = (cancelMetrics.value as OrderMetrics[]).find(
        (obj) => obj.nm_id === nm_id
      );

      const objPriceByDays = transformMetric(
        objPrice as OrderMetrics,
        "Средняя цена продаж"
      );
      const objDuscountByDays = transformMetric(
        objDiscount as OrderMetrics,
        "Средний размер скидки"
      );
      const objSalesByDays = transformMetric(
        objSale as OrderMetrics,
        "Кол-во продаж"
      );
      const objCancelByDays = transformMetric(
        objCancel as OrderMetrics,
        "Кол-во отмен"
      );

      allPeriodByDays.value.map((date) => {
        const ordersByDate = allOrders.value.filter(
          (order) => order.nm_id === nm_id && order.date.includes(date)
        );
        const count = ordersByDate.length;
        const sumTotalPrice = ordersByDate.reduce((sum, order) => {
          return sum + parseFloat(order.total_price);
        }, 0);
        const sumDiscount = ordersByDate.reduce((sum, order) => {
          return sum + order.discount_percent;
        }, 0);
        const sumSales = ordersByDate.reduce((sum, order) => {
          return !order.is_cancel ? sum + 1 : sum;
        }, 0);
        const sumCancel = ordersByDate.reduce((sum, order) => {
          return order.is_cancel ? sum + 1 : sum;
        }, 0);

        const meanTotalPrice =
          count && sumTotalPrice ? Math.round(sumTotalPrice / count) : 0;
        const meanDiscount =
          count && sumDiscount ? Math.round(sumDiscount / count) : 0;

        objPriceByDays[date] = meanTotalPrice;
        objDuscountByDays[date] = meanDiscount;
        objSalesByDays[date] = sumSales;
        objCancelByDays[date] = sumCancel;
      });
      return [
        objPriceByDays,
        objDuscountByDays,
        objSalesByDays,
        objCancelByDays,
      ];
    }
    return null;
  };

  const findIdByFilter = (field: keyof Order, value: string): number | null => {
    const order = allOrders.value.find((item) => {
      if (typeof item[field] === "string")
        return item[field].toLowerCase().includes(value.toLowerCase());
    });
    return order?.nm_id || null;
  };

  return {
    loadingArticles,
    orderArticles,
    allPeriodByDays,
    getArticles,
    getArticle,
    getArticleMetrics,
    findIdByFilter,
  };
});
