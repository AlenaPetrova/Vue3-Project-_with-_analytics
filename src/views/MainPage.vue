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
  topSalesMetrics,
  sumSalesMetrics,
  filterSalesMatrics,
  topCancelMetrics,
  sumCancelMetrics,
  filterCancelMatrics,
  topDiscPercentMetrics,
  sumDiscPercentMetrics,
  filterDiscPercentMatrics,
  topTotalPriceMetrics,
  sumTotalPriceMetrics,
  filterTotalPriceMatrics,
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
  filterTotalPriceMatrics.value = [];
  filterDiscPercentMatrics.value = [];
  filterSalesMatrics.value = [];
  filterCancelMatrics.value = [];
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
    <h1>Метрики заказов</h1>

    <div class="wrapper">
      <h2 v-if="error">{{ error }}</h2>
      <Filter
        v-else-if="!loadingOrders"
        :table-categories="selectedCategories"
        :get-filter-data="filterOrdersMetrics"
        :reset-filter="resetMetricsFilter"
        v-model:selected="filterSelected"
        v-model:value="filterValue"
      />

      <ul class="metrics-list">
        <li class="metrics-item">
          <h2
            v-if="loadingAllOrders || !Object.keys(sumTotalPriceMetrics).length"
          >
            Загрузка данных для графика...
          </h2>
          <h2 v-else-if="error"></h2>
          <RouterLink v-else :to="{ name: 'totalprice', query: $route.query }"
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
          <h2 v-else-if="error"></h2>
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
            v-if="
              loadingAllOrders || !Object.keys(sumDiscPercentMetrics).length
            "
          >
            Загрузка данных для графика...
          </h2>
          <h2 v-else-if="error"></h2>
          <RouterLink
            v-else
            :to="{ name: 'discountrcent', query: $route.query }"
          >
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
          <h2 v-else-if="error"></h2>
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
          <h2 v-else-if="error"></h2>
          <RouterLink v-else :to="{ name: 'numofsales', query: $route.query }">
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
          <h2 v-else-if="error"></h2>
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
          <h2 v-else-if="error"></h2>
          <RouterLink v-else :to="{ name: 'numofcancel', query: $route.query }">
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
          <h2 v-else-if="error"></h2>
          <Table
            v-else
            :columns="tableColumnsName"
            :rows="topCancelMetrics"
            clickable
            :to="to"
            :column-name-with-id="routingColumnName"
            show-svg
            reverse-svg
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

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
