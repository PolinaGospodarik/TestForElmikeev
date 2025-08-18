<script lang="ts" setup>
import { onMounted } from 'vue';
import { useOrdersStore } from '../stores/orders';
import DataFilters from '../components/DataFilters.vue';
import DataTable from '../components/DataTable.vue';
import AppPagination from '../components/AppPagination.vue';
import DataChart from "../components/DataChart.vue";

const ordersStore = useOrdersStore();

onMounted(() => {
  ordersStore.fetchOrders();
});

</script>

<template>
  <div class="lg:container p-5 lg:mx-auto">
    <h1 class="text-black font-bold text-2xl mb-4">Заказы</h1>

    <DataChart
        :data="ordersStore.orders"
        xField="date"
        yField="total_price"
        title="Выручка по датам"
        label="Сумма заказа"
        color="#10b981"
        class="mb-8"
    />

    <div class="flex flex-col gap-4 sm:flex-row">
      <DataFilters
          :store="ordersStore"
          :showDateFilters="true"
          :showTime="true"
          :showSearch="true"
          :searchField="{ total_price: 'Сумма' }"
      />
      <DataTable
          v-if="ordersStore.orders.length"
          :data="ordersStore.orders"
          :columns="ordersStore.columns"
      />
      <p v-else>Данные загружаются...</p>
    </div>

    <AppPagination
        :current-page="ordersStore.currentPage"
        :last-page="ordersStore.lastPage"
        @change="ordersStore.changePage"
    />
  </div>
</template>

