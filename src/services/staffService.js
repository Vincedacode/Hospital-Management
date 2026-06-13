import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../firebase/firebase"; // adjust path if needed

const staffCollection = collection(db, "staff");

// Create Staff
export const createStaff = async (staffData) => {
  try {
    const docRef = await addDoc(staffCollection, staffData);

    return {
      id: docRef.id,
      ...staffData,
    };
  } catch (error) {
    console.error("Error creating staff:", error);
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

    await updateDoc(staffRef, updatedData);

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