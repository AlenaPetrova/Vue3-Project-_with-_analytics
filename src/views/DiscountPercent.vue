<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from "vue";
import { useOrderStore } from "@/stores/orderStore";
import { storeToRefs } from "pinia";
import Table from "@/components/Table.vue";
import ChartMetrics from "@/components/ChartMetrics.vue";
import Filter from "@/components/Filter.vue";
import { useRoute, useRouter } from "vue-router";
import type { Order } from "@/types";

const orderStore = useOrderStore();
const {
  startPrevPeriod,
  endPrevPeriod,
  startCurrPeriod,
  endCurrPeriod,
  filterSelected,
  filterValue,
  filterDiscPercentMatrics,
  sumDiscPercentMetrics,
  loadingOrders,
  loadingAllOrders,
  error,
  isDateFilterFetching,
} = storeToRefs(orderStore);
const { fetchOrders, fetchAllOrders, resetMetricsFilter, filterOrdersMetrics } =
  orderStore;

onMounted(async () => {
  fetchOrders(1);
  fetchAllOrders();
});
onUnmounted(() => {
  filterDiscPercentMatrics.value = [];
});

const tableColumnsName = computed(() => [
  { key: "nm_id", label: "Артикул" },
  { key: "prev", label: `${startPrevPeriod.value} - ${endPrevPeriod.value}` },
  {
    key: "current",
    label: `${startCurrPeriod.value} - ${endCurrPeriod.value}`,
  },
  { key: "change", label: "Изменение" },
]);
const routingColumnName = "nm_id";
const to = { name: "article" };

const chartColumnsame = computed(() => [
  `${startPrevPeriod.value} - ${endPrevPeriod.value}`,
  `${startCurrPeriod.value} - ${endCurrPeriod.value}`,
]);

const selectedCategories = [
  { key: "nm_id", label: "Артикул" },
  { key: "category", label: "Категория" },
  { key: "brand", label: "Бренд" },
  { key: "oblast", label: "Регион" },
  { key: "date", label: "Текущий период (yyyy-mm-dd/yyyy-mm-dd)" },
];

const route = useRoute();
const router = useRouter();
filterSelected.value =
  route.query.filterSelected?.toString() || filterSelected.value;
filterValue.value = route.query.filterValue?.toString() || filterValue.value;

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
    if (
      !isLoading &&
      filterSelected.value &&
      filterValue.value &&
      !isDateFilterFetching.value
    ) {
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
    <h1>Средний размер скидки</h1>

    <div class="wrapper">
      <h2 v-if="loadingAllOrders || !Object.keys(sumDiscPercentMetrics).length">
        Загрузка данных для графика...
      </h2>
      <h2 v-else-if="error">{{ error }}</h2>
      <ChartMetrics
        v-else
        :obj="sumDiscPercentMetrics"
        :periods="chartColumnsame"
        title=""
        title-x="Период"
        title-y="Средний размер скидки, %"
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

      <h2 v-if="loadingOrders || !filterDiscPercentMatrics.length">
        Загрузка данных для таблицы...
      </h2>
      <h2 v-else-if="error">{{ error }}</h2>
      <Table
        v-else
        :columns="tableColumnsName"
        :rows="filterDiscPercentMatrics"
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
