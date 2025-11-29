export interface Category {
  id: number;
  name: string;
  imageUrl?: string | null;
  parentId: number | null;
  parent?: Category;
  children?: Category[];
  _count?: {
    products: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: number;
  name: string;
  contact?: string;
  email?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  cost: number;
  quantity: number;
  imageUrl: string | null;
  categoryId: number;
  category: Category;
  supplierId: number;
  supplier: Supplier;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Slider {
  id: number;
  title: string;
  subtitle: string | null;
  buttonText: string | null;
  buttonLink: string | null;
  imageUrl: string;
  isActive: boolean;
  order: number;
}

export interface PromoBanner {
  id: number;
  title: string;
  subtitle: string | null;
  buttonText: string | null;
  buttonLink: string | null;
  imageUrl: string;
  position: string;
  isActive: boolean;
  order: number;
}

export interface Deal {
  id: number;
  productId: number;
  product: Product;
  discount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Brand {
  id: number;
  name: string;
  logoUrl: string;
  link: string | null;
  isActive: boolean;
  order: number;
}

export interface Feature {
  id: number;
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
  order: number;
}

export interface StoreInfo {
  [key: string]: string;
}

export interface HomepageData {
  sliders: Slider[];
  promoBanners: PromoBanner[];
  deals: Deal[];
  featuredSections: any[];
  brands: Brand[];
  features: Feature[];
  storeInfo: StoreInfo;
  newArrivals: Product[];
  featuredProducts: Product[];
  topProducts: Product[];
  categories: Category[];
}

