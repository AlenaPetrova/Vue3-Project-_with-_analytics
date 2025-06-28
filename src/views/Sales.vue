<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useSaleStore } from "@/stores/saleStore";
import { storeToRefs } from "pinia";
import Table from "@/components/Table.vue";
import PaginationBar from "@/components/PaginationBar.vue";
import ChartView from "@/components/ChartView.vue";
import Filter from "@/components/Filter.vue";

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
const { fetchSales, fetchAllSales, filterAllSales, goToPage } = saleStore;

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

const selectedCategories = ref(["barcode", "brand"]);
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
        :go-to-page="goToPage"
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
