// types/order.ts


// ===============================
// Order Item Type
// ===============================

export interface OrderItem {

  id: string;

  name: string;

  image?: string;

  price: number;

  quantity: number;

}



// ===============================
// Order Status
// ===============================

export type OrderStatus =

  | "processing"

  | "confirmed"

  | "completed"

  | "cancelled";




// ===============================
// Payment Status
// ===============================

export type PaymentStatus =

  | "pending"

  | "success"

  | "failed";




// ===============================
// Main Order Type
// ===============================

export interface Order {

  id?: string;


  userId: string;


  customerName: string;


  email: string;


  phone: string;


  address: string;


  city?: string;


  state?: string;



  items: OrderItem[];



  total: number;



  paymentReference?: string;



  paymentStatus: PaymentStatus;



  orderStatus: OrderStatus;



  note?: string;



  createdAt?: number;



  updatedAt?: number;

}



// ===============================
// Create Order Data
// ===============================

export interface CreateOrder {


  userId: string;


  customerName: string;


  email: string;


  phone: string;


  address: string;


  city?: string;


  state?: string;



  items: OrderItem[];



  total: number;



  note?: string;

}



// ===============================
// Update Order Data
// ===============================

export interface UpdateOrder {


  orderStatus?: OrderStatus;


  paymentStatus?: PaymentStatus;


  paymentReference?: string;


  updatedAt?: number;

}



// ===============================
// Delivery Information
// ===============================

export interface DeliveryInfo {


  address: string;


  city: string;


  state: string;


  phone: string;

}