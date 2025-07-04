"use client"
import Onboarding from "../../components/Onboarding";
import { useUserStore } from "@/store/userStore";

export default function OnboardingPage() {
  const userData = useUserStore((state) => state.userData);
  const loadingUserData = useUserStore((state) => state.loadingUserData);

  if (!userData || loadingUserData) {
    return (
      <div className="flex items-center justify-center min-h-full min-w-full">
        <div className="flex items-center justify-center w-20 h-20">
          <span className="absolute inline-block w-20 h-20 rounded-full border-4 border-teal-400 border-t-transparent animate-spin-slow shadow-lg"></span>
          <span className="absolute inline-block w-12 h-12 rounded-full border-2 border-teal-300 border-t-transparent opacity-60 animate-spin shadow-md"></span>
          <span className="absolute text-teal-400 text-3xl font-bold drop-shadow-lg select-none animate-pulse">
            AFK
          </span>
        </div>
      </div>
    );
  }
  return <Onboarding />;
}
