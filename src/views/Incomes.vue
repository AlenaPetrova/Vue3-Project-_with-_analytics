<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useIncomeStore } from "@/stores/incomeStore";
import { storeToRefs } from "pinia";
import Table from "@/components/Table.vue";
import PaginationBar from "@/components/PaginationBar.vue";
import ChartView from "@/components/ChartView.vue";
import Filter from "@/components/Filter.vue";
import { useRoute, useRouter } from "vue-router";
import type { Income } from "@/types";

const incomeStore = useIncomeStore();
const {
  incomes,
  allIncomes,
  loadingIncomes,
  loadingAllIncomes,
  error,
  currentPage,
  totalPages,
} = storeToRefs(incomeStore);
const {
  fetchIncomes,
  fetchAllIncomes,
  filterAllIncomes,
  goToPage,
  resetFilter,
} = incomeStore;

onMounted(async () => {
  fetchIncomes(1);
  fetchAllIncomes();
});

const incomeColumns = computed(() => {
  if (incomes.value.length === 0) return [];
  return Object.keys(incomes.value[0]).map((key) => ({
    key,
    label: key,
  }));
});

const selectedCategories = [
  { key: "barcode", label: "Штрихкод" },
  { key: "warehouse_name", label: "Название склада" },
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
  () => loadingAllIncomes.value,
  (isLoading) => {
    if (!isLoading && filterSelected.value && filterValue.value) {
      filterAllIncomes(filterSelected.value as keyof Income, filterValue.value);
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="container">
    <h1>Incomes</h1>

    <h2 v-if="loadingAllIncomes">Loading data for the chart...</h2>
    <h2 v-else-if="error">{{ error }}</h2>
    <ChartView
      v-else
      :array="allIncomes"
      field-name="warehouse_name"
      title="Income parameters"
      title-x="Warehouse name"
      title-y="Number of shipments"
    />

    <h2 v-if="loadingIncomes">Loading data for the table...</h2>
    <h2 v-else-if="error">{{ error }}</h2>
    <div v-else class="wrapper">
      <Filter
        :table-categories="selectedCategories"
        :get-filter-data="filterAllIncomes"
        :reset-filter="resetFilter"
        v-model:selected="filterSelected"
        v-model:value="filterValue"
      />

      <Table :columns="incomeColumns" :rows="incomes" />

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
