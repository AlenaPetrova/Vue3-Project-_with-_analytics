<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useStockStore } from "@/stores/stockStore";
import { storeToRefs } from "pinia";
import Table from "@/components/Table.vue";
import PaginationBar from "@/components/PaginationBar.vue";
import ChartView from "@/components/ChartView.vue";
import Filter from "@/components/Filter.vue";
import { useRoute, useRouter } from "vue-router";
import type { Stock } from "@/types";

const stockStore = useStockStore();
const {
  stocks,
  allStocks,
  loadingStocks,
  loadingAllStocks,
  error,
  currentPage,
  totalPages,
} = storeToRefs(stockStore);
const { fetchStocks, fetchAllStocks, filterAllStocks, goToPage, resetFilter } =
  stockStore;

onMounted(async () => {
  fetchStocks(1);
  fetchAllStocks();
});

const stockColumns = computed(() => {
  if (stocks.value.length === 0) return [];
  return Object.keys(stocks.value[0]).map((key) => ({
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
  () => loadingAllStocks.value,
  (isLoading) => {
    if (!isLoading && filterSelected.value && filterValue.value) {
      filterAllStocks(filterSelected.value as keyof Stock, filterValue.value);
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="container">
    <h1>Stocks</h1>

    <h2 v-if="loadingAllStocks">Loading data for the chart...</h2>
    <h2 v-else-if="error">{{ error }}</h2>
    <ChartView
      v-else
      :array="allStocks"
      field-name="brand"
      title="Stock parameters"
      title-x="Brand name"
      title-y="Number of stocks"
    />

    <h2 v-if="loadingStocks">Loading data for the table...</h2>
    <h2 v-else-if="error">{{ error }}</h2>
    <div v-else class="wrapper">
      <Filter
        :table-categories="selectedCategories"
        :get-filter-data="filterAllStocks"
        :reset-filter="resetFilter"
        v-model:selected="filterSelected"
        v-model:value="filterValue"
      />

      <Table :columns="stockColumns" :rows="stocks" />

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
