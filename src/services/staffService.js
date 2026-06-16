import {
  collection,
  setDoc, // Changed from addDoc to setDoc
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword
} from "firebase/auth";

import {
  initializeApp,
  getApps
} from "firebase/app";

import app, { db } from "../firebase/firebase";

const secondaryApp =
  getApps().find(app => app.name === "staffRegistration") ||
  initializeApp(app.options, "staffRegistration");

const secondaryAuth = getAuth(secondaryApp);

const staffCollection = collection(db, "staff");

// Create Staff (Handles both Authentication AND Firestore)
export const createStaff = async (staffData) => {
  try {
    const userCredential =
      await createUserWithEmailAndPassword(
        secondaryAuth,
        staffData.email,
        staffData.password
      );

    const user = userCredential.user;

    const { password, ...firestoreData } = staffData;

    await setDoc(doc(db, "staff", user.uid), {
      uid: user.uid,
      ...firestoreData,
      role: firestoreData.role || "staff",
      createdAt: new Date(),
    });

    return {
      id: user.uid,
      ...firestoreData,
    };
  } catch (error) {
    console.error("Error creating staff account flow:", error);
    throw error;
  }
};

// Get All Staff
export const getStaff = async () => {
  try {
    const snapshot = await getDocs(staffCollection);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching staff:", error);
    throw error;
  }
};

// Update Staff
export const updateStaff = async (id, updatedData) => {
  try {
    const staffRef = doc(db, "staff", id);
    
    // Safety check: Avoid saving plain text passwords if passed via update
    const { password, ...cleanData } = updatedData;

    await updateDoc(staffRef, cleanData);
    return true;
  } catch (error) {
    console.error("Error updating staff:", error);
    throw error;
  }
};

// Delete Staff
export const deleteStaff = async (id) => {
  try {
    const staffRef = doc(db, "staff", id);
    await deleteDoc(staffRef);
    return true;
  } catch (error) {
    console.error("Error deleting staff:", error);
    throw error;
  }
};