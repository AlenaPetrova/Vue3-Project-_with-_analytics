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

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const props = defineProps<{
  array: any[];
  fieldName: string;
  title: string;
  titleX: string;
  titleY: string;
}>();

const processChartData = (array: any[]) => {
  const unicData = new Map<string, number>();

  array.forEach((item) => {
    const itemValue = item[props.fieldName];
    unicData.set(itemValue, (unicData.get(itemValue) || 0) + 1);
  });

  return {
    unicData,
    labels: Array.from(unicData.keys()),
    datasets: [
      {
        label: props.title,
        data: Array.from(unicData.values()),
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(255, 159, 64, 0.8)",
          "rgba(199, 199, 199, 0.8)",
          "rgba(83, 102, 255, 0.8)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(199, 199, 199, 1)",
          "rgba(83, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
};

const chartData = computed(() => processChartData(props.array));

const maxValueY = computed(() => {
  const { unicData } = chartData.value;
  const values = Array.from(unicData.values());
  if (values.length === 0) return 10;
  return Math.ceil(Math.max(...values) / 10) * 10;
});

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: props.title,
      font: {
        size: 20,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      min: 0,
      max: maxValueY.value,
      title: {
        display: true,
        text: props.titleY,
        font: {
          size: 16,
        },
      },
    },
    x: {
      title: {
        display: true,
        text: props.titleX,
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
