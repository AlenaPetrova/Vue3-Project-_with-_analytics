<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useSaleStore } from "@/stores/saleStore";
import { storeToRefs } from "pinia";
import Table from "@/components/Table.vue";
import PaginationBar from "@/components/PaginationBar.vue";
import ChartView from "@/components/ChartView.vue";
import Filter from "@/components/Filter.vue";
import { useRoute, useRouter } from "vue-router";
import type { Sale } from "@/types";

const saleStore = useSaleStore();
const {
  sales,
  allSales,
  loadingSales,
  loadingAllSales,
  error,
  currentPage,
  totalPages,
} = storeToRefs(saleStore);
const { fetchSales, fetchAllSales, filterAllSales, goToPage, resetFilter } =
  saleStore;

onMounted(async () => {
  fetchSales(1);
  fetchAllSales();
});

const saleColumns = computed(() => {
  if (sales.value.length === 0) return [];
  return Object.keys(sales.value[0]).map((key) => ({
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
  () => loadingAllSales.value,
  (isLoading) => {
    if (!isLoading && filterSelected.value && filterValue.value) {
      filterAllSales(filterSelected.value as keyof Sale, filterValue.value);
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="container">
    <h1>Sales</h1>

    <h2 v-if="loadingAllSales">Loading data for the chart...</h2>
    <h2 v-else-if="error">{{ error }}</h2>
    <ChartView
      v-else
      :array="allSales"
      field-name="brand"
      title="Sale parameters"
      title-x="Brand name"
      title-y="Number of sales"
    />

    <h2 v-if="loadingSales">Loading data for the table...</h2>
    <h2 v-else-if="error">{{ error }}</h2>
    <div v-else class="wrapper">
      <Filter
        :table-categories="selectedCategories"
        :get-filter-data="filterAllSales"
        :reset-filter="resetFilter"
        v-model:selected="filterSelected"
        v-model:value="filterValue"
      />

      <Table :columns="saleColumns" :rows="sales" />

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
