import { createRouter, createWebHistory } from 'vue-router';

import SalesPage from "../pages/SalesPage.vue";
import OrdersPage from "../pages/OrdersPage.vue";
import IncomePage from "../pages/IncomePage.vue";
import StocksPage from "../pages/StocksPage.vue";

export const routes = [
    { path: '/', redirect: '/sales' },
    { path: '/sales', component: SalesPage },
    { path: '/orders', component: OrdersPage },
    { path: '/incomes', component: IncomePage },
    { path: '/stocks', component: StocksPage },
];

export const router = createRouter({
    history: createWebHistory(),
    routes
});
