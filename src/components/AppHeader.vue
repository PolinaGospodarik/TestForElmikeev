<script setup lang="ts">
import { useRoute } from "vue-router";
import type { TabItem } from "../types/types.ts";

const tabs: TabItem[] = [
  { label: "Доходы", path: "/incomes" },
  { label: "Заказы", path: "/orders" },
  { label: "Продажи", path: "/sales" },
  { label: "Склады", path: "/stocks" },
];

const route = useRoute();

function isActive(path: string): boolean {
  return route.path === path;
}
</script>

<template>
  <nav class="bg-blue-500 py-3">
    <ul
        class="flex gap-3 sm:gap-5 px-2 sm:px-0 overflow-x-auto scrollbar-hide justify-start sm:justify-center"
    >
      <li
          v-for="tab in tabs"
          :key="tab.path"
          :class="[
          'cursor-pointer px-3 sm:px-4 py-2 whitespace-nowrap rounded transition-colors',
          isActive(tab.path)
            ? 'bg-white text-blue-600 font-bold'
            : 'text-white font-medium hover:bg-blue-400'
        ]"
      >
        <RouterLink :to="tab.path">{{ tab.label }}</RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
