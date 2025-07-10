import { defineStore } from "pinia";
import { computed, ref, type Ref } from "vue";
import type { Income, Resp } from "@/types";
import axios from "axios";

export const useIncomeStore = defineStore("income", () => {
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
  const incomes: Ref<Income[]> = ref([]);
  const allIncomes: Ref<Income[]> = ref([]);
  const loadingIncomes = ref(false);
  const loadingAllIncomes = ref(false);
  const error = ref<string | null>(null);

  const currentPage = ref(1);
  const totalPages = computed(() => allData.value.meta.last_page);
  const totalPagesAllIncomes = ref<number | null>(null);

  const fetchAllIncomes = async (page = 1) => {
    error.value = null;
    loadingAllIncomes.value = true;

    try {
      const response = await axios.get<Resp>("/api/incomes", {
        params: {
          dateFrom: "2025-05-20",
          dateTo: "2025-06-22",
          page,
          key: "E6kUTYrYwZq2tN4QEtyzsbEBk3ie",
        },
      });
      if (page === 1) {
        allIncomes.value = response.data.data;
        totalPagesAllIncomes.value = response.data.meta.last_page;
      } else {
        allIncomes.value.push(...response.data.data);
      }

      if (totalPagesAllIncomes.value && totalPagesAllIncomes.value > page) {
        await fetchAllIncomes(page + 1);
      }
    } catch (err) {
      error.value = "Request error while retrieving all data!";
    } finally {
      loadingAllIncomes.value = false;
    }
  };

  const fetchIncomes = async (page = 1) => {
    allData.value = resetData;
    incomes.value = [];
    error.value = null;
    loadingIncomes.value = true;

    try {
      const response = await axios.get<Resp>("/api/incomes", {
        params: {
          dateFrom: "2025-05-20",
          dateTo: "2025-06-22",
          page,
          key: "E6kUTYrYwZq2tN4QEtyzsbEBk3ie",
          limit: 100,
        },
      });
      allData.value = response.data;
      incomes.value = allData.value.data;
      currentPage.value = page;
    } catch (err) {
      error.value = "Request error while retrieving income information!";
    } finally {
      loadingIncomes.value = false;
    }
  };

  const filterAllIncomes = (field: keyof Income, value: string) => {
    incomes.value = allIncomes.value.filter((item) => {
      if (typeof item[field] === "string") {
        return item[field].toLowerCase() === value.toLowerCase();
      }
      return item[field] === Number(value);
    });
  };

  const resetFilter = (): void => goToPage(1);

  const goToPage = (page: number) => {
    if (page > 0 && page <= totalPages.value) {
      fetchIncomes(page);
    }
  };

  return {
    allData,
    incomes,
    allIncomes,
    loadingIncomes,
    loadingAllIncomes,
    error,
    fetchIncomes,
    fetchAllIncomes,
    filterAllIncomes,
    resetFilter,
    currentPage,
    totalPages,
    goToPage,
  };
});
