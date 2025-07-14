import { defineStore } from "pinia";
import { computed, ref, watch, type Ref } from "vue";
import type { Order, OrderMetrics, OrderMetricsChart, Resp } from "@/types";
import axios from "axios";
import {
  getYesterdayStr,
  getEightDaysAgoStr,
  getTwoWeeksAgoStr,
  getWeekAgoStr,
} from "@/composables/useDate";

export const useOrderStore = defineStore("order", () => {
  const resetData: Resp = {
    data: [],
    links: {
      first: "",
      last: "",
      prev: null,
      next: null,
    },
    meta: {
      current_page: 0,
      from: null,
      last_page: 0,
      links: [],
      path: "",
      per_page: "",
      to: null,
      total: 0,
    },
  };
  const allData: Ref<Resp> = ref(resetData);
  const orders: Ref<Order[]> = ref([]);
  const allOrders: Ref<Order[]> = ref([]);
  const loadingOrders = ref(false);
  const loadingAllOrders = ref(false);
  const error = ref<string | null>(null);

  const currentPage = ref(1);
  const totalPages = computed(() => allData.value.meta.last_page);
  const totalPagesAllOrders = ref<number | null>(null);

  const filterSelected = ref("");
  const filterValue = ref("");

  const filterTotalPriceMatrics: Ref<OrderMetrics[]> = ref([]);
  const filterDiscPercentMatrics: Ref<OrderMetrics[]> = ref([]);
  const filterSalesMatrics: Ref<OrderMetrics[]> = ref([]);
  const filterCancelMatrics: Ref<OrderMetrics[]> = ref([]);

  const startPrevPeriod = getTwoWeeksAgoStr();
  const endPrevPeriod = getEightDaysAgoStr();
  const startCurrPeriod = getWeekAgoStr();
  const endCurrPeriod = getYesterdayStr();

  const prevPeriod = computed(() => getPeriod(startPrevPeriod, endPrevPeriod));
  const currPeriod = computed(() => getPeriod(startCurrPeriod, endCurrPeriod));

  const allArticles = computed(
    () => new Set([...allOrders.value.map((order) => order.nm_id)])
  );

  const salesMetrics = computed(() => getMetrics("is_cancel", false));
  const sortedDescChangeSalesMetrics = computed(() =>
    sortedMetrics(filterSalesMatrics.value, "change", "desc")
  );
  const topSalesMetrics = computed(() =>
    getTopMetrics(sortedDescChangeSalesMetrics.value, 10)
  );
  const sumSalesMetrics = computed(() =>
    getSumMetrics(salesMetrics.value as OrderMetrics[])
  );

  const cancelMetrics = computed(() => getMetrics("is_cancel", true));
  const sortedDescChangeCancelMetrics = computed(() =>
    sortedMetrics(filterCancelMatrics.value, "change", "desc")
  );
  const topCancelMetrics = computed(() =>
    getTopMetrics(sortedDescChangeCancelMetrics.value, 10)
  );
  const sumCancelMetrics = computed(() =>
    getSumMetrics(cancelMetrics.value as OrderMetrics[])
  );

  const discPercentMetrics = computed(() => getMetrics("discount_percent"));
  const sortedDescChangeDiscPercentMetrics = computed(() =>
    sortedMetrics(filterDiscPercentMatrics.value, "change", "desc")
  );
  const topDiscPercentMetrics = computed(() =>
    getTopMetrics(sortedDescChangeDiscPercentMetrics.value, 10)
  );
  const sumDiscPercentMetrics = computed(() =>
    getMeanSumMetrics(discPercentMetrics.value as OrderMetrics[])
  );

  const totalPriceMetrics = computed(() => getMetrics("total_price"));
  const sortedDescChangeTotalPriceMetrics = computed(() =>
    sortedMetrics(filterTotalPriceMatrics.value, "change", "desc")
  );
  const topTotalPriceMetrics = computed(() =>
    getTopMetrics(sortedDescChangeTotalPriceMetrics.value, 10)
  );
  const sumTotalPriceMetrics = computed(() =>
    getMeanSumMetrics(totalPriceMetrics.value as OrderMetrics[])
  );

  const fetchAllOrders = async (page = 1) => {
    error.value = null;
    loadingAllOrders.value = true;

    try {
      const response = await axios.get<Resp>("/api/orders", {
        params: {
          dateFrom: startPrevPeriod,
          dateTo: endCurrPeriod,
          page,
          key: "E6kUTYrYwZq2tN4QEtyzsbEBk3ie",
        },
      });
      if (page === 1) {
        allOrders.value = response.data.data;
        totalPagesAllOrders.value = response.data.meta.last_page;
      } else {
        allOrders.value.push(...response.data.data);
      }

      if (totalPagesAllOrders.value && totalPagesAllOrders.value > page) {
        await fetchAllOrders(page + 1);
      }
    } catch (err) {
      error.value = "Request error while retrieving all data!";
    } finally {
      loadingAllOrders.value = false;
    }
  };

  const fetchOrders = async (page = 1) => {
    allData.value = resetData;
    orders.value = [];
    error.value = null;
    loadingOrders.value = true;

    try {
      const response = await axios.get<Resp>("/api/orders", {
        params: {
          dateFrom: startPrevPeriod,
          dateTo: endCurrPeriod,
          page,
          key: "E6kUTYrYwZq2tN4QEtyzsbEBk3ie",
          limit: 100,
        },
      });
      allData.value = response.data;
      orders.value = allData.value.data;
      currentPage.value = page;
    } catch (err) {
      error.value = "Request error while retrieving order information!";
    } finally {
      loadingOrders.value = false;
    }
  };

  const filterAllOrders = (field: keyof Order, value: string): void => {
    orders.value = allOrders.value.filter((item) => {
      if (typeof item[field] === "string")
        return item[field].toLowerCase().includes(value.toLowerCase());
      return item[field]?.toString().includes(value.toLowerCase());
    });
  };

  const filterOrdersMetrics = (field: keyof Order, value: string): void => {
    const findIdByFilter = (): number[] | null => {
      const orders = allOrders.value.filter((item) => {
        if (typeof item[field] === "string")
          return item[field].toLowerCase().includes(value.toLowerCase());
        return item[field]?.toString().includes(value.toLowerCase());
      });
      return orders.length ? orders.map((item) => item.nm_id) : null;
    };

    const filteredMetricsById = (metrics: OrderMetrics[]): OrderMetrics[] => {
      const nm_ids = findIdByFilter();
      if (!nm_ids) return [];
      return metrics.filter((item) => nm_ids.includes(item.nm_id));
    };

    filterTotalPriceMatrics.value = filteredMetricsById(
      totalPriceMetrics.value as OrderMetrics[]
    );
    filterDiscPercentMatrics.value = filteredMetricsById(
      discPercentMetrics.value as OrderMetrics[]
    );
    filterSalesMatrics.value = filteredMetricsById(
      salesMetrics.value as OrderMetrics[]
    );
    filterCancelMatrics.value = filteredMetricsById(
      cancelMetrics.value as OrderMetrics[]
    );
  };

  const resetFilter = (): void => goToPage(1);
  const resetMetricsFilter = (): void => {
    filterSelected.value = "";
    filterValue.value = "";
    filterTotalPriceMatrics.value = totalPriceMetrics.value as OrderMetrics[];
    filterDiscPercentMatrics.value = discPercentMetrics.value as OrderMetrics[];
    filterSalesMatrics.value = salesMetrics.value as OrderMetrics[];
    filterCancelMatrics.value = cancelMetrics.value as OrderMetrics[];
  };

  const goToPage = (page: number): void => {
    if (page > 0 && page <= totalPages.value) {
      fetchOrders(page);
    }
  };

  const getPeriod = (start: string, end: string): Order[] =>
    allOrders.value.filter(
      (order) =>
        order.date.slice(0, 10) >= start && order.date.slice(0, 10) <= end
    );

  const getMetrics = (
    field: keyof Order,
    value?: boolean
  ): OrderMetrics[] | null => {
    if (field === "is_cancel")
      return Array.from(allArticles.value).map((nm_id) => {
        const prev = prevPeriod.value.filter(
          (order) => order.nm_id === nm_id && order[field] === value
        ).length;
        const current = currPeriod.value.filter(
          (order) => order.nm_id === nm_id && order[field] === value
        ).length;

        let change = "0%";
        let svg = 0;
        if (value)
          if (current !== 0 && prev === 0) {
            change = "100%";
            svg = 1;
          } else if (current !== 0 && prev === 0) change = "0%";
        if (current === 0 && prev !== 0) {
          change = "-100%";
          svg = -1;
        }
        if (current !== 0 && prev !== 0) {
          if (current > prev) {
            change = Math.round((1 - prev / current) * 100) + "%";
            svg = 1;
          }
          if (current < prev) {
            change = Math.round((current / prev - 1) * 100) + "%";
            svg = -1;
          }
          if (prev === current) {
            change = "0%";
          }
        }
        return { nm_id, prev, current, change, svg };
      });

    if (field === "discount_percent")
      return Array.from(allArticles.value).map((nm_id) => {
        const prevArr = prevPeriod.value.filter(
          (order) => order.nm_id === nm_id
        );
        const prevSumDiscount = prevArr.reduce(
          (acc, order) => acc + order[field],
          0
        );
        const prevCount = prevArr.length;
        const prev =
          prevCount === 0 ? 0 : Math.round(prevSumDiscount / prevCount);

        const currentArr = currPeriod.value.filter(
          (order) => order.nm_id === nm_id
        );
        const currentSumDiscount = currentArr.reduce(
          (acc, order) => acc + order[field],
          0
        );
        const currentCount = currentArr.length;
        const current =
          currentCount === 0
            ? 0
            : Math.round(currentSumDiscount / currentCount);

        let change = "0%";
        let svg = 0;
        if (current === 0 && prev !== 0) {
          change = "-100%";
          svg = -1;
        }
        if (current !== 0 && prev !== 0) {
          if (current > prev) {
            change = Math.round((1 - prev / current) * 100) + "%";
            svg = 1;
          }
          if (current < prev) {
            change = Math.round((current / prev - 1) * 100) + "%";
            svg = -1;
          }
          if (prev === current) {
            change = "0%";
          }
        }
        return { nm_id, prev, current, change, svg };
      });

    if (field === "total_price")
      return Array.from(allArticles.value).map((nm_id) => {
        const prevArr = prevPeriod.value.filter(
          (order) => order.nm_id === nm_id
        );
        const prevSumPrice = prevArr.reduce(
          (acc, order) => acc + parseFloat(order.total_price),
          0
        );
        const prevCount = prevArr.length;
        const prev = prevCount === 0 ? 0 : Math.round(prevSumPrice / prevCount);

        const currentArr = currPeriod.value.filter(
          (order) => order.nm_id === nm_id
        );
        const currentSumPrice = currentArr.reduce(
          (acc, order) => acc + parseFloat(order.total_price),
          0
        );
        const currentCount = currentArr.length;
        const current =
          currentCount === 0 ? 0 : Math.round(currentSumPrice / currentCount);

        let change = "0%";
        let svg = 0;
        if (current === 0 && prev !== 0) {
          change = "-100%";
          svg = -1;
        }
        if (current !== 0 && prev !== 0) {
          if (current > prev) {
            change = Math.round((1 - prev / current) * 100) + "%";
            svg = 1;
          }
          if (current < prev) {
            change = Math.round((current / prev - 1) * 100) + "%";
            svg = -1;
          }
          if (prev === current) {
            change = "0%";
          }
        }
        return { nm_id, prev, current, change, svg };
      });
    return null;
  };

  const sortedMetrics = (
    arrMetrics: OrderMetrics[],
    field: keyof Omit<OrderMetrics, "svg">,
    type: "asc" | "desc"
  ): OrderMetrics[] => {
    if (type === "asc")
      return [...arrMetrics].sort((a, b) => {
        if (field === "change") return parseInt(a[field]) - parseInt(b[field]);
        else return a[field] - b[field];
      });
    else
      return [...arrMetrics].sort((a, b) => {
        if (field === "change") return parseInt(b[field]) - parseInt(a[field]);
        else return b[field] - a[field];
      });
  };

  const getTopMetrics = (
    arrMetrics: OrderMetrics[],
    count: number
  ): OrderMetrics[] => [...arrMetrics].slice(0, count);

  const getSumMetrics = (arrMetrics: OrderMetrics[]): OrderMetricsChart => {
    const sumPrev = arrMetrics.reduce((acc, order) => acc + order.prev, 0);
    const sumCurrent = arrMetrics.reduce(
      (acc, order) => acc + order.current,
      0
    );
    return { sumPrev, sumCurrent };
  };

  const getMeanSumMetrics = (arrMetrics: OrderMetrics[]): OrderMetricsChart => {
    const prev = arrMetrics.reduce((acc, order) => acc + order.prev, 0);
    const prevCount = arrMetrics.length;
    const sumPrev = Math.round(prev / prevCount);

    const current = arrMetrics.reduce((acc, order) => acc + order.current, 0);
    const currentCount = arrMetrics.length;
    const sumCurrent = Math.round(current / currentCount);

    return { sumPrev, sumCurrent };
  };

  watch(
    totalPriceMetrics,
    (newVal) => {
      if (newVal && newVal.length) {
        filterTotalPriceMatrics.value = newVal;
      }
    },
    { immediate: true }
  );

  watch(
    discPercentMetrics,
    (newVal) => {
      if (newVal && newVal.length) {
        filterDiscPercentMatrics.value = newVal;
      }
    },
    { immediate: true }
  );

  watch(
    salesMetrics,
    (newVal) => {
      if (newVal && newVal.length) {
        filterSalesMatrics.value = newVal;
      }
    },
    { immediate: true }
  );

  watch(
    cancelMetrics,
    (newVal) => {
      if (newVal && newVal.length) {
        filterCancelMatrics.value = newVal;
      }
    },
    { immediate: true }
  );

  return {
    allData,
    orders,
    allOrders,
    loadingOrders,
    loadingAllOrders,
    error,
    fetchOrders,
    fetchAllOrders,
    filterAllOrders,
    filterOrdersMetrics,
    resetFilter,
    resetMetricsFilter,
    currentPage,
    totalPages,
    goToPage,
    filterSelected,
    filterValue,
    allArticles,
    salesMetrics,
    sortedDescChangeSalesMetrics,
    topSalesMetrics,
    sumSalesMetrics,
    filterSalesMatrics,
    cancelMetrics,
    sortedDescChangeCancelMetrics,
    topCancelMetrics,
    sumCancelMetrics,
    filterCancelMatrics,
    discPercentMetrics,
    sortedDescChangeDiscPercentMetrics,
    topDiscPercentMetrics,
    sumDiscPercentMetrics,
    filterDiscPercentMatrics,
    totalPriceMetrics,
    sortedDescChangeTotalPriceMetrics,
    topTotalPriceMetrics,
    sumTotalPriceMetrics,
    filterTotalPriceMatrics,
  };
});
