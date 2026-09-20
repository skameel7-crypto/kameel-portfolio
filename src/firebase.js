import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate config early — catches missing .env vars
const missingKeys = Object.entries(firebaseConfig)
  .filter(([, v]) => !v)
  .map(([k]) => k);

if (missingKeys.length) {
  console.error(
    "[firebase] Missing env vars:",
    missingKeys.map((k) => `VITE_FIREBASE_${k.replace(/([A-Z])/g, "_$1").toUpperCase()}`)
  );
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// ─────────────────────────────────────────────────────────────
// Persist auth across reloads. If a stale token exists in
// IndexedDB/localStorage, this call tells Firebase to use the
// valid one or fall back to `null` cleanly instead of throwing 400.
// ─────────────────────────────────────────────────────────────
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn("[firebase] setPersistence failed:", err?.message);
});

// ─────────────────────────────────────────────────────────────
// One-shot cleanup: if the saved session is invalid, sign out
// once so the 400 lookup stops repeating on every reload.
// ─────────────────────────────────────────────────────────────
let cleanedStaleSession = false;

onAuthStateChanged(auth, async (user) => {
  // If user is null AND a token was previously stored, clear it.
  // This prevents Firebase from re-attempting the broken lookup.
  if (!user && !cleanedStaleSession) {
    cleanedStaleSession = true;
    try {
      const hasStoredToken =
        Object.keys(localStorage).some((k) =>
          k.startsWith("firebase:authUser")
        ) ||
        // some browsers keep it in IndexedDB — this call is a no-op if nothing stored
        (await indexedDB.databases?.())?.some((d) =>
          d.name?.includes("firebaseLocalStorageDb")
        );

      if (hasStoredToken) {
        await signOut(auth);
        console.info("[firebase] Cleared stale auth session.");
      }
    } catch {
      /* silent — cleanup is best-effort */
    }
  }
});