import { create } from "zustand";
import { UserData } from "../types";

interface UserStore {
  user: unknown;
  userData: UserData | null;
  isGuest: boolean;
  loading: boolean;
  setUser: (user: unknown) => void;
  setUserData: (data: UserData | null) => void;
  updateUserData: (data: Partial<UserData>) => void;
  setIsGuest: (isGuest: boolean) => void;
  setLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  userData: null,
  isGuest: false,
  loading: true,
  setUser: (user: unknown) => set({ user }),
  setUserData: (data: UserData | null) => set({ userData: data }),
  updateUserData: (data: Partial<UserData>) =>
    set((state: UserStore) => ({
      userData: state.userData ? { ...state.userData, ...data } : null,
    })),
  setIsGuest: (isGuest: boolean) => set({ isGuest }),
  setLoading: (loading: boolean) => set({ loading }),
}));
