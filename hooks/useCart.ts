// hooks/useCart.ts

"use client";

import { useEffect, useState } from "react";



export interface CartItem {

  id: string;

  name: string;

  price: number;

  image: string;

  quantity: number;

}



export function useCart() {


  const [cartItems, setCartItems] =
    useState<CartItem[]>([]);



  // Load cart from browser storage

  useEffect(() => {

    const savedCart =
      localStorage.getItem(
        "bisoyin-cart"
      );


    if(savedCart){

      setCartItems(
        JSON.parse(savedCart)
      );

    }

  }, []);



  // Save cart whenever it changes

  useEffect(() => {

    localStorage.setItem(
      "bisoyin-cart",
      JSON.stringify(cartItems)
    );


  }, [cartItems]);





  // Add product to cart

  const addToCart = (
    product: CartItem
  ) => {


    setCartItems(
      (currentCart)=>{


        const existing =
          currentCart.find(
            item =>
              item.id === product.id
          );


        if(existing){

          return currentCart.map(
            item =>
              item.id === product.id

              ? {

                  ...item,

                  quantity:
                    item.quantity + 1,

                }

              : item

          );

        }



        return [

          ...currentCart,

          {

            ...product,

            quantity:1,

          }

        ];

      }
    );

  };





  // Remove product completely

  const removeFromCart = (
    id:string
  ) => {


    setCartItems(
      currentCart =>
        currentCart.filter(
          item =>
            item.id !== id
        )
    );

  };





  // Increase quantity

  const increaseQuantity = (
    id:string
  ) => {


    setCartItems(
      currentCart =>

        currentCart.map(
          item =>

          item.id === id

          ? {

              ...item,

              quantity:
                item.quantity + 1,

            }

          : item

        )

    );

  };





  // Decrease quantity

  const decreaseQuantity = (
    id:string
  ) => {


    setCartItems(
      currentCart =>

        currentCart.map(
          item =>

          item.id === id &&
          item.quantity > 1

          ? {

              ...item,

              quantity:
                item.quantity - 1,

            }

          : item

        )

    );

  };





  // Clear cart after successful payment

  const clearCart = () => {

    setCartItems([]);

    localStorage.removeItem(
      "bisoyin-cart"
    );

  };





  // Calculate subtotal

  const subtotal =
    cartItems.reduce(
      (total,item)=>

        total +
        item.price *
        item.quantity,

      0

    );



  // Total quantity

  const cartCount =
    cartItems.reduce(
      (total,item)=>

        total +
        item.quantity,

      0

    );





  return {

    cartItems,

    addToCart,

    removeFromCart,

    increaseQuantity,

    decreaseQuantity,

    clearCart,

    subtotal,

    cartCount,

  };

}