<script setup lang="ts">
import { onMounted } from "vue";
import { useOrderStore } from "@/stores/orderStore";
import { storeToRefs } from "pinia";
import Table from "@/components/Table.vue";
import ChartMetrics from "@/components/ChartMetrics.vue";
import Filter from "@/components/Filter.vue";

const orderStore = useOrderStore();
const {
  salesMetrics,
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

const tableColumnsName = [
  { key: "nm_id", label: "Артикул" },
  { key: "prev", label: "Предыдущая неделя" },
  { key: "current", label: "Текущая неделя" },
  { key: "change", label: "Изменение" },
];
const routingColumnName = "nm_id";
const to = { name: "article" };

const chartColumnsame = ["Предыдущая неделя", "Текущая неделя"];

const selectedCategories = [
  { key: "nm_id", label: "Артикул" },
  { key: "category", label: "Категория" },
  { key: "brand", label: "Бренд" },
  { key: "oblast", label: "Регион" },
  { key: "date", label: "Дата (yyyy-mm-dd)" },
];
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

      <Filter
        v-if="!loadingOrders"
        :table-categories="selectedCategories"
        :get-filter-data="filterOrdersMetrics"
        :reset-filter="resetMetricsFilter"
      />

      <h2 v-if="loadingOrders || !salesMetrics.length">
        Загрузка данных для таблицы...
      </h2>
      <h2 v-else-if="error">{{ error }}</h2>
      <Table
        v-else
        :columns="tableColumnsName"
        :rows="salesMetrics"
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
