import { defineStore } from 'pinia';
import { ref, reactive, computed } from 'vue';
import type { Sale, FiltersSale, SalesApiResponse } from '../types/types';
import axios from 'axios';

export const useSalesStore = defineStore('sales', () => {
    const sales = ref<Sale[]>([]);
    const rawSales = ref<Sale[]>([]);
    const currentPage = ref(1);
    const lastPage = ref(1);

    const filters = reactive<FiltersSale>({
        dateFrom: '2025-08-08',
        dateTo: '2025-08-17',
        timeFrom: '00:00:00',
        timeTo: '23:59:00',
        search: ''
    });

    const API_KEY = 'E6kUTYrYwZq2tN4QEtyzsbEBk3ie';
    const LIMIT = 50;

    const columnsMapping: Partial<Record<keyof Sale, string>> = {
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
        is_storno: 'Сторно'
    };

    const columns = computed(() => {
        if (!rawSales.value.length) return [];
        return Object.keys(rawSales.value[0]).map(key => ({
            key,
            label: columnsMapping[key as keyof Sale] || key
        }));
    });

    const fetchSales = async () => {
        try {
            const params = {
                page: currentPage.value,
                key: API_KEY,
                limit: LIMIT,
                dateFrom: filters.dateFrom,
                dateTo: filters.dateTo
            };

            const response = await axios.get<SalesApiResponse>(
                '/api/sales',
                { params }
            );

            rawSales.value = response.data.data;
            sales.value = [...rawSales.value];
            currentPage.value = response.data.meta.current_page;
            lastPage.value = response.data.meta.last_page;

            applyFilters();
        } catch (error) {
            console.error('Ошибка загрузки продаж:', error);
        }
    };

    const applyFilters = (searchField?: keyof Sale) => {
        sales.value = rawSales.value.filter(item => {
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
        fetchSales();
    };

    const applySearchFilter = (value: string, searchField?: keyof Sale) => {
        filters.search = value;
        applyFilters(searchField);
    };

    const changePage = (page: number) => {
        currentPage.value = page;
        fetchSales();
    };

    return {
        sales,
        rawSales,
        filters,
        currentPage,
        lastPage,
        columns,
        fetchSales,
        applyFilters,
        applyDateFilters,
        applySearchFilter,
        changePage
    };
});
