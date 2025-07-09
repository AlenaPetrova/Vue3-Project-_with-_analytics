<script setup lang="ts">
import { computed } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import type { OrderMetricsChart } from "@/types";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const { obj, periods, title, titleX, titleY } = defineProps<{
  obj: OrderMetricsChart;
  periods: string[];
  title: string;
  titleX: string;
  titleY: string;
}>();

const chartData = computed(() => ({
  labels: periods,
  datasets: [
    {
      label: title,
      data: Object.values(obj),
      backgroundColor: ["rgba(70, 170, 60, 0.8)", "rgba(255, 89, 89, 0.8)"],
      borderColor: ["rgba(70, 170, 60, 1)", "rgba(255, 89, 89, 1)"],
      borderWidth: 1,
    },
  ],
}));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: title,
      font: {
        size: 20,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: titleY,
        font: {
          size: 16,
        },
      },
    },
    x: {
      title: {
        display: true,
        text: titleX,
        font: {
          size: 16,
        },
      },
    },
  },
}));
</script>

<template>
  <div class="chart-container">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped lang="scss">
.chart-container {
  width: 100%;
  height: 500px;
  padding: 1em;
  background-color: var(--color-white);
  border: 1px solid var(--color-black);
  box-shadow: 0 0 10px 1px var(--color-shadow);
}
</style>
