// User related types
export interface User {
  _id: string;
  name: string;
  email: string;
  isVerified: boolean;
  isAdmin: boolean;
  shippingAddress?: ShippingAddress;
}

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isVerified: boolean;
  token: string;
}

// Product related types
export interface Product {
  _id: string;
  name: string;
  image: string;
  description: string;
  category: string;
  price: number;
  countInStock: number;
  rating: number;
  numReviews: number;
  material?: string;
  dimensions?: string;
  weight?: string;
  finishOptions?: string[];
  features?: string[];
  createdAt: string;
  reviews: Review[];
}

export interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  user: string;
  createdAt: string;
}

// Cart related types
export interface CartItem {
  product: Product;
  quantity: number;
}

// Order related types
export interface Order {
  _id: string;
  user: string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  isPaid: boolean;
  isDelivered: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface OrderItem {
  product: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  _id: string;
}

export interface PaymentResult {
  id: string;
  status: string;
  update_time: string;
  email_address?: string;
}

export type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    page: number;
    pages: number;
    total: number;
  };
  message?: string;
}

// Form data types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ProductFormData {
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  countInStock: number;
  material?: string;
  dimensions?: string;
  weight?: string;
  finishOptions?: string[];
  features?: string[];
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
