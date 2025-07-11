<script setup lang="ts">
import arrow from "@/assets/arrow.svg";
import arrowUpGreen from "@/assets/arrowUpGreen.svg";
import arrowDownRed from "@/assets/arrowDownRed.svg";
import arrowUpRed from "@/assets/arrowUpRed.svg";
import arrowDownGreen from "@/assets/arrowDownGreen.svg";
import { useRoute, useRouter } from "vue-router";

const { to, columnNameWithId } = defineProps<{
  columns: { key: string; label: string }[];
  rows: Record<string, any>[];
  clickable?: boolean;
  to?: { name: string };
  columnNameWithId?: string;
  showSvg?: boolean;
  reverseSvg?: boolean | number[];
}>();

const router = useRouter();
const route = useRoute();

const goToPage = (row: Record<string, string | number>) => {
  if (!to || !columnNameWithId) return;
  router.push({
    ...to,
    params: { id: row[columnNameWithId] },
    query: route.query,
  });
};
</script>

<template>
  <div class="table-wrapper">
    <table class="table">
      <thead>
        <tr>
          <th v-for="{ key, label } in columns" :key="key">
            {{ label }}
          </th>
          <th v-if="showSvg"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, idx) in rows"
          :key="row.id || idx"
          @click="clickable ? goToPage(row) : null"
          :class="{ clickable: clickable }"
        >
          <td v-for="{ key } in columns" :key="key">
            {{ row[key] }}
          </td>

          <td v-if="showSvg">
            <div
              v-if="
                reverseSvg === true ||
                (Array.isArray(reverseSvg) && reverseSvg.includes(idx))
              "
            >
              <img v-if="row.svg === 1" :src="arrowUpRed" alt="arrow up" />
              <img
                v-if="row.svg === -1"
                :src="arrowDownGreen"
                alt="arrow down"
              />
              <img v-if="row.svg === 0" :src="arrow" alt="arrow" />
            </div>
            <div v-else>
              <img v-if="row.svg === 1" :src="arrowUpGreen" alt="arrow up" />
              <img v-if="row.svg === -1" :src="arrowDownRed" alt="arrow down" />
              <img v-if="row.svg === 0" :src="arrow" alt="arrow" />
            </div>
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
    &.clickable {
      transition-duration: var(--transition-duration);
      cursor: pointer;
      &:hover {
        background-color: var(--color-table-hover);
      }
    }

    &:nth-child(n) {
      background-color: var(--color-white);
    }
    &:nth-child(2n) {
      background-color: var(--color-gray);
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
