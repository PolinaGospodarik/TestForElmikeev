<script lang="ts" setup>
import { onMounted } from 'vue';
import { useSalesStore } from '../stores/sales';
import DataFilters from '../components/DataFilters.vue';
import DataTable from '../components/DataTable.vue';
import AppPagination from '../components/AppPagination.vue';
import DataChart from "../components/DataChart.vue";

const salesStore = useSalesStore();

onMounted(() => {
  salesStore.fetchSales();
});
</script>


<template>
  <div class="lg:container p-5 lg:mx-auto">
    <h1 class="text-black font-bold text-2xl mb-4">Продажи</h1>

    <DataChart
        :data="salesStore.sales"
        xField="date"
        yField="for_pay"
        title="Выручка по датам"
        label="Выручка (к оплате)"
        color="#3b82f6"
        class="mb-8"
    />
    <div class="flex flex-col gap-4 sm:flex-row">
      <DataFilters
          :store="salesStore"
          :showDateFilters="true"
          :showTime="false"
          :showSearch="true"
          :searchField="{ g_number: 'Номер заказа' }"
      />
        <DataTable
            v-if="salesStore.sales.length"
            :data="salesStore.sales"
            :columns="salesStore.columns"
        />
        <p v-else>Данные загружаются...</p>
    </div>

    <AppPagination
        :current-page="salesStore.currentPage"
        :last-page="salesStore.lastPage"
        @change="salesStore.changePage"
    />
  </div>
</template>

