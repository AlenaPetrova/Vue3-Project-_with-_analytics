<script setup lang="ts">
const props = defineProps<{
  tableCategories: { key: string; label: string }[];
  getFilterData: (field: any, value: string) => void;
  resetFilter: () => void;
}>();

const selected = defineModel<string>("selected", { default: "" });
const value = defineModel<string>("value", { default: "" });

const filtered = (): void => {
  if (selected.value.trim() && value.value.trim())
    props.getFilterData(selected.value, value.value);
};
const clearFilter = (): void => {
  selected.value = "";
  value.value = "";
  props.resetFilter();
};
</script>

<template>
  <div class="filter-wrapper">
    <select v-model="selected" class="filter-select">
      <option disabled value="">Выберите категорию фильтрации</option>
      <option v-for="{ key, label } in tableCategories" :key="key" :value="key">
        {{ label }}
      </option>
    </select>
    <input
      v-model="value"
      placeholder="Введите значение категории..."
      type="text"
      class="filter-input"
    />
    <button type="button" class="filter-btn" @click="filtered">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="22px"
        viewBox="0 -960 960 960"
        width="22px"
        fill="currentColor"
      >
        <path
          d="M765-144 526-383q-30 22-65.79 34.5-35.79 12.5-76.18 12.5Q284-336 214-406t-70-170q0-100 70-170t170-70q100 0 170 70t70 170.03q0 40.39-12.5 76.18Q599-464 577-434l239 239-51 51ZM384-408q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Z"
        />
      </svg>
    </button>
    <button type="button" class="filter-btn-clear" @click="clearFilter">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="22px"
        viewBox="0 -960 960 960"
        width="22px"
        fill="currentColor"
      >
        <path
          d="m291-240-51-51 189-189-189-189 51-51 189 189 189-189 51 51-189 189 189 189-51 51-189-189-189 189Z"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped lang="scss">
.filter {
  &-wrapper {
    width: 100%;
    display: flex;
  }

  &-select {
    border-radius: 4px 0 0 4px;
    width: 100%;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    transition: border-color 0.25s;
  }

  &-input {
    width: 100%;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    transition: border-color 0.25s;
  }

  &-btn {
    border-radius: 0;

    &-clear {
      border-radius: 0 4px 4px 0;
    }
  }
}
</style>
