import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
import { UserData } from "./types";

export async function saveUserData(userData: UserData) {
  console.log("🚀 ~ saveUserData ~ userData:", userData);

  if (!auth.currentUser) return;
  console.log("llegue aquiu");
  try {
    const asd = await setDoc(doc(db, "users", auth.currentUser.uid), userData);
    console.log("🚀 ~ saveUserData ~ asd:", asd);
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
      return snap.data() as UserData;
    } else {
      // Datos iniciales por defecto
      const initialData: UserData = {
        onboardingComplete: false,
        userName: "",
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
