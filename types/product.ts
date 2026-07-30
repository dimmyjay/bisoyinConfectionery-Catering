// types/product.ts


// ===============================
// Product Type
// ===============================

export interface Product {

  id?: string;

  name: string;

  description: string;

  category:
    | "Cakes"
    | "Pastries"
    | "Small Chops"
    | "Drinks"
    | "Desserts"
    | "Special Packages"
    | string;


  price: number;


  image: string;


  images?: string[];


  stock: number;


  featured?: boolean;


  available?: boolean;


  createdAt?: number;


  updatedAt?: number;

}



// ===============================
// Create Product Data
// ===============================

export interface CreateProduct {

  name: string;

  description: string;

  category: string;

  price: number;

  image: string;

  stock: number;

  featured?: boolean;

  available?: boolean;

}



// ===============================
// Update Product Data
// ===============================

export interface UpdateProduct {

  name?: string;

  description?: string;

  category?: string;

  price?: number;

  image?: string;

  images?: string[];

  stock?: number;

  featured?: boolean;

  available?: boolean;

  updatedAt?: number;

}



// ===============================
// Product Category
// ===============================

export interface ProductCategory {

  id: string;

  name: string;

  image?: string;

  description?: string;

}



// ===============================
// Cart Product Item
// ===============================

export interface CartProduct {

  id: string;

  name: string;

  price: number;

  image: string;

  quantity: number;

}