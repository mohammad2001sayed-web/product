import type { Product } from "@/src/app/(home)/home.interface";

export interface CartItem {
  _id: string;
  count: number;
  price: number;
  product: Product;
}

export interface cartResponse {
  status: string;
  message: string;
  numOfCartItems: number;
  cartId: string;
  data: CartData;
}

export interface CartData {
  products: CartItem[];
  totalCartPrice: number;
  totalAfterDiscount?: number;
  discount?: number;
}

export interface cartDeleteResponse {
  statusMsg: number;
  message: string;
}

export function getTotalCartQuantity(cart: cartResponse | null | undefined): number {
  return cart?.data.products.reduce((total, item) => total + item.count, 0) ?? 0;
}
