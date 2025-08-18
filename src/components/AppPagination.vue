<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  currentPage: number;
  lastPage: number;
}>();

const emit = defineEmits<{
  (e: 'change', page: number): void;
}>();

const prevPage = () => {
  if (props.currentPage > 1) emit('change', props.currentPage - 1);
};

const nextPage = () => {
  if (props.currentPage < props.lastPage) emit('change', props.currentPage + 1);
};
</script>

<template>
  <div class="flex gap-3 items-center justify-center mt-4">
    <button
        class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        :disabled="props.currentPage <= 1"
        @click="prevPage"
    >
      Назад
    </button>

    <span>{{ props.currentPage }} / {{ props.lastPage }}</span>

    <button
        class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        :disabled="props.currentPage >= props.lastPage"
        @click="nextPage"
    >
      Вперед
    </button>
  </div>
</template>
