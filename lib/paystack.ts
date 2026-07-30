// lib/paystack.ts


// Paystack API Configuration

const PAYSTACK_SECRET_KEY =
  process.env.PAYSTACK_SECRET_KEY;



// ===============================
// Initialize Paystack Transaction
// ===============================

export async function initializePaystack(
  email: string,
  amount: number,
  metadata?: Record<string, any>
) {

  try {


    if(!PAYSTACK_SECRET_KEY){

      throw new Error(
        "Paystack secret key is missing"
      );

    }



    const response =
      await fetch(
        "https://api.paystack.co/transaction/initialize",
        {

          method: "POST",

          headers: {

            Authorization:
              `Bearer ${PAYSTACK_SECRET_KEY}`,

            "Content-Type":
              "application/json",

          },


          body: JSON.stringify({

            email,

            // Paystack amount is in kobo

            amount:
              amount * 100,


            metadata,

          }),

        }
      );



    const data =
      await response.json();



    if(!response.ok){

      throw new Error(
        data.message ||
        "Unable to initialize payment"
      );

    }



    return data.data;



  } catch(error){


    console.error(
      "Paystack initialize error:",
      error
    );


    throw error;

  }

}





// ===============================
// Verify Paystack Transaction
// ===============================

export async function verifyPaystackPayment(
  reference: string
) {


  try {


    if(!PAYSTACK_SECRET_KEY){

      throw new Error(
        "Paystack secret key is missing"
      );

    }



    const response =
      await fetch(

        `https://api.paystack.co/transaction/verify/${reference}`,

        {

          method:"GET",

          headers:{

            Authorization:
              `Bearer ${PAYSTACK_SECRET_KEY}`,

          },

        }

      );



    const data =
      await response.json();



    if(!response.ok){

      throw new Error(
        data.message ||
        "Payment verification failed"
      );

    }



    return data.data;



  } catch(error){


    console.error(
      "Paystack verify error:",
      error
    );


    throw error;

  }

}





// ===============================
// Check Payment Success
// ===============================

export function isPaymentSuccessful(
  status:string
){

  return (
    status === "success"
  );

}