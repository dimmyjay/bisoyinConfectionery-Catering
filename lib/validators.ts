// lib/validators.ts


// ===============================
// Email Validation
// ===============================

export function validateEmail(
  email: string
){

  if(!email){

    return "Email is required";

  }


  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  if(!emailRegex.test(email)){

    return "Enter a valid email address";

  }


  return null;

}




// ===============================
// Password Validation
// ===============================

export function validatePassword(
  password:string
){

  if(!password){

    return "Password is required";

  }


  if(password.length < 6){

    return "Password must be at least 6 characters";

  }


  return null;

}




// ===============================
// Name Validation
// ===============================

export function validateName(
  name:string
){

  if(!name){

    return "Name is required";

  }


  if(name.length < 3){

    return "Name must contain at least 3 characters";

  }


  return null;

}




// ===============================
// Phone Validation
// ===============================

export function validatePhone(
  phone:string
){

  if(!phone){

    return "Phone number is required";

  }


  const phoneRegex =
    /^[0-9+\s()-]{10,15}$/;


  if(!phoneRegex.test(phone)){

    return "Enter a valid phone number";

  }


  return null;

}




// ===============================
// Required Field Validation
// ===============================

export function validateRequired(
  value:string,
  fieldName:string
){

  if(!value || value.trim()===""){

    return `${fieldName} is required`;

  }


  return null;

}




// ===============================
// Product Validation
// ===============================

export function validateProduct(
  product:{
    name:string;
    description:string;
    price:number;
    category:string;
  }
){

  const errors:any = {};



  if(!product.name){

    errors.name =
      "Product name is required";

  }



  if(!product.description){

    errors.description =
      "Product description is required";

  }



  if(!product.category){

    errors.category =
      "Product category is required";

  }



  if(!product.price || product.price <= 0){

    errors.price =
      "Enter a valid product price";

  }



  return Object.keys(errors).length
    ? errors
    : null;

}




// ===============================
// Order Validation
// ===============================

export function validateOrder(
  order:{
    customerName:string;
    phone:string;
    address:string;
    email:string;
  }
){

  const errors:any = {};



  if(!order.customerName){

    errors.customerName =
      "Customer name is required";

  }



  if(!order.phone){

    errors.phone =
      "Phone number is required";

  }



  if(!order.address){

    errors.address =
      "Delivery address is required";

  }



  const emailError =
    validateEmail(
      order.email
    );


  if(emailError){

    errors.email =
      emailError;

  }



  return Object.keys(errors).length
    ? errors
    : null;

}




// ===============================
// Catering Request Validation
// ===============================

export function validateCatering(
  data:{
    fullName:string;
    email:string;
    phone:string;
    eventDate:string;
    location:string;
  }
){

  const errors:any = {};



  if(!data.fullName){

    errors.fullName =
      "Full name is required";

  }



  if(!data.eventDate){

    errors.eventDate =
      "Event date is required";

  }



  if(!data.location){

    errors.location =
      "Event location is required";

  }



  const emailError =
    validateEmail(
      data.email
    );


  if(emailError){

    errors.email =
      emailError;

  }



  const phoneError =
    validatePhone(
      data.phone
    );


  if(phoneError){

    errors.phone =
      phoneError;

  }



  return Object.keys(errors).length
    ? errors
    : null;

}