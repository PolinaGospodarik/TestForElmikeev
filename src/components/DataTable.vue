<script lang="ts" setup>
import { ref, computed, defineProps } from 'vue';
import type { Column } from "../types/types.ts";

const props = defineProps<{
  columns: Column[];
  data: Record<string, any>[];
  rowKey?: string;
}>();

const safeData = computed(() =>
    props.data.map(row =>
        props.columns.reduce((acc, col) => {
          acc[col.key] = row[col.key];
          return acc;
        }, {} as Record<string, any>)
    )
);

const tableWrapper = ref<HTMLDivElement | null>(null);
const isDragging = ref(false);
let startX = 0;
let scrollStart = 0;

const startDrag = (e: MouseEvent | TouchEvent) => {
  if (!tableWrapper.value) return;

  isDragging.value = true;
  const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
  startX = pageX;
  scrollStart = tableWrapper.value.scrollLeft;
};

const onDrag = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value || !tableWrapper.value) return;
  e.preventDefault();

  const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
  tableWrapper.value.scrollLeft = scrollStart - (pageX - startX);
};

const stopDrag = () => {
  isDragging.value = false;
};
</script>

<template>
  <div
      ref="tableWrapper"
      class="overflow-x-auto w-full md:w-4/5 xl:w-3/4 cursor-grab"
      :class="{'cursor-grabbing select-none': isDragging}"
      @mousedown="startDrag"
      @mousemove="onDrag"
      @mouseup="stopDrag"
      @mouseleave="stopDrag"
      @touchstart.prevent="startDrag"
      @touchmove.prevent="onDrag"
      @touchend="stopDrag"
  >
    <table class="min-w-max border-collapse text-sm sm:text-base w-full">
      <thead>
      <tr>
        <th
            v-for="col in columns"
            :key="col.key"
            class="border border-gray-300 px-2 py-1 text-left whitespace-nowrap"
        >
          {{ col.label }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="!safeData.length">
        <td
            :colspan="columns.length"
            class="text-center py-4 border border-gray-300"
        >
          Нет данных
        </td>
      </tr>
      <tr
          v-else
          v-for="row in safeData"
          :key="row[props.rowKey || (columns[0]?.key || 'row')]"
      >
        <td
            v-for="col in columns"
            :key="col.key"
            class="border border-gray-300 px-2 py-1 whitespace-nowrap"
        >
          {{ row[col.key] }}
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
