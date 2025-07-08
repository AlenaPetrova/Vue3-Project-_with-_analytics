<script setup lang="ts"></script>

<template>
  <div class="container">
    <h1>Метрики заказов</h1>

    <ul class="metrics-list">
      <li class="metrics-item"><h2>Цена продажи</h2></li>
      <li class="metrics-item"><h2>Размер скидки</h2></li>
      <li class="metrics-item"><h2>Кол-во продаж</h2></li>
      <li class="metrics-item"><h2>Кол-во отмен</h2></li>
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
  }
}
</style>
