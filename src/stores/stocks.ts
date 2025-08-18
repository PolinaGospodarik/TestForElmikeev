import { defineStore } from 'pinia';
import { ref, reactive, computed } from 'vue';
import axios from 'axios';
import type {Stock, StocksApiResponse, FiltersStock} from "../types/types.ts";


export const useStocksStore = defineStore('stocks', () => {
    const stocks = ref<Stock[]>([]);
    const rawStocks = ref<Stock[]>([]);
    const currentPage = ref(1);
    const lastPage = ref(1);

    const filters = reactive<FiltersStock>({
        dateFrom: new Date().toISOString().split('T')[0],
        dateTo: new Date().toISOString().split('T')[0],
        search: ''
    });

    const API_KEY = 'E6kUTYrYwZq2tN4QEtyzsbEBk3ie';
    const LIMIT = 100;

    const columnsMapping: Partial<Record<keyof Stock, string>> = {
        date: 'Дата',
        last_change_date: 'Дата изменения',
        supplier_article: 'Артикул поставщика',
        tech_size: 'Размер',
        barcode: 'Штрихкод',
        quantity: 'Количество',
        quantity_full: 'Полное количество',
        warehouse_name: 'Склад',
        in_way_to_client: 'В пути к клиенту',
        in_way_from_client: 'В пути от клиента',
        nm_id: 'NM ID',
        subject: 'Товар',
        category: 'Категория',
        brand: 'Бренд',
        sc_code: 'SC код',
        price: 'Цена',
        discount: 'Скидка',
    };

    const columns = computed(() => {
        const first = rawStocks.value[0] || {};
        return Object.keys(first).map(key => ({
            key,
            label: columnsMapping[key as keyof Stock] || key
        }));
    });

    const fetchStocks = async () => {
        try {
            const params = {
                page: currentPage.value,
                key: API_KEY,
                limit: LIMIT,
                dateFrom: filters.dateFrom,
                dateTo: filters.dateTo
            };

            const response = await axios.get<StocksApiResponse>(
                '/api/stocks',
                { params }
            );

            rawStocks.value = response.data.data.map(item => ({
                ...item,
                last_change_date: item.last_change_date || '',
                quantity_full: item.quantity_full ?? 0
            }));

            currentPage.value = response.data.meta.current_page;
            lastPage.value = response.data.meta.last_page;

            applyFilters();
        } catch (error) {
            console.error('Ошибка загрузки складских данных:', error);
        }
    };

    const applyFilters = () => {
        let filtered = rawStocks.value;

        if (filters.search.trim()) {
            const key = searchKey.value;
            filtered = filtered.filter(item =>
                String(item[key as keyof Stock]).toLowerCase().includes(filters.search.toLowerCase())
            );
        }
        stocks.value = filtered;
    };

    const applyDateFilters = (dateFilters: { dateFrom: string; dateTo: string }) => {
        filters.dateFrom = dateFilters.dateFrom;
        filters.dateTo = dateFilters.dateTo;
        currentPage.value = 1;
        fetchStocks();
    };

    const searchKey = ref<keyof Stock>('supplier_article');

    const applySearchFilter = (value: string, key?: keyof Stock) => {
        filters.search = value;
        if (key) searchKey.value = key;
        applyFilters();
    };

    const changePage = (page: number) => {
        currentPage.value = page;
        fetchStocks();
    };

    return {
        stocks,
        rawStocks,
        filters,
        currentPage,
        lastPage,
        columns,
        fetchStocks,
        applyDateFilters,
        changePage,
        applyFilters,
        searchKey,
        applySearchFilter
    };
});
