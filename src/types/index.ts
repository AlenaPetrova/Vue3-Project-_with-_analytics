export interface Income {
  barcode: number;
  date: string;
  date_close: string;
  income_id: number;
  last_change_date: string;
  nm_id: number;
  number: string;
  quantity: number;
  supplier_article: string;
  tech_size: string;
  total_price: string;
  warehouse_name: string;
}

export interface Order {
  barcode: number;
  brand: string;
  cancel_dt: null;
  category: string;
  date: string;
  discount_percent: number;
  g_number: string;
  income_id: number;
  is_cancel: boolean;
  last_change_date: string;
  nm_id: number;
  oblast: string;
  odid: string;
  subject: string;
  supplier_article: string;
  tech_size: string;
  total_price: string;
  warehouse_name: string;
}

export interface Sale {
  barcode: number;
  brand: string;
  category: string;
  country_name: string;
  date: string;
  discount_percent: string;
  finished_price: string;
  for_pay: string;
  g_number: string;
  income_id: number;
  is_realization: boolean;
  is_storno: null;
  is_supply: boolean;
  last_change_date: string;
  nm_id: number;
  oblast_okrug_name: string;
  odid: null;
  price_with_disc: string;
  promo_code_discount: null;
  region_name: string;
  sale_id: string;
  spp: string;
  subject: string;
  supplier_article: string;
  tech_size: string;
  total_price: string;
  warehouse_name: string;
}

export interface Stock {
  barcode: number;
  brand: string;
  category: string;
  date: string;
  discount: string;
  in_way_from_client: number;
  in_way_to_client: number;
  is_realization: boolean;
  is_supply: boolean;
  last_change_date: string;
  nm_id: number;
  price: string;
  quantity: number;
  quantity_full: number;
  sc_code: number;
  subject: string;
  supplier_article: string;
  tech_size: string;
  warehouse_name: string;
}

export interface Resp {
  data: any[];
  links: { first: string; last: string; prev: null; next: null };
  meta: {
    current_page: number;
    from: null;
    last_page: number;
    links: any[];
    path: string;
    per_page: string;
    to: null;
    total: number;
  };
}

export interface OrderMetrics {
  nm_id: number;
  prev: number;
  current: number;
  change: string;
  svg?: number;
}

export interface OrderMetricsChart {
  sumPrev: number;
  sumCurrent: number;
}

export interface Article {
  nm_id: number;
  name: string;
  brand: string;
  category: string;
  img: string;
  date: string;
  size: string;
  count: number;
  price: number;
}

export interface ArticleMetrics {
  name: string;
  change: string;
  svg?: number;
  [key: string]: number | string | undefined;
}
