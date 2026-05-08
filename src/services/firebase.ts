import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";

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
