<script setup lang="ts">
import { onMounted } from "vue";
import { useOrderStore } from "@/stores/orderStore";
import { storeToRefs } from "pinia";
import Table from "@/components/Table.vue";
import ChartMetrics from "@/components/ChartMetrics.vue";

const orderStore = useOrderStore();
const {
  topSalesMetrics,
  sumSalesMetrics,
  topCancelMetrics,
  sumCancelMetrics,
  topDiscPercentMetrics,
  sumDiscPercentMetrics,
  topTotalPriceMetrics,
  sumTotalPriceMetrics,
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
    <h1>Метрики заказов</h1>

    <ul class="metrics-list">
      <li class="metrics-item">
        <h2
          v-if="loadingAllOrders || !Object.keys(sumTotalPriceMetrics).length"
        >
          Загрузка данных для графика...
        </h2>
        <h2 v-else-if="error">{{ error }}</h2>
        <RouterLink v-else :to="{ name: 'totalprice' }"
          ><ChartMetrics
            :obj="sumTotalPriceMetrics"
            :periods="chartColumnsame"
            title="Средняя цена продаж"
            title-x="Период"
            title-y="Средняя цена"
        /></RouterLink>

        <h2 v-if="loadingOrders || !topTotalPriceMetrics.length">
          Загрузка данных для таблицы...
        </h2>
        <h2 v-else-if="error">{{ error }}</h2>
        <Table
          v-else
          :columns="tableColumnsName"
          :rows="topTotalPriceMetrics"
          clickable
          :to="to"
          :column-name-with-id="routingColumnName"
          show-svg
        />
      </li>
      <li class="metrics-item">
        <h2
          v-if="loadingAllOrders || !Object.keys(sumDiscPercentMetrics).length"
        >
          Загрузка данных для графика...
        </h2>
        <h2 v-else-if="error">{{ error }}</h2>
        <RouterLink v-else :to="{ name: 'discountrcent' }">
          <ChartMetrics
            :obj="sumDiscPercentMetrics"
            :periods="chartColumnsame"
            title="Средний размер скидки"
            title-x="Период"
            title-y="Средний размер скидки, %"
          />
        </RouterLink>

        <h2 v-if="loadingOrders || !topDiscPercentMetrics.length">
          Загрузка данных для таблицы...
        </h2>
        <h2 v-else-if="error">{{ error }}</h2>
        <Table
          v-else
          :columns="tableColumnsName"
          :rows="topDiscPercentMetrics"
          clickable
          :to="to"
          :column-name-with-id="routingColumnName"
          show-svg
        />
      </li>
      <li class="metrics-item">
        <h2 v-if="loadingAllOrders || !Object.keys(sumSalesMetrics).length">
          Загрузка данных для графика...
        </h2>
        <h2 v-else-if="error">{{ error }}</h2>
        <RouterLink v-else :to="{ name: 'numofsales' }">
          <ChartMetrics
            :obj="sumSalesMetrics"
            :periods="chartColumnsame"
            title="Кол-во продаж"
            title-x="Период"
            title-y="Кол-во продаж"
          />
        </RouterLink>

        <h2 v-if="loadingOrders || !topSalesMetrics.length">
          Загрузка данных для таблицы...
        </h2>
        <h2 v-else-if="error">{{ error }}</h2>
        <Table
          v-else
          :columns="tableColumnsName"
          :rows="topSalesMetrics"
          clickable
          :to="to"
          :column-name-with-id="routingColumnName"
          show-svg
        />
      </li>
      <li class="metrics-item">
        <h2 v-if="loadingAllOrders || !Object.keys(sumCancelMetrics).length">
          Загрузка данных для графика...
        </h2>
        <h2 v-else-if="error">{{ error }}</h2>
        <RouterLink v-else :to="{ name: 'numofcancel' }">
          <ChartMetrics
            :obj="sumCancelMetrics"
            :periods="chartColumnsame"
            title="Кол-во отмен"
            title-x="Период"
            title-y="Кол-во отмен"
          />
        </RouterLink>

        <h2 v-if="loadingOrders || !topCancelMetrics.length">
          Загрузка данных для таблицы...
        </h2>
        <h2 v-else-if="error">{{ error }}</h2>
        <Table
          v-else
          :columns="tableColumnsName"
          :rows="topCancelMetrics"
          clickable
          :to="to"
          :column-name-with-id="routingColumnName"
          show-svg
        />
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.metrics {
  &-list {
    text-align: center;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  &-item {
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: auto;
  }
}
</style>
