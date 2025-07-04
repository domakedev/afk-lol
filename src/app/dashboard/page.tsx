"use client";

import Dashboard from "@/components/Dashboard";
import { loadUserData } from "@/firebaseUserData";
import { useUserStore } from "@/store/userStore";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const { userData, loadingUserData, setUserData } = useUserStore(
    (state) => state
  );
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const unsubscribe = onAuthStateChanged(auth, async (user: any) => {
      if (user) {
        try {
          const userData = await loadUserData();
          setUserData(userData);
        } catch (err) {
          console.log("🚀 Error en Dashboard", err);
          setUserData(null);
          router.push("/login");
        }
      } else {
        setUserData(null);
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [router, setUserData]);

  if (!userData || loadingUserData) {
    return (
      <div className="flex items-center justify-center h-64 min-h-full min-w-full ">
        <div className="relative flex items-center justify-center w-20 h-20">
          <span className="absolute inline-block w-20 h-20 rounded-full border-4 border-teal-400 border-t-transparent animate-spin-slow shadow-lg"></span>
          <span className="absolute inline-block w-12 h-12 rounded-full border-2 border-teal-300 border-t-transparent opacity-60 animate-spin shadow-md"></span>
          <span className="absolute text-teal-400 text-3xl font-bold drop-shadow-lg select-none animate-pulse">
            AFK
          </span>
        </div>
      </div>
    );
  }
  if (userData && userData.onboardingComplete === false) {
    router.replace("/onboarding");
    return null;
  }
  return <Dashboard />;
};

export default Page;
