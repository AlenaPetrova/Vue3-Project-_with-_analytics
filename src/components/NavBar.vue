<script setup lang="ts">
import { RouterLink } from "vue-router";

defineProps<{
  paths?: { text: string; path: string }[];
}>();
</script>

<template>
  <nav v-if="paths" class="nav">
    <RouterLink
      v-for="{ text, path } in paths"
      :key="path"
      :to="{ name: path }"
    >
      {{ text }}
    </RouterLink>
  </nav>
</template>

<style scoped lang="scss">
.nav {
  width: 100%;
  height: 60px;
  padding: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 10px;
  background-color: var(--color-black);
  box-shadow: 0 4px 12px 0 var(--color-shadow);

  .active-link {
    color: var(--color-link-active);
  }
}
</style>
