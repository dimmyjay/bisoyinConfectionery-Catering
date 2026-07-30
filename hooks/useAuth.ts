"use client";

import {
  useEffect,
  useState,
} from "react";

import { User } from "firebase/auth";

import {
  listenAuth,
} from "@/services/auth";

import {
  getUserProfile,
} from "@/services/auth";

interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role?: string;
  createdAt?: number;
}

export function useAuth() {
  const [user, setUser] =
    useState<User | null>(null);

  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const unsubscribe =
      listenAuth(
        async (currentUser: User | null) => {  // ← ADD THIS TYPE

          setUser(
            currentUser
          );

          if(currentUser){

            const userData =
              await getUserProfile(
                currentUser.uid
              );

            setProfile(
              userData
            );

          }else{

            setProfile(null);

          }

          setLoading(false);

        }
      );

    return () => {
      unsubscribe();
    };

  }, []);

  return {

    user,

    profile,

    loading,

    isAuthenticated:
      !!user,

    isAdmin:
      profile?.role === "admin",

  };

}