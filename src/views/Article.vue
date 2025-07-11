<script setup lang="ts">
import { useArticleStore } from "@/stores/articleStore";
import { storeToRefs } from "pinia";
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import Table from "@/components/Table.vue";
import { getPrevPeriod, getCurrPeriod } from "@/composables/useDate";
import { useOrderStore } from "@/stores/orderStore";

const articleStore = useArticleStore();
const { loadingArticles } = storeToRefs(articleStore);
const { getArticle, getArticleMetrics } = articleStore;

const orderStore = useOrderStore();
const { fetchAllOrders } = orderStore;
onMounted(async () => {
  fetchAllOrders();
});

const { params } = useRoute();
const nm_id = computed(() => +params.id);
const article = computed(() => getArticle(nm_id.value, "order"));
const metrics = computed(() => getArticleMetrics(nm_id.value, "order"));

const tableColumnsName = [
  { key: "name", label: "Показатель" },
  { key: "prev", label: `${getPrevPeriod()}` },
  { key: "current", label: `${getCurrPeriod()}` },
  { key: "change", label: "Изменение" },
];
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

        <h3 v-if="loadingArticles || !metrics">
          Загрузка данных о метриках артикула...
        </h3>
        <Table v-else :columns="tableColumnsName" :rows="metrics" show-svg />
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
