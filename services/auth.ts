// services/auth.ts

import {
  registerUser,
  loginUser,
  logoutUser,
  resetPassword,
  authListener,
} from "@/firebase/auth";

import {
  set,
  ref,
  get,
} from "firebase/database";

import { database } from "@/firebase/config";


// ===============================
// Register Customer
// ===============================

export async function signUpService(
  name: string,
  email: string,
  password: string
) {
  try {

    const user = await registerUser(
      email,
      password,
      name
    );


    // Save user profile in Realtime Database

    await set(
      ref(
        database,
        `users/${user.uid}`
      ),
      {
        uid: user.uid,
        name,
        email,
        role: "customer",
        createdAt: Date.now(),
      }
    );


    return user;


  } catch (error) {

    console.error(
      "Signup error:",
      error
    );

    throw error;
  }
}



// ===============================
// Login Customer
// ===============================

export async function signInService(
  email: string,
  password: string
) {

  try {

    const user = await loginUser(
      email,
      password
    );


    return user;


  } catch(error){

    console.error(
      "Login error:",
      error
    );

    throw error;
  }

}



// ===============================
// Logout
// ===============================

export async function signOutService(){

  try {

    await logoutUser();

  } catch(error){

    console.error(
      "Logout error:",
      error
    );

    throw error;
  }

}



// ===============================
// Forgot Password
// ===============================

export async function forgotPasswordService(
  email:string
){

  try{

    await resetPassword(
      email
    );


  }catch(error){

    console.error(
      "Password reset error:",
      error
    );

    throw error;
  }

}



// ===============================
// Get User Profile
// ===============================

export async function getUserProfile(
  uid:string
){

  const snapshot =
    await get(
      ref(
        database,
        `users/${uid}`
      )
    );


  if(snapshot.exists()){

    return snapshot.val();

  }


  return null;

}



// ===============================
// Auth State Listener
// ===============================

export function listenAuth(
  callback:any
){

  return authListener(
    callback
  );

}