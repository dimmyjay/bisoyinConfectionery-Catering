// firebase/client.ts
// Firebase v9 modular SDK client initializer for browser usage.
// Exports:
// - firebaseApp (default) - the initialized app
// - realtimeDb - Realtime Database instance
// - storage - Firebase Storage instance
// - auth - Firebase Auth instance
// - signOutUser() - signs out locally and clears server auth cookies

import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth, signOut as firebaseSignOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// initialize app only once (safe for HMR)
const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Realtime Database (client)
export const realtimeDb = getDatabase(firebaseApp);

// Storage (client)
export const storage = getStorage(firebaseApp);

// Auth (client)
export const auth = getAuth(firebaseApp);

/**
 * Sign the user out locally (Firebase) and clear server-side auth cookies.
 * - Calls Firebase signOut()
 * - Then POST /api/auth/logout with credentials included so HttpOnly cookies can be cleared server-side
 */
export async function signOutUser(): Promise<void> {
  // Sign out the Firebase client first
  await firebaseSignOut(auth);

  // Tell the server to clear the auth cookie(s) (HttpOnly). Include credentials so cookies are sent.
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include", // critical so HttpOnly cookies are sent/cleared
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    // Don't rethrow — user is already signed out client-side. Log for debugging.
    // Middleware may still see an auth cookie until this succeeds; check network/devtools if redirects persist.
    console.error("Failed to clear server auth cookie:", err);
  }
}

export default firebaseApp;