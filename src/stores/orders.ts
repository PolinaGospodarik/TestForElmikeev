import { defineStore } from 'pinia';
import { ref, reactive, computed } from 'vue';
import type { Order, FiltersOrder, OrdersApiResponse } from '../types/types';
import axios from 'axios';

export const useOrdersStore = defineStore('orders', () => {
    const orders = ref<Order[]>([]);
    const rawOrders = ref<Order[]>([]);
    const currentPage = ref(1);
    const lastPage = ref(1);

    const filters = reactive<FiltersOrder>({
        dateFrom: '2025-08-08',
        dateTo: '2025-08-17',
        timeFrom: '00:00:00',
        timeTo: '23:59:00',
        search: ''
    });

    const API_KEY = 'E6kUTYrYwZq2tN4QEtyzsbEBk3ie';
    const LIMIT = 50;

    const columnsMapping: Partial<Record<keyof Order, string>> = {
        g_number: 'Номер заказа',
        date: 'Дата',
        last_change_date: 'Дата изменения',
        supplier_article: 'Артикул поставщика',
        tech_size: 'Размер',
        barcode: 'Штрихкод',
        total_price: 'Сумма',
        discount_percent: 'Скидка (%)',
        is_supply: 'Поставка',
        is_realization: 'Реализация',
        promo_code_discount: 'Скидка по промокоду',
        warehouse_name: 'Склад',
        country_name: 'Страна',
        oblast_okrug_name: 'Округ',
        region_name: 'Регион',
        income_id: 'ID поставки',
        sale_id: 'ID продажи',
        odid: 'ODID',
        spp: 'SPP',
        for_pay: 'К оплате',
        finished_price: 'Финальная цена',
        price_with_disc: 'Цена со скидкой',
        nm_id: 'NM ID',
        subject: 'Товар',
        category: 'Категория',
        brand: 'Бренд',
        cancel_dt: 'Отмена'
    };

    const columns = computed(() => {
        if (!rawOrders.value.length) return [];
        return Object.keys(rawOrders.value[0]).map(key => ({
            key,
            label: columnsMapping[key as keyof Order] || key
        }));
    });

    const fetchOrders = async () => {
        try {
            const params = {
                page: currentPage.value,
                key: API_KEY,
                limit: LIMIT,
                dateFrom: filters.dateFrom,
                dateTo: filters.dateTo
            };

            const response = await axios.get<OrdersApiResponse>(
                '/api/orders',
                { params }
            );

            rawOrders.value = response.data.data;
            orders.value = [...rawOrders.value];
            currentPage.value = response.data.meta.current_page;
            lastPage.value = response.data.meta.last_page;

            applyFilters();
        } catch (error) {
            console.error('Ошибка загрузки заказов:', error);
        }
    };

    const applyFilters = (searchField?: keyof Order) => {
        orders.value = rawOrders.value.filter((item:any) => {
            const orderDate = new Date(item.date).getTime();
            const from = new Date(`${filters.dateFrom}T${filters.timeFrom || '00:00:00'}`).getTime();
            const to = new Date(`${filters.dateTo}T${filters.timeTo || '23:59:59'}`).getTime();
            const matchesDate = orderDate >= from && orderDate <= to;

            const matchesSearch = filters.search
                ? searchField
                    ? String(item[searchField] ?? '').toLowerCase().includes(filters.search.toLowerCase())
                    : Object.values(item).some(val =>
                        String(val ?? '').toLowerCase().includes(filters.search!.toLowerCase())
                    )
                : true;

            return matchesDate && matchesSearch;
        });
    };

    const applyDateFilters = (dateFilters: { dateFrom: string; dateTo: string; timeFrom?: string; timeTo?: string }) => {
        filters.dateFrom = dateFilters.dateFrom;
        filters.dateTo = dateFilters.dateTo;
        filters.timeFrom = dateFilters.timeFrom || '00:00:00';
        filters.timeTo = dateFilters.timeTo || '23:59:59';
        currentPage.value = 1;
        fetchOrders();
    };

    const applySearchFilter = (value: string, searchField?: keyof Order) => {
        filters.search = value;
        applyFilters(searchField);
    };

    const changePage = (page: number) => {
        currentPage.value = page;
        fetchOrders();
    };

    return {
        orders,
        rawOrders,
        filters,
        currentPage,
        lastPage,
        columns,
        fetchOrders,
        applyFilters,
        applyDateFilters,
        applySearchFilter,
        changePage
    };
});
