<script setup lang="ts">
import { useArticleStore } from "@/stores/articleStore";
import { storeToRefs } from "pinia";
import { computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Table from "@/components/Table.vue";
import { useOrderStore } from "@/stores/orderStore";
import Filter from "@/components/Filter.vue";
import type { Order } from "@/types";

const articleStore = useArticleStore();
const { loadingArticles, allPeriodByDays } = storeToRefs(articleStore);
const { getArticle, getArticleMetrics, findIdByFilter } = articleStore;

const orderStore = useOrderStore();
const { startCurrPeriod, endCurrPeriod, filterSelected, filterValue, error } =
  storeToRefs(orderStore);
const { fetchAllOrders, resetMetricsFilter } = orderStore;
onMounted(async () => {
  fetchAllOrders();
});

const route = useRoute();
const nm_id = computed(() => +route.params.id);
const article = computed(() => getArticle(nm_id.value, "order"));
const metrics = computed(() => getArticleMetrics(nm_id.value, "order"));

const transformAllPeriod = (): { key: string; label: string }[] => {
  return allPeriodByDays.value.map((str) => ({
    key: str,
    label: str,
  }));
};

const tableColumnsName = computed(() => [
  { key: "name", label: "Показатель" },
  ...transformAllPeriod(),
  { key: "change", label: "Изменение" },
]);

const selectedCategories = [
  { key: "nm_id", label: "Артикул" },
  { key: "category", label: "Категория" },
  { key: "brand", label: "Бренд" },
  { key: "oblast", label: "Регион" },
  { key: "date", label: "Текущий период (yyyy-mm-dd/yyyy-mm-dd)" },
];

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

const filterArticleMetrics = (field: keyof Order, value: string): void => {
  const goToArticle = (id: number): void => {
    router.push({
      name: "article",
      params: { id: id },
      query: {
        ...route.query,
        filterSelected: field,
        filterValue: value,
      },
    });
  };
  if (field === "nm_id") {
    goToArticle(+value);
  }
  if (field === "category" || field === "brand" || field === "oblast") {
    const id = findIdByFilter(field, value);
    if (id) goToArticle(id);
  }
  if (field === "date") {
    startCurrPeriod.value = value.split("/")[0];
    endCurrPeriod.value = value.split("/")[1];
  }
};
</script>

<template>
  <div class="container">
    <h1>Артикул №{{ nm_id }}</h1>

    <div class="wrapper">
      <section class="info">
        <h2>Информация о товаре</h2>

        <h3 v-if="loadingArticles">Загрузка данных артикула...</h3>
        <div class="card" v-else-if="article">
          <h3>{{ article.name }}</h3>
          <img class="card-img" :src="`/${article.img}`" alt="фото товара" />
          <h4>Описание:</h4>
          <div class="card-descriptions">
            <p>Категория: {{ article.category }}</p>
            <p>Бренд: {{ article.brand }}</p>
            <p>Дата начала продаж: {{ article.date }}</p>
            <p>В наличии: {{ article.count }} шт</p>
            <p>Размер: {{ article.size }}</p>
            <p>Цена: от {{ article.price }} рублей</p>
          </div>
        </div>
      </section>

      <section class="info">
        <h2>Таблица метрик товара</h2>

        <h3 v-if="error"></h3>
        <Filter
          v-else-if="!loadingArticles"
          :table-categories="selectedCategories"
          :get-filter-data="filterArticleMetrics"
          :reset-filter="resetMetricsFilter"
          v-model:selected="filterSelected"
          v-model:value="filterValue"
        />

        <h3 v-if="loadingArticles || !metrics">
          Загрузка данных о метриках артикула...
        </h3>
        <Table
          v-else
          :columns="tableColumnsName"
          :rows="metrics"
          show-svg
          :reverse-svg="[3]"
        />
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 10px;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: center;
  border-radius: 4px;
  box-shadow: 0 0 10px 1px var(--color-shadow);
  padding: 1rem;
  background-color: var(--color-white);
  overflow: auto;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &-descriptions {
    display: flex;
    flex-direction: column;
    align-items: start;
    text-align: left;
    gap: 6px;
  }
  &-img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    box-shadow: 0 0 10px 1px var(--color-shadow);
  }
}
</style>
