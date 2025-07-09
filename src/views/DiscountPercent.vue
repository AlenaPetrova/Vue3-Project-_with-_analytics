<script setup lang="ts">
import { onMounted } from "vue";
import { useOrderStore } from "@/stores/orderStore";
import { storeToRefs } from "pinia";
import Table from "@/components/Table.vue";
import ChartMetrics from "@/components/ChartMetrics.vue";

const orderStore = useOrderStore();
const {
  discPercentMetrics,
  sumDiscPercentMetrics,
  loadingOrders,
  loadingAllOrders,
  error,
} = storeToRefs(orderStore);
const { fetchOrders, fetchAllOrders } = orderStore;

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

      <h2 v-if="loadingOrders || !discPercentMetrics.length">
        Загрузка данных для таблицы...
      </h2>
      <h2 v-else-if="error">{{ error }}</h2>
      <Table
        v-else
        :columns="tableColumnsName"
        :rows="discPercentMetrics"
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
