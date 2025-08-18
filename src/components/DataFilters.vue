<script lang="ts" setup>
import { reactive, defineProps, withDefaults, watch, computed } from 'vue';
import type { LocalFilters } from "../types/types.ts";

const props = withDefaults(
    defineProps<{
      store: any;
      showDateFilters?: boolean;
      showTime?: boolean;
      showSearch?: boolean;
      searchField?: Record<string, string> | null;
    }>(),
    {
      showDateFilters: true,
      showTime: true,
      showSearch: true,
      searchField: null
    }
);

const localFilters = reactive<LocalFilters>({
  dateFrom: props.store.filters.dateFrom,
  dateTo: props.store.filters.dateTo,
  timeFrom: props.store.filters.timeFrom || '00:00:00',
  timeTo: props.store.filters.timeTo || '23:59:59',
  search: props.store.filters.search || ''
});

const searchKey = computed(() => {
  return props.searchField ? Object.keys(props.searchField)[0] : '';
});
const searchLabel = computed(() => {
  return props.searchField ? Object.values(props.searchField)[0] : 'Поиск';
});

watch(
    () => props.store.filters,
    (newFilters) => {
      localFilters.dateFrom = newFilters.dateFrom;
      localFilters.dateTo = newFilters.dateTo;
      localFilters.timeFrom = newFilters.timeFrom || '00:00:00';
      localFilters.timeTo = newFilters.timeTo || '23:59:59';
      localFilters.search = newFilters.search || '';
    },
    { deep: true }
);

const isValidDates = computed(() => {
  if (!localFilters.dateFrom || !localFilters.dateTo) return false;
  return new Date(localFilters.dateFrom) <= new Date(localFilters.dateTo);
});

const applyDates = () => {
  if (!isValidDates.value) {
    alert('Дата начала не может быть позже даты окончания');
    return;
  }
  props.store.applyDateFilters?.({
    dateFrom: localFilters.dateFrom,
    dateTo: localFilters.dateTo,
    timeFrom: props.showTime ? localFilters.timeFrom || '00:00:00' : undefined,
    timeTo: props.showTime ? localFilters.timeTo || '23:59:59' : undefined
  });
};

const applySearch = () => {
  const value = localFilters.search.trimEnd();
  props.store.applySearchFilter?.(value, searchKey.value);
};
</script>

<template>
  <div
      class="flex flex-col gap-4 mb-4 items-start bg-gray-100 p-4 h-fit rounded shadow-sm
           w-full sm:w-2/3 md:w-1/3 xl:w-1/5"
  >
    <div v-if="props.showSearch" class="flex flex-col w-full">
      <label class="text-gray-700 font-medium mb-1">{{ searchLabel }}</label>
      <input
          type="text"
          v-model="localFilters.search"
          @input="applySearch"
          :placeholder="`${searchLabel}`"
          class="w-full border bg-white px-2 py-1 rounded"
      />
    </div>

    <div v-if="props.showDateFilters" class="flex flex-col w-full gap-2">
      <div class="flex flex-col">
        <label class="text-gray-700 font-medium mb-1">С даты</label>
        <input type="date" v-model="localFilters.dateFrom" class="w-full border bg-white px-2 py-1 rounded"/>
        <input
            v-if="props.showTime"
            type="time"
            v-model="localFilters.timeFrom"
            step="1"
            class="w-full border bg-white px-2 py-1 rounded mt-1"
        />
      </div>

      <div class="flex flex-col">
        <label class="text-gray-700 font-medium mb-1">По дату</label>
        <input type="date" v-model="localFilters.dateTo" class="w-full border bg-white px-2 py-1 rounded"/>
        <input
            v-if="props.showTime"
            type="time"
            v-model="localFilters.timeTo"
            step="1"
            class="w-full border bg-white px-2 py-1 rounded mt-1"
        />
      </div>

      <button
          @click="applyDates"
          class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Применить
      </button>
    </div>
  </div>
</template>
