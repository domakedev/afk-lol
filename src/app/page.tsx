"use client"
import { onAuthStateChanged } from "firebase/auth";
import LandingPage from "../components/LandingPage";
import { useUserStore } from "../store/userStore";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { auth } from "@/firebase";

export default function Home() {
  const { loadingUserData } = useUserStore((state) => state);
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const unsubscribe = onAuthStateChanged(auth, async (user: any) => {
      if (user) {
        router.push("/dashboard");
      } 
    });
    return () => unsubscribe();
  }, [router]);

  if (loadingUserData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-slate-200 h-16 w-16"></div>
      </div>
    );
  }

  return <LandingPage />;
}
