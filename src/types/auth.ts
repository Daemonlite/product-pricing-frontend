export interface User {
  uid?: string;
  user_uid?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  full_name?: string;
  email: string;
  phone_number?: string;
  role?: string;
  role_name?: string;
  token?: string;
  password?: string;
  password_changed?: boolean;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
}

export interface Category {
  id: number;
  uid: string;
  name: string;
  description?: string;
  products?: number;
  created_at?: string;
}

export interface Product {
  id: string;
  uid?: string;
  name: string;
  sku: string;
  category: number; 
  cost_price: number;
  selling_price?: number;
  margin?: number;
  stock: number;
  updated_at?: string;
  created_at?: string;
  description?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  resetPassword: (email: string, password: string, confirm_password: string) => Promise<LoginResult>;
  sendOTP: (email: string) => Promise<LoginResult>;
  verifyOTP: (otp: string) => Promise<LoginResult>;
  updatePassword: (password: string, confirm_password: string) => Promise<LoginResult>;
  loading: boolean;
  isAuthenticated: boolean;
}

export interface LoginResult {
  success: boolean;
  error?: string;
  message?: string;
  password_changed?: boolean;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

export interface ShippingItem {
  id: number;
  uid: string;
  created_at: string;
  product: Product;
  quantity: number;
  shipping: number;
  updated_at: string;
  unit_price: string
}

export interface Shipping {
  id: number;
  uid: string;
  name: string;
  arrival_date: string;
  carrier: string;
  created_at: string;
  items: ShippingItem[];
  status: string;
  tracking_number: string;
  updated_at: string;
}

export interface OAuthProvider {
  name: string;
  url: string;
}

export interface Log {
  id: string;
  user: {
    id: number;
    uid: string;
    full_name: string;
  };
  activity: string;
  action_type?: string;
  timestamp: string;
  type?: string;
  message?: string;
  details?: string;
  ip_address?: string;
  description?: string;
}

export interface Notification {
  id: string;
  user: {
    id: number;
    uid: string;
    full_name: string;
  };
  message: string;
  type?: string;
  timestamp: string;
  read?: boolean;
  details?: string;
}

export interface PricingPayload {
  shipping: number;
  shipping_cost: number;
  import_tax: number;
  other_costs: number;
  other_cost_type: string;
}

export interface PricingResult {
  total_cost?: number;
  selling_price?: number;
  margin?: number;
}
