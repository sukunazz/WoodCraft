// User related types
export interface User {
  _id: string;
  id?: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  isVerified: boolean;
  isAdmin: boolean;
  avatarUrl?: string;
  shippingAddress?: ShippingAddress;
  createdAt?: string;
  updatedAt?: string;
}


export interface ShippingAddress {
  _id?: string;
  id?: string;
  address?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  zipCode?: string;
  country?: string;
  fullName?: string;
  phone?: string;
}

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isVerified: boolean;
  avatarUrl?: string;
}

export interface LoginActivityEntry {
  timestamp: string;
  ip?: string;
  userAgent?: string;
  status: "success" | "failed";
}

// Product related types
export interface ProductDimensions {
  length?: number;
  width?: number;
  height?: number;
  unit?: string;
}

export interface Product {
  _id: string;
  id?: string;
  name: string;
  image?: string;
  images?: string[];
  imageUrl?: string;
  description: string;
  category: string;
  price: number;
  countInStock?: number;
  inStock?: number;
  stock?: number;
  rating?: number;
  ratings?: Review[];
  averageRating?: number;
  numReviews?: number;
  material?: string;
  dimensions?: string | ProductDimensions;
  weight?: string | number;
  finishOptions?: string[];
  features?: string[];
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  reviews?: Review[];
  freeShipping?: boolean;
  salePrice?: number;
}

export interface Review {
  _id?: string;
  id?: string;
  name?: string;
  userName?: string;
  title?: string;
  rating: number;
  comment: string;
  user: string;
  createdAt?: string;
  date?: string;
}

// Cart related types
export interface CartItem {
  id?: string;
  productId?: string;
  product: Product;
  quantity: number;
}

// Order related types
export interface Order {
  _id: string;
  orderNumber?: string;
  user?: User | { _id?: string; name?: string; email?: string; phone?: string };
  orderItems: OrderItem[];
  shippingAddress?: ShippingAddress;
  paymentMethod?: string;
  paymentResult?: PaymentResult;
  taxAmount?: number;
  taxPrice?: number;
  shippingAmount?: number;
  shippingPrice?: number;
  itemsPrice?: number;
  totalAmount?: number;
  totalPrice?: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  status?: string;
  customerEmail?: string;
  customerPhone?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  notes?: string;
}

export interface OrderItem {
  product: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  _id: string;
  variant?: string;
}

export interface PaymentResult {
  id: string;
  status: string;
  update_time: string;
  email_address?: string;
}

export type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";

// API Response types
export type ApiResponse<T> =
  | {
      success: true;
      data?: T;
      message?: string;
    }
  | {
      success: false;
      error: string;
      message?: string;
      data?: T;
      keepExistingItems?: boolean;
    };

export type PaginatedResponse<T> =
  | {
      success: true;
      data: {
        items: T[];
        page: number;
        pages: number;
        total: number;
      };
      message?: string;
    }
  | {
      success: false;
      error: string;
      message?: string;
      data?: {
        items: T[];
        page: number;
        pages: number;
        total: number;
      };
    };

// Form data types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  password: string;
  confirmPassword: string;
}

export interface ProductFormData {
  name: string;
  price: number;
  image?: string;
  images?: string[];
  category: string;
  description: string;
  countInStock?: number;
  inStock?: number;
  stock?: number;
  rating?: number;
  featured?: boolean;
  material?: string;
  dimensions?: string | ProductDimensions;
  weight?: string | number;
  finishOptions?: string[];
  features?: string[];
  freeShipping?: boolean;
  salePrice?: number;
}

export interface ReviewFormData {
  rating: number;
  comment: string;
}

export interface CheckoutFormData {
  onSubmit: (address: ShippingAddress) => void;

  shippingAddress: ShippingAddress;
  paymentMethod: string;
}
