// services/catering.ts

import {
  addData,
  getData,
  updateData,
  listenToData,
} from "@/firebase/database";


// ===============================
// Catering Types
// ===============================

export interface CateringRequest {

  id?: string;

  userId?: string;

  fullName: string;

  email: string;

  phone: string;

  eventType:
    | "Wedding"
    | "Birthday"
    | "Corporate"
    | "Party"
    | "Other";

  eventDate: string;

  guestCount: number;

  location: string;

  menuPreference: string;

  budget?: number;

  message?: string;

  status:
    | "pending"
    | "confirmed"
    | "completed"
    | "cancelled";

  createdAt?: number;

}



// ===============================
// Create Catering Request
// ===============================

export async function createCateringRequest(
  request: CateringRequest
) {

  try {

    const requestId =
      await addData(
        "cateringRequests",
        {
          ...request,

          status: "pending",

          createdAt:
            Date.now(),
        }
      );


    return requestId;


  } catch(error){

    console.error(
      "Create catering request failed:",
      error
    );

    throw error;

  }

}



// ===============================
// Get All Catering Requests
// Admin
// ===============================

export async function getCateringRequests(){

  try {

    const requests =
      await getData(
        "cateringRequests"
      );


    if(!requests){

      return [];

    }


    return Object.entries(requests)
      .map(([id,value])=>({

        id,

        ...(value as CateringRequest)

      }));


  } catch(error){

    console.error(
      "Get catering requests failed:",
      error
    );

    throw error;

  }

}



// ===============================
// Get Single Catering Request
// ===============================

export async function getCateringRequest(
  id:string
){

  try {

    const request =
      await getData(
        `cateringRequests/${id}`
      );


    if(!request){

      return null;

    }


    return {

      id,

      ...request

    };


  } catch(error){

    console.error(
      "Get catering request failed:",
      error
    );

    throw error;

  }

}



// ===============================
// Update Catering Status
// Admin
// ===============================

export async function updateCateringStatus(
  id:string,
  status:CateringRequest["status"]
){

  try {

    await updateData(
      `cateringRequests/${id}`,
      {
        status
      }
    );


  } catch(error){

    console.error(
      "Update catering status failed:",
      error
    );

    throw error;

  }

}



// ===============================
// Real-time Catering Listener
// ===============================

export function subscribeCateringRequests(
  callback:(requests:CateringRequest[])=>void
){

  return listenToData(
    "cateringRequests",
    (data)=>{


      if(!data){

        callback([]);

        return;

      }


      const requests =
        Object.entries(data)
        .map(([id,value])=>({

          id,

          ...(value as CateringRequest)

        }));


      callback(requests);

    }
  );

}