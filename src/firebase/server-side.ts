
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

// This function should be called in server components to get a new Firebase instance.
// This prevents sharing of instances between requests.
export function initializeServerSideFirebase(): { firestore: Firestore; firebaseApp: FirebaseApp } {
  // Check if we're on the server.
  if (typeof window !== 'undefined') {
    throw new Error('initializeServerSideFirebase should only be called on the server.');
  }

  // Use the default app instance. If it doesn't exist, initialize it.
  // This prevents multiple app instances from being created on the server.
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

  const firestore = getFirestore(app);
  
  return { firestore, firebaseApp: app };
}
