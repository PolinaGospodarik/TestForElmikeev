// header
export interface TabItem {
    label: string
    path: string
}

// filters
export interface LocalFilters {
    dateFrom: string;
    dateTo: string;
    timeFrom: string;
    timeTo: string;
    search: string;
}

// table
export interface Column {
    key: string;
    label: string;
}

// Chart
export interface ChartProps<T> {
    data: T[];
    xField: keyof T;
    yField: keyof T;
    title?: string;
    label?: string;
    color?: string;
}

// sales
export interface Sale {
    g_number: string;
    date: string;
    last_change_date: string;
    supplier_article: string;
    tech_size: string;
    barcode: number;
    total_price: string;
    discount_percent: string;
    is_supply: boolean;
    is_realization: boolean;
    promo_code_discount: string | null;
    warehouse_name: string;
    country_name: string;
    oblast_okrug_name: string;
    region_name: string;
    income_id: number;
    sale_id: string;
    odid: string | null;
    spp: string;
    for_pay: string;
    finished_price: string;
    price_with_disc: string;
    nm_id: number;
    subject: string;
    category: string;
    brand: string;
    is_storno: boolean | null;
}
export interface SalesApiResponse {
    data: Sale[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: Meta;
}
export interface FiltersSale {
    dateFrom: string;
    dateTo: string;
    timeFrom: string,
    timeTo: string,
    search: string
}
export interface Meta {
    current_page: number;
    from: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
    path: string;
    per_page: string;
    to: number;
    total: number;
}

// order
export interface Order {
    g_number: string;
    date: string;
    last_change_date: string;
    supplier_article: string;
    tech_size: string;
    barcode: string | number;
    total_price: string | number;
    discount_percent: string | number;
    is_supply: boolean;
    is_realization: boolean;
    promo_code_discount: string | number;
    warehouse_name: string;
    country_name: string;
    oblast_okrug_name: string;
    region_name: string;
    income_id: number;
    sale_id: number;
    odid: number;
    spp: number;
    for_pay: string | number;
    finished_price: string | number;
    price_with_disc: string | number;
    nm_id: number;
    subject: string;
    category: string;
    brand: string;
    cancel_dt: string | null;
}
export interface OrdersApiResponse {
    data: Order[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: Meta;
}
export interface FiltersOrder {
    dateFrom: string;
    dateTo: string;
    timeFrom: string,
    timeTo: string,
    search: string
}

// stocks
export interface Stock {
    date: string;
    last_change_date: string;
    supplier_article: string;
    tech_size: string;
    barcode: number;
    quantity: number;
    is_supply: boolean;
    is_realization: boolean;
    quantity_full: number;
    warehouse_name: string;
    in_way_to_client: number;
    in_way_from_client: number;
    nm_id: number;
    subject: string;
    category: string;
    brand: string;
    sc_code: number;
    price: string;
    discount: string;
}
export interface StocksApiResponse {
    data: Stock[];
    meta: {
        current_page: number;
        last_page: number;
    };
}
export interface FiltersStock {
    dateFrom: string;
    dateTo: string;
    search: string;
}

// incomes
export interface Income {
    income_id: number;
    number: string;
    date: string;
    last_change_date: string;
    supplier_article: string;
    tech_size: string;
    barcode: string | number;
    quantity: number;
    total_price: string;
    date_close: string;
    warehouse_name: string;
    nm_id: number;
}
export interface FiltersIncome {
    dateFrom: string;
    dateTo: string;
    search: string;
}
export interface IncomesApiResponse {
    data: Income[];
    meta: {
        current_page: number;
        last_page: number;
        total: number;
    };
}

