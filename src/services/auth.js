import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";

export function watchAuth(callback) {
  return onAuthStateChanged(
    auth,
    (user) => callback(user),
    (error) => {
      console.warn("[auth] watchAuth error:", error?.code, error?.message);
      callback(null);
    }
  );
}

export function login(email, password) {
  // Trim both — trailing spaces in .env or form input cause 400s
  const cleanEmail = String(email).trim();
  const cleanPassword = String(password);

  return signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
}

export function logout() {
  return signOut(auth);
}

export function isAdminUser(user) {
  const adminUid = import.meta.env.VITE_ADMIN_UID;

  if (!adminUid) {
    console.error("[auth] VITE_ADMIN_UID is not set — no admin can log in.");
    return false;
  }

  return !!user && user.uid === adminUid;
}