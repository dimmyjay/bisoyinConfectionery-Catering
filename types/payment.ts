// types/payment.ts


// ===============================
// Payment Status
// ===============================

export type PaymentStatus =

  | "pending"

  | "success"

  | "failed";




// ===============================
// Payment Provider
// ===============================

export type PaymentProvider =

  | "paystack";




// ===============================
// Initialize Payment Data
// ===============================

export interface InitializePayment {


  email: string;


  amount: number;


  orderId: string;


  metadata?: {

    customerName?: string;

    phone?: string;

    items?: any[];

  };

}



// ===============================
// Paystack Initialize Response
// ===============================

export interface PaystackInitializeResponse {


  status: boolean;


  message: string;


  data?: {

    authorization_url: string;


    access_code: string;


    reference: string;

  };

}



// ===============================
// Paystack Verification Response
// ===============================

export interface PaystackVerifyResponse {


  status: boolean;


  message: string;


  data?: {


    id: number;


    status: string;


    reference: string;


    amount: number;


    currency: string;


    customer: {

      email: string;

    };


  };

}



// ===============================
// Payment Record
// ===============================

export interface Payment {


  id?: string;


  userId: string;


  orderId: string;


  reference: string;


  amount: number;


  currency: string;


  provider: PaymentProvider;


  status: PaymentStatus;


  createdAt?: number;


  updatedAt?: number;

}



// ===============================
// Payment Update
// ===============================

export interface UpdatePayment {


  status: PaymentStatus;


  reference?: string;


  updatedAt?: number;

}