import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
import { UserData } from "./types";

export async function saveUserData(userData: UserData) {
  console.log("🚀 ~ saveUserData ~ userData:", userData);

  if (!auth.currentUser) return;
  console.log("llegue aquiu");
  try {
    await setDoc(doc(db, "users", auth.currentUser.uid), {
      ...userData,
      email: auth.currentUser.email || null,
    });
  } catch (error) {
    console.error("Error saving user data:", error);
  }
}

export async function loadUserData(): Promise<UserData> {
  if (!auth.currentUser) throw new Error("No user authenticated");
  const userRef = doc(db, "users", auth.currentUser.uid);
  try {
    const snap = await getDoc(userRef);
    console.log("🚀 ~ loadUserData ~ snap:", snap);
    if (snap.exists()) {
      const data = snap.data() as UserData;
      return {
        ...data,
        email: auth.currentUser.email || null,
      };
    } else {
      // Datos iniciales por defecto
      const initialData: UserData = {
        onboardingComplete: false,
        userName: auth.currentUser.email || "",
        email: auth.currentUser.email || null,
        dayZero: null,
        commitment: "",
        assessmentScore: 0,
        horasRecuperadas: 0,
        horasPorRecuperar: 0,
        killStreak: 0,
        activities: [],
        goals: [],
        routines: [],
        triggers: [],
        cbtEntries: [],
        defeats: [],
      };
      await setDoc(userRef, initialData);
      return initialData;
    }
  } catch (error) {
    console.error("Error loading user data:", error);
    throw error;
  }
}
