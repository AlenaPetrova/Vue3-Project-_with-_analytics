import { defineStore } from "pinia";
import { computed, ref, type Ref } from "vue";
import type { Stock, Resp } from "@/types";
import axios from "axios";
import { getTodayStr } from "@/composables/useDate";

export const useStockStore = defineStore("stock", () => {
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
  const stocks: Ref<Stock[]> = ref([]);
  const allStocks: Ref<Stock[]> = ref([]);
  const loadingStocks = ref(false);
  const loadingAllStocks = ref(false);
  const error = ref<string | null>(null);

  const currentPage = ref(1);
  const totalPages = computed(() => allData.value.meta.last_page);
  const totalPagesAllStocks = ref<number | null>(null);

  const todayStr = getTodayStr();

  const fetchAllStocks = async (page = 1) => {
    error.value = null;
    loadingAllStocks.value = true;

    try {
      const response = await axios.get<Resp>(
        "http://109.73.206.144:6969/api/stocks",
        {
          params: {
            dateFrom: todayStr,
            dateTo: todayStr,
            page,
            key: "E6kUTYrYwZq2tN4QEtyzsbEBk3ie",
          },
        }
      );
      if (page === 1) {
        allStocks.value = response.data.data;
        totalPagesAllStocks.value = response.data.meta.last_page;
      } else {
        allStocks.value.push(...response.data.data);
      }

      if (totalPagesAllStocks.value && totalPagesAllStocks.value > page) {
        await fetchAllStocks(page + 1);
      }
    } catch (err) {
      error.value = "Request error while retrieving all data!";
    } finally {
      loadingAllStocks.value = false;
    }
  };

  const fetchStocks = async (page = 1) => {
    allData.value = resetData;
    stocks.value = [];
    error.value = null;
    loadingStocks.value = true;

    try {
      const response = await axios.get<Resp>(
        "http://109.73.206.144:6969/api/stocks",
        {
          params: {
            dateFrom: todayStr,
            dateTo: todayStr,
            page,
            key: "E6kUTYrYwZq2tN4QEtyzsbEBk3ie",
            limit: 100,
          },
        }
      );
      allData.value = response.data;
      stocks.value = allData.value.data;
      currentPage.value = page;
    } catch (err) {
      error.value = "Request error while retrieving stock information!";
    } finally {
      loadingStocks.value = false;
    }
  };

  const filterAllStocks = (field: keyof Stock, value: string) => {
    stocks.value = allStocks.value.filter((item) => {
      if (typeof item[field] === "string") {
        return item[field].toLowerCase() === value.toLowerCase();
      }
      return item[field] === Number(value);
    });
  };

  const goToPage = (page: number) => {
    if (page > 0 && page <= totalPages.value) {
      fetchStocks(page);
    }
  };

  return {
    allData,
    stocks,
    allStocks,
    loadingStocks,
    loadingAllStocks,
    error,
    fetchStocks,
    fetchAllStocks,
    filterAllStocks,
    currentPage,
    totalPages,
    goToPage,
  };
});
