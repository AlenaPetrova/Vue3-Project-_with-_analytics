<script setup lang="ts">
defineProps<{
  columns: { key: string; label: string }[];
  rows: Record<string, any>[];
}>();
</script>

<template>
  <div class="table-wrapper">
    <table class="table">
      <thead>
        <tr>
          <th v-for="{ key, label } in columns" :key="key">
            {{ label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in rows" :key="row.id || idx">
          <td v-for="{ key } in columns" :key="key">
            {{ row[key] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.table-wrapper {
  width: 100%;
  max-height: 80vh;
  overflow: auto;
}

.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 4px;
  box-shadow: 0 0 10px 1px var(--color-shadow);

  th,
  td {
    border: 1px solid var(--color-black);
    padding: 10px 20px;
    text-align: left;

    white-space: nowrap;
  }

  th {
    position: sticky;
    top: 0;
    z-index: 2;

    color: var(--color-white);
    background-color: var(--color-black);

    &:first-child {
      border-top-left-radius: 4px;
    }
    &:last-child {
      border-top-right-radius: 4px;
    }
  }

  tr {
    &:nth-child(2n) {
      background-color: var(--color-white);
    }

    &:last-child {
      td:first-child {
        border-bottom-left-radius: 4px;
      }
      td:last-child {
        border-bottom-right-radius: 4px;
      }
    }
  }
}
</style>
