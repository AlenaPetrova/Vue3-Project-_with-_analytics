<script setup lang="ts">
import NavBar from "@/components/NavBar.vue";

const paths = [
  { text: "Incomes", path: "incomes" },
  { text: "Orders", path: "orders" },
  { text: "Sales", path: "sales" },
  { text: "Stocks", path: "stocks" },
];
</script>

<template>
  <NavBar :paths="paths" />
  <RouterView></RouterView>
</template>

<style scoped lang="scss"></style>