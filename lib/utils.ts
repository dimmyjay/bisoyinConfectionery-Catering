// lib/utils.ts


// ===============================
// Format Currency (Naira)
// ===============================

export function formatCurrency(
  amount:number
){

  return new Intl.NumberFormat(
    "en-NG",
    {
      style:"currency",
      currency:"NGN",
      minimumFractionDigits:0,
    }
  ).format(amount);

}




// ===============================
// Generate ID
// ===============================

export function generateId(){

  return (
    Math.random()
      .toString(36)
      .substring(2,10)
    +
    Date.now()
  );

}




// ===============================
// Format Date
// ===============================

export function formatDate(
  date:number | string
){

  return new Intl.DateTimeFormat(
    "en-NG",
    {
      year:"numeric",
      month:"long",
      day:"numeric",
    }
  ).format(
    new Date(date)
  );

}




// ===============================
// Shorten Text
// ===============================

export function truncateText(
  text:string,
  length:number = 100
){

  if(
    text.length <= length
  ){

    return text;

  }


  return (
    text.substring(
      0,
      length
    )
    + "..."
  );

}




// ===============================
// Calculate Cart Total
// ===============================

export function calculateTotal(
  items:{
    price:number;
    quantity:number;
  }[]
){

  return items.reduce(
    (total,item)=>

      total +
      item.price *
      item.quantity,

    0
  );

}




// ===============================
// Validate Email
// ===============================

export function isValidEmail(
  email:string
){

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    .test(email);

}




// ===============================
// Create Slug
// ===============================

export function createSlug(
  text:string
){

  return text
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9]+/g,
      "-"
    );

}




// ===============================
// Delay Function
// ===============================

export function delay(
  ms:number
){

  return new Promise(
    resolve =>
      setTimeout(
        resolve,
        ms
      )
  );

}




// ===============================
// Capitalize Text
// ===============================

export function capitalize(
  text:string
){

  return (
    text.charAt(0)
      .toUpperCase()
    +
    text.slice(1)
  );

}