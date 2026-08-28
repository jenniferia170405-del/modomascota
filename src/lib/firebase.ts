import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

export interface FirebaseConfig {
  apiKey: string;
  authDomain?: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

const STORAGE_KEY = 'modo_mascota_firebase_config';

// Optional default or environment config
const getEnvConfig = (): FirebaseConfig | null => {
  const apiKey = (import.meta as any).env?.VITE_FIREBASE_API_KEY;
  const projectId = (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID;
  if (apiKey && projectId) {
    return {
      apiKey: apiKey.trim(),
      authDomain: ((import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || `${projectId}.firebaseapp.com`).trim(),
      projectId: projectId.trim(),
      storageBucket: ((import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || `${projectId}.appspot.com`).trim(),
      messagingSenderId: ((import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || '').trim(),
      appId: ((import.meta as any).env?.VITE_FIREBASE_APP_ID || '').trim(),
    };
  }
  return null;
};

export const getStoredFirebaseConfig = (): FirebaseConfig | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.apiKey && parsed?.projectId) {
        return parsed;
      }
    }
  } catch {
    // Ignore parse error
  }
  return getEnvConfig();
};

export const isFirebaseConfigured = (): boolean => {
  const config = getStoredFirebaseConfig();
  return Boolean(config && config.apiKey && config.projectId);
};

export const saveFirebaseConfig = (config: FirebaseConfig): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  window.location.reload();
};

export const clearFirebaseConfig = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
};

let firebaseApp: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;

export const getFirebaseServices = (): { app: FirebaseApp | null; db: Firestore | null } => {
  const config = getStoredFirebaseConfig();
  if (!config || !config.apiKey || !config.projectId) {
    return { app: null, db: null };
  }

  try {
    if (!getApps().length) {
      firebaseApp = initializeApp(config);
    } else {
      firebaseApp = getApp();
    }
    if (!firestoreDb && firebaseApp) {
      firestoreDb = getFirestore(firebaseApp);
    }
    return { app: firebaseApp, db: firestoreDb };
  } catch (error) {
    console.warn('Error inicializando Firebase:', error);
    return { app: null, db: null };
  }
};

export const getDb = (): Firestore | null => {
  return getFirebaseServices().db;
};
