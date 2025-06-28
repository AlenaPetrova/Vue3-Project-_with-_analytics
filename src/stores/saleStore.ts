import { defineStore } from "pinia";
import { computed, ref, type Ref } from "vue";
import type { Sale, Resp } from "@/types";
import axios from "axios";

export const useSaleStore = defineStore("sale", () => {
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
  const sales: Ref<Sale[]> = ref([]);
  const allSales: Ref<Sale[]> = ref([]);
  const loadingSales = ref(false);
  const loadingAllSales = ref(false);
  const error = ref<string | null>(null);

  const currentPage = ref(1);
  const totalPages = computed(() => allData.value.meta.last_page);
  const totalPagesAllSales = ref<number | null>(null);

  const fetchAllSales = async (page = 1) => {
    error.value = null;
    loadingAllSales.value = true;

    try {
      const response = await axios.get<Resp>(
        "http://109.73.206.144:6969/api/sales",
        {
          params: {
            dateFrom: "2025-06-20",
            dateTo: "2025-06-22",
            page,
            key: "E6kUTYrYwZq2tN4QEtyzsbEBk3ie",
          },
        }
      );
      if (page === 1) {
        allSales.value = response.data.data;
        totalPagesAllSales.value = response.data.meta.last_page;
      } else {
        allSales.value.push(...response.data.data);
      }

      if (totalPagesAllSales.value && totalPagesAllSales.value > page) {
        await fetchAllSales(page + 1);
      }
    } catch (err) {
      error.value = "Request error while retrieving all data!";
    } finally {
      loadingAllSales.value = false;
    }
  };

  const fetchSales = async (page = 1) => {
    allData.value = resetData;
    sales.value = [];
    error.value = null;
    loadingSales.value = true;

    try {
      const response = await axios.get<Resp>(
        "http://109.73.206.144:6969/api/sales",
        {
          params: {
            dateFrom: "2025-06-20",
            dateTo: "2025-06-22",
            page,
            key: "E6kUTYrYwZq2tN4QEtyzsbEBk3ie",
            limit: 100,
          },
        }
      );
      allData.value = response.data;
      sales.value = allData.value.data;
      currentPage.value = page;
    } catch (err) {
      error.value = "Request error while retrieving sale information!";
    } finally {
      loadingSales.value = false;
    }
  };

  const filterAllSales = (field: keyof Sale, value: string) => {
    sales.value = allSales.value.filter((item) => {
      if (typeof item[field] === "string") {
        return item[field].toLowerCase() === value.toLowerCase();
      }
      return item[field] === Number(value);
    });
  };

  const goToPage = (page: number) => {
    if (page > 0 && page <= totalPages.value) {
      fetchSales(page);
    }
  };

  return {
    allData,
    sales,
    allSales,
    loadingSales,
    loadingAllSales,
    error,
    fetchSales,
    fetchAllSales,
    filterAllSales,
    currentPage,
    totalPages,
    goToPage,
  };
});
