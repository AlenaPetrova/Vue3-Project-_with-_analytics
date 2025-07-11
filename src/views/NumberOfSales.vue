<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useOrderStore } from "@/stores/orderStore";
import { storeToRefs } from "pinia";
import Table from "@/components/Table.vue";
import ChartMetrics from "@/components/ChartMetrics.vue";
import Filter from "@/components/Filter.vue";
import { getPrevPeriod, getCurrPeriod } from "@/composables/useDate";
import { useRoute, useRouter } from "vue-router";
import type { Order } from "@/types";

const orderStore = useOrderStore();
const {
  filterSalesMatrics,
  sumSalesMetrics,
  loadingOrders,
  loadingAllOrders,
  error,
} = storeToRefs(orderStore);
const { fetchOrders, fetchAllOrders, resetMetricsFilter, filterOrdersMetrics } =
  orderStore;

onMounted(async () => {
  fetchOrders(1);
  fetchAllOrders();
});
onUnmounted(() => {
  filterSalesMatrics.value = [];
});

const tableColumnsName = [
  { key: "nm_id", label: "Артикул" },
  { key: "prev", label: `${getPrevPeriod()}` },
  { key: "current", label: `${getCurrPeriod()}` },
  { key: "change", label: "Изменение" },
];
const routingColumnName = "nm_id";
const to = { name: "article" };

const chartColumnsame = [`${getPrevPeriod()}`, `${getCurrPeriod()}`];

const selectedCategories = [
  { key: "nm_id", label: "Артикул" },
  { key: "category", label: "Категория" },
  { key: "brand", label: "Бренд" },
  { key: "oblast", label: "Регион" },
  { key: "date", label: "Дата (yyyy-mm-dd)" },
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
      filterOrdersMetrics(
        filterSelected.value as keyof Order,
        filterValue.value
      );
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="container">
    <h1>Количество продаж</h1>

    <div class="wrapper">
      <h2 v-if="loadingAllOrders || !Object.keys(sumSalesMetrics).length">
        Загрузка данных для графика...
      </h2>
      <h2 v-else-if="error">{{ error }}</h2>
      <ChartMetrics
        v-else
        :obj="sumSalesMetrics"
        :periods="chartColumnsame"
        title=""
        title-x="Период"
        title-y="Кол-во продаж"
      />

      <h2 v-if="error"></h2>
      <Filter
        v-else-if="!loadingOrders"
        :table-categories="selectedCategories"
        :get-filter-data="filterOrdersMetrics"
        :reset-filter="resetMetricsFilter"
        v-model:selected="filterSelected"
        v-model:value="filterValue"
      />

      <h2 v-if="loadingOrders || !filterSalesMatrics.length">
        Загрузка данных для таблицы...
      </h2>
      <h2 v-else-if="error">{{ error }}</h2>
      <Table
        v-else
        :columns="tableColumnsName"
        :rows="filterSalesMatrics"
        clickable
        :to="to"
        :column-name-with-id="routingColumnName"
        show-svg
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
