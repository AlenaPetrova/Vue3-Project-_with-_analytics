import { defineStore } from "pinia";
import { computed, ref, type Ref } from "vue";
import type { Order, Resp } from "@/types";
import axios from "axios";

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

  const fetchAllOrders = async (page = 1) => {
    error.value = null;
    loadingAllOrders.value = true;

    try {
      const response = await axios.get<Resp>(
        "http://109.73.206.144:6969/api/orders",
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
      const response = await axios.get<Resp>(
        "http://109.73.206.144:6969/api/orders",
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
      orders.value = allData.value.data;
      currentPage.value = page;
    } catch (err) {
      error.value = "Request error while retrieving order information!";
    } finally {
      loadingOrders.value = false;
    }
  };

  const filterAllOrders = (field: keyof Order, value: string) => {
    orders.value = allOrders.value.filter((item) => {
      if (typeof item[field] === "string") {
        return item[field].toLowerCase() === value.toLowerCase();
      }
      return item[field] === Number(value);
    });
  };

  const goToPage = (page: number) => {
    if (page > 0 && page <= totalPages.value) {
      fetchOrders(page);
    }
  };

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
    currentPage,
    totalPages,
    goToPage,
  };
});
