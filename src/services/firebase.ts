import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs, doc, updateDoc, deleteDoc, orderBy } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, signOut as fbSignOut, onAuthStateChanged, User } from "firebase/auth";

/**
 * Firebase Configuration
 * 
 * To activate this service:
 * 1. Create a Firebase project at console.firebase.google.com
 * 2. Add a Web App and copy the config.
 * 3. Add these to your .env file.
 */

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export interface FeedbackData {
  firstName: string;
  email: string;
  answers: Record<string, string>;
  comments?: string;
}

export const submitFeedback = async (data: FeedbackData): Promise<{ success: boolean; message: string }> => {
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // If no API keys are present, we run in "Mock Mode"
  if (!import.meta.env.VITE_FIREBASE_API_KEY) {
    console.log('--- Firebase Mock Mode ---');
    console.log('Feedback Data:', data);
    console.log('To activate: Add Firebase config variables to your .env');
    return { success: true, message: 'Mock feedback submitted successfully.' };
  }

  try {
    const docRef = await addDoc(collection(db, "feedback"), {
      ...data,
      timestamp: serverTimestamp()
    });
    console.log("Document written with ID: ", docRef.id);
    return { success: true, message: 'Thank you for your feedback!' };
  } catch (e) {
    console.error("Error adding document: ", e);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
};

export interface WaitlistData {
  fullName: string;
  email: string;
  source: string;
}

export const joinWaitlist = async (data: WaitlistData): Promise<{ success: boolean; message: string }> => {
  if (!import.meta.env.VITE_FIREBASE_API_KEY) {
    console.log('--- Firebase Mock Mode (Waitlist) ---');
    console.log('Waitlist Data:', data);
    return { success: true, message: 'Mock waitlist join successful.' };
  }

  try {
    // Check for duplicates
    const waitlistRef = collection(db, "waitlist");
    const q = query(waitlistRef, where("email", "==", data.email.toLowerCase()));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return { success: false, message: 'This email is already on the waitlist.' };
    }

    const docRef = await addDoc(waitlistRef, {
      ...data,
      email: data.email.toLowerCase(), // Save as lowercase for consistency
      timestamp: serverTimestamp()
    });
    console.log("Waitlist document written with ID: ", docRef.id);
    return { success: true, message: 'Successfully joined the waitlist!' };
  } catch (e) {
    console.error("Error adding to waitlist: ", e);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
};

// --- Admin Portal Functions ---

// Fetch Waitlist
export const getWaitlist = async () => {
  if (!import.meta.env.VITE_FIREBASE_API_KEY) return [];
  const q = query(collection(db, "waitlist"), orderBy("timestamp", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Fetch Feedback
export const getFeedback = async () => {
  if (!import.meta.env.VITE_FIREBASE_API_KEY) return [];
  const q = query(collection(db, "feedback"), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// --- Influencers ---
export interface LogEntry {
  timestamp: string;
  text: string;
}

export interface InfluencerData {
  id?: string;
  name: string;
  handle: string;
  email: string;
  status: string; // Scouted, Contacted, etc.
  notes?: string; // Legacy
  logs?: LogEntry[]; // New audit log
  platforms?: { [platformName: string]: number };
  niche?: string;
  location?: string;
  address?: string;
}

export const getInfluencers = async () => {
  if (!import.meta.env.VITE_FIREBASE_API_KEY) return [];
  const q = query(collection(db, "influencers"), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addInfluencer = async (data: Omit<InfluencerData, 'id'>) => {
  return await addDoc(collection(db, "influencers"), { ...data, timestamp: serverTimestamp() });
};

export const updateInfluencer = async (id: string, data: Partial<InfluencerData>) => {
  const ref = doc(db, "influencers", id);
  return await updateDoc(ref, data);
};

export const deleteInfluencer = async (id: string) => {
  const ref = doc(db, "influencers", id);
  return await deleteDoc(ref);
};

// --- Tasks ---
export interface TaskData {
  id?: string;
  title: string;
  description: string;
  status: string; // Todo, In Progress, Done
}

export const getTasks = async () => {
  if (!import.meta.env.VITE_FIREBASE_API_KEY) return [];
  const q = query(collection(db, "tasks"), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addTask = async (data: Omit<TaskData, 'id'>) => {
  return await addDoc(collection(db, "tasks"), { ...data, timestamp: serverTimestamp() });
};

export const updateTask = async (id: string, data: Partial<TaskData>) => {
  const ref = doc(db, "tasks", id);
  return await updateDoc(ref, data);
};

export const deleteTask = async (id: string) => {
  const ref = doc(db, "tasks", id);
  return await deleteDoc(ref);
};

// --- Authentication Services ---

export const loginWithEmailAndPassword = async (email: string, password: string): Promise<User | { email: string }> => {
  if (!import.meta.env.VITE_FIREBASE_API_KEY) {
    if (email.toLowerCase() === 'admin@lfto.com' && password === 'admin123') {
      const simulatedUser = { email: email.toLowerCase() };
      localStorage.setItem('lfto_mock_user', JSON.stringify(simulatedUser));
      window.dispatchEvent(new Event('mock_auth_change'));
      return simulatedUser;
    } else {
      throw new Error("Invalid admin credentials in Mock Mode. Use admin@lfto.com / admin123");
    }
  }

  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const logout = async (): Promise<void> => {
  if (!import.meta.env.VITE_FIREBASE_API_KEY) {
    localStorage.removeItem('lfto_mock_user');
    window.dispatchEvent(new Event('mock_auth_change'));
    return;
  }
  await fbSignOut(auth);
};

export type AuthListener = (user: User | { email: string } | null) => void;

export const subscribeToAuthChanges = (callback: AuthListener): (() => void) => {
  if (!import.meta.env.VITE_FIREBASE_API_KEY) {
    const checkMockUser = () => {
      const stored = localStorage.getItem('lfto_mock_user');
      if (stored) {
        try {
          callback(JSON.parse(stored));
        } catch {
          callback(null);
        }
      } else {
        callback(null);
      }
    };
    
    checkMockUser();
    
    window.addEventListener('mock_auth_change', checkMockUser);
    return () => {
      window.removeEventListener('mock_auth_change', checkMockUser);
    };
  }

  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};
