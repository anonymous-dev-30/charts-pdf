// "use server";
import firebase from "firebase/compat/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";

const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE,
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

export async function uploadToS3(file: File) {
  const storageRef = ref(storage, `pdf/${file.name}`);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    console.log("File uploaded successfully:", snapshot.ref.fullPath);
    return snapshot.ref.fullPath;
  } catch (error) {}
}

export function getS3Url(file_key: string) {
  return `${process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_STORAGE}/${file_key}?alt=media`;
}
