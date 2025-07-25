<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useOrderStore } from "@/stores/orderStore";
import { storeToRefs } from "pinia";
import Table from "@/components/Table.vue";
import PaginationBar from "@/components/PaginationBar.vue";
import ChartView from "@/components/ChartView.vue";
import Filter from "@/components/Filter.vue";
import { useRoute, useRouter } from "vue-router";
import type { Order } from "@/types";

const orderStore = useOrderStore();
const {
  orders,
  allOrders,
  loadingOrders,
  loadingAllOrders,
  error,
  currentPage,
  totalPages,
} = storeToRefs(orderStore);
const { fetchOrders, fetchAllOrders, filterAllOrders, goToPage, resetFilter } =
  orderStore;

onMounted(async () => {
  fetchOrders(1);
  fetchAllOrders();
});

const orderColumns = computed(() => {
  if (orders.value.length === 0) return [];
  return Object.keys(orders.value[0]).map((key) => ({
    key,
    label: key,
  }));
});

const selectedCategories = [
  { key: "barcode", label: "Штрихкод" },
  { key: "brand", label: "Бренд" },
];

const route = useRoute();
const router = useRouter();
const filterSelected = ref(route.query.filterSelected?.toString() || "");
const filterValue = ref(route.query.filterValue?.toString() || "");

watch([filterSelected, filterValue], ([newSelected, newValue]) => {
  if (!newSelected && !newValue) {
    const { filterSelected, filterValue, ...rest } = route.query;
    router.replace({ query: rest });
  } else
    router.replace({
      query: {
        ...route.query,
        filterSelected: newSelected,
        filterValue: newValue,
      },
    });
});

watch(
  () => loadingAllOrders.value,
  (isLoading) => {
    if (!isLoading && filterSelected.value && filterValue.value) {
      filterAllOrders(filterSelected.value as keyof Order, filterValue.value);
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="container">
    <h1>Orders</h1>

    <h2 v-if="loadingAllOrders">Loading data for the chart...</h2>
    <h2 v-else-if="error">{{ error }}</h2>
    <ChartView
      v-else
      :array="allOrders"
      field-name="brand"
      title="Order parameters"
      title-x="Brand name"
      title-y="Number of orders"
    />

    <h2 v-if="loadingOrders">Loading data for the table...</h2>
    <h2 v-else-if="error">{{ error }}</h2>
    <div v-else class="wrapper">
      <Filter
        :table-categories="selectedCategories"
        :get-filter-data="filterAllOrders"
        :reset-filter="resetFilter"
        v-model:selected="filterSelected"
        v-model:value="filterValue"
      />

      <Table :columns="orderColumns" :rows="orders" />

      <div class="paging-place">
        <PaginationBar
          :current-page="currentPage"
          :total-pages="totalPages"
          :go-to-page="goToPage"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.paging-place {
  display: flex;
  justify-content: center;
}
</style>
