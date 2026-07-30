// types/user.ts


// ===============================
// User Type
// ===============================

export interface User {

  uid: string;

  name: string;

  email: string;

  phone?: string;

  profileImage?: string;

  role:
    | "customer"
    | "admin";

  address?: string;

  city?: string;

  state?: string;

  createdAt?: number;

  updatedAt?: number;

}



// ===============================
// User Profile Update
// ===============================

export interface UpdateUserProfile {

  name?: string;

  phone?: string;

  profileImage?: string;

  address?: string;

  city?: string;

  state?: string;

}



// ===============================
// Auth User Data
// ===============================

export interface AuthUser {

  uid: string;

  email: string;

  name?: string;

  role?: 
    | "customer"
    | "admin";

}



// ===============================
// Firebase User Record
// ===============================

export interface FirebaseUserData {

  uid: string;

  name: string;

  email: string;

  role: string;

  profileImage?: string;

  createdAt: number;

}