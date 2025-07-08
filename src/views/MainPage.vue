<script setup lang="ts"></script>

<template>
  <div class="wrapper">
    <h1>Метрики заказов</h1>

    <div class="indicator"><h2>Цена продажи</h2></div>
    <div class="indicator"><h2>Размер скидки</h2></div>
    <div class="indicator"><h2>Кол-во продаж</h2></div>
    <div class="indicator"><h2>Кол-во отмен</h2></div>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  padding: 2rem;
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  max-width: 100vw;
}

.indicator {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 50vw;
}
</style>
