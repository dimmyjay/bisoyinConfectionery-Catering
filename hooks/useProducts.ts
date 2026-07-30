// hooks/useProducts.ts

"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Product,
  getProducts,
  subscribeProducts,
} from "@/services/products";



export function useProducts() {


  const [products, setProducts] =
    useState<Product[]>([]);


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState<string | null>(null);





  // Load products once

  const fetchProducts = async () => {

    try {

      setLoading(true);


      const data =
        await getProducts();


      setProducts(
        data
      );


    } catch(error){


      setError(
        error instanceof Error
          ? error.message
          : "Failed to load products"
      );


    } finally {


      setLoading(false);

    }

  };





  // Real-time products listener

  useEffect(() => {


    const unsubscribe =
      subscribeProducts(
        (data)=>{


          setProducts(
            data
          );


          setLoading(
            false
          );


        }

      );



    return () => {

      unsubscribe();

    };


  }, []);





  // Find product by ID

  const getProductById = (
    id:string
  ) => {


    return products.find(
      product =>
        product.id === id
    );


  };





  // Filter by category

  const getProductsByCategory = (
    category:string
  ) => {


    return products.filter(
      product =>
        product.category === category
    );


  };





  // Featured products

  const featuredProducts =
    products.filter(
      product =>
        product.featured === true
    );





  return {


    products,


    loading,


    error,


    fetchProducts,


    getProductById,


    getProductsByCategory,


    featuredProducts,


  };

}