<script lang="ts" setup>
import { onMounted } from 'vue';
import { useIncomesStore } from '../stores/incomes';
import DataFilters from '../components/DataFilters.vue';
import DataTable from '../components/DataTable.vue';
import AppPagination from '../components/AppPagination.vue';
import DataChart from "../components/DataChart.vue";

const incomesStore = useIncomesStore();

onMounted(() => {
  incomesStore.fetchIncomes();
});
</script>

<template>
  <div class="lg:container p-5 lg:mx-auto">
    <h1 class="text-black font-bold text-2xl mb-4">Доходы</h1>

    <DataChart
        :data="incomesStore.incomes"
        xField="date"
        yField="quantity"
        title="Количество доходов по дням"
        label="Количество"
        color="#f59e0b"
        class="mb-8"
    />

    <div class="flex flex-col gap-4 sm:flex-row">
      <DataFilters
          :store="incomesStore"
          :showDateFilters="true"
          :showTime="false"
          :showSearch="true"
          :searchField="{ quantity: 'Количество' }"
      />

      <DataTable
          v-if="incomesStore.incomes.length"
          :data="incomesStore.incomes"
          :columns="incomesStore.columns"
      />
      <p v-else>Данные загружаются...</p>
    </div>

    <AppPagination
        :current-page="incomesStore.currentPage"
        :last-page="incomesStore.lastPage"
        @change="incomesStore.changePage"
    />
  </div>
</template>


