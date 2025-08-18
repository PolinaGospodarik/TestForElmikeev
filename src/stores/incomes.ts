import { defineStore } from 'pinia';
import { ref, reactive, computed } from 'vue';
import axios from 'axios';
import type {Income, FiltersIncome, IncomesApiResponse} from "../types/types.ts";

export const useIncomesStore = defineStore('incomes', () => {
    const incomes = ref<Income[]>([]);
    const rawIncomes = ref<Income[]>([]);
    const currentPage = ref(1);
    const lastPage = ref(1);

    const filters = reactive<FiltersIncome>({
        dateFrom: '2025-08-05',
        dateTo: '2025-08-17',
        search: ''
    });

    const searchKey = ref<keyof Income>('number');
    const API_KEY = 'E6kUTYrYwZq2tN4QEtyzsbEBk3ie';
    const LIMIT = 100;

    const columnsMapping: Partial<Record<keyof Income, string>> = {
        income_id: 'ID дохода',
        number: 'Номер',
        date: 'Дата',
        last_change_date: 'Дата изменения',
        supplier_article: 'Артикул поставщика',
        tech_size: 'Размер',
        barcode: 'Штрихкод',
        quantity: 'Количество',
        total_price: 'Сумма',
        date_close: 'Дата закрытия',
        warehouse_name: 'Склад',
        nm_id: 'NM ID'
    };

    const columns = computed(() => {
        if (!rawIncomes.value.length) return [];
        return Object.keys(rawIncomes.value[0]).map(key => ({
            key,
            label: columnsMapping[key as keyof Income] || key
        }));
    });

    const fetchIncomes = async () => {
        try {
            const params = {
                page: currentPage.value,
                key: API_KEY,
                limit: LIMIT,
                dateFrom: filters.dateFrom,
                dateTo: filters.dateTo
            };

            const response = await axios.get<IncomesApiResponse>(
                'http://109.73.206.144:6969/api/incomes',
                { params }
            );

            rawIncomes.value = response.data.data;
            currentPage.value = response.data.meta.current_page;
            lastPage.value = response.data.meta.last_page;

            applyFilters();
        } catch (error) {
            console.error('Ошибка загрузки доходов:', error);
        }
    };

    const applyFilters = () => {
        let filtered = rawIncomes.value;

        if (filters.search.trim()) {
            const key = searchKey.value;
            filtered = filtered.filter(item =>
                String(item[key] ?? '')
                    .toLowerCase()
                    .includes(filters.search.toLowerCase())
            );
        }

        incomes.value = filtered;
    };

    const applyDateFilters = (dateFilters: { dateFrom: string; dateTo: string }) => {
        filters.dateFrom = dateFilters.dateFrom;
        filters.dateTo = dateFilters.dateTo;
        currentPage.value = 1;
        fetchIncomes();
    };

    const applySearchFilter = (value: string, key?: keyof Income) => {
        filters.search = value;
        if (key) searchKey.value = key;
        applyFilters();
    };

    const changePage = (page: number) => {
        currentPage.value = page;
        fetchIncomes();
    };

    return {
        incomes,
        rawIncomes,
        filters,
        currentPage,
        lastPage,
        columns,
        fetchIncomes,
        applyDateFilters,
        changePage,
        applyFilters,
        applySearchFilter,
        searchKey
    };
});
