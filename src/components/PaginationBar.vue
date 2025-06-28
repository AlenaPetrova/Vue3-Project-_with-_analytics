<script setup lang="ts">
defineProps<{
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
}>();
</script>

<template>
  <div class="pagination">
    <button :disabled="currentPage === 1" @click="goToPage(1)"><<</button>
    <button :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
      <
    </button>
    <span class="pagination-text"
      >Page {{ currentPage }} of {{ totalPages }}</span
    >
    <button
      :disabled="currentPage === totalPages"
      @click="goToPage(currentPage + 1)"
    >
      >
    </button>
    <button
      :disabled="currentPage === totalPages"
      @click="goToPage(totalPages)"
    >
      >>
    </button>
  </div>
</template>

<style scoped lang="scss">
.pagination {
  display: flex;
  align-items: center;
  gap: 10px;

  &-text {
    font-size: 18px;
  }
}
</style>
