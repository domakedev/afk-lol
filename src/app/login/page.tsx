"use client";
import { useEffect, useState } from "react";
import Login from "../../components/Login";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [guestRequestCreateAccount, setGuestRequestCreateAccount] =
    useState(false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const unsubscribe = onAuthStateChanged(auth, async (user: any) => {
      if (user && !auth?.currentUser?.isAnonymous) {
        router.push("/dashboard");
      } else if (auth?.currentUser?.isAnonymous) {
        router.push("/login");
        setGuestRequestCreateAccount(true);
      } else if (!user) {
        router.push("/login");
      } else {
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [router]);

  return <Login guestRequestCreateAccount={guestRequestCreateAccount} />;
}
