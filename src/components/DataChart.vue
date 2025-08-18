<script setup lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { computed, defineProps } from 'vue'
import type { ChartProps } from "../types/types.ts"

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

const props = defineProps<ChartProps<any>>()

const chartData = computed(() => {
  const grouped: Record<string, number> = {}

  props.data.forEach(item => {
    const xValue = item[props.xField] as unknown as string
    const yValue = parseFloat(item[props.yField] as unknown as string) || 0
    grouped[xValue] = (grouped[xValue] || 0) + yValue
  })

  const sortedDates = Object.keys(grouped).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
  )

  return {
    labels: sortedDates,
    datasets: [
      {
        label: props.label || 'Значение',
        data: sortedDates.map(date => grouped[date]),
        borderColor: props.color || '#3b82f6',
        backgroundColor: props.color
            ? props.color + '33'
            : 'rgba(59, 130, 246, 0.3)',
        fill: true,
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true },
    title: { display: true, text: props.title || '' },
  },
  scales: {
    y: { beginAtZero: true },
    x: { ticks: { maxRotation: 45, minRotation: 0 } },
  },
}))
</script>

<template>
  <div class="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
