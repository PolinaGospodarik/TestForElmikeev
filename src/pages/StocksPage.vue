<script lang="ts" setup>
import { onMounted } from 'vue';
import { useStocksStore } from '../stores/stocks';
import DataFilters from '../components/DataFilters.vue';
import DataTable from '../components/DataTable.vue';
import AppPagination from '../components/AppPagination.vue';
import DataChart from "../components/DataChart.vue";

const stocksStore = useStocksStore();

onMounted(() => {
  stocksStore.fetchStocks();
});
</script>

<template>
  <div class="lg:container p-5 lg:mx-auto">
    <h1 class="text-black font-bold text-2xl mb-4">Складские данные</h1>

    <DataChart
        :data="stocksStore.stocks"
        xField="warehouse_name"
        yField="quantity_full"
        title="Количество товаров на складах"
        label="Полное количество"
        color="#FB607F"
        class="mb-8"
    />

    <div class="flex flex-col gap-4 sm:flex-row">
      <DataFilters
          :store="stocksStore"
          :showDateFilters="true"
          :showTime="false"
          :searchField="{ quantity_full: 'Полное количество' }"
      />

      <DataTable
          v-if="stocksStore.stocks.length"
          :data="stocksStore.stocks"
          :columns="stocksStore.columns"
      />
      <p v-else>Данные загружаются...</p>
    </div>

    <AppPagination
        :current-page="stocksStore.currentPage"
        :last-page="stocksStore.lastPage"
        @change="stocksStore.changePage"
    />
  </div>
</template>
