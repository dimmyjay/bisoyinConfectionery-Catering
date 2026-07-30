// firebase/auth.ts

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User,
} from "firebase/auth";

import { auth } from "./config";


// ===============================
// Sign Up User
// ===============================

export async function registerUser(
  email: string,
  password: string,
  name: string
) {
  const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

  const user = userCredential.user;


  await updateProfile(user, {
    displayName: name,
  });


  return user;
}


// ===============================
// Login User
// ===============================

export async function loginUser(
  email: string,
  password: string
) {
  const userCredential =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );


  return userCredential.user;
}


// ===============================
// Logout User
// ===============================

export async function logoutUser() {
  await signOut(auth);
}


// ===============================
// Reset Password
// ===============================

export async function resetPassword(
  email: string
) {
  await sendPasswordResetEmail(
    auth,
    email
  );
}


// ===============================
// Get Current User
// ===============================

export function getCurrentUser() {
  return auth.currentUser;
}


// ===============================
// Listen To Auth Changes
// ===============================

export function authListener(
  callback: (user: User | null) => void
) {
  return onAuthStateChanged(
    auth,
    callback
  );
}