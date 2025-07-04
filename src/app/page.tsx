"use client"
import LandingPage from "../components/LandingPage";
import { useUserStore } from "../store/userStore";

export default function Home() {
  const { loadingUserData } = useUserStore((state) => state);



  if (loadingUserData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-slate-200 h-16 w-16"></div>
      </div>
    );
  }

  return <LandingPage />;
}
