import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

const medicineCollection = collection(db, "medicines");

/* CREATE */
export const createMedicine = async (medicineData) => {
  try {
    const docRef = await addDoc(medicineCollection, {
      ...medicineData,
      createdAt: new Date(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Create Medicine Error:", error);
    throw error;
  }
};

/* GET ALL */
export const getMedicines = async () => {
  try {
    const snapshot = await getDocs(medicineCollection);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Get Medicines Error:", error);
    throw error;
  }
};

/* UPDATE */
export const updateMedicine = async (id, updatedData) => {
  try {
    const medicineDoc = doc(db, "medicines", id);

    await updateDoc(medicineDoc, {
      ...updatedData,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Update Medicine Error:", error);
    throw error;
  }
};

/* DELETE */
export const deleteMedicine = async (id) => {
  try {
    const medicineDoc = doc(db, "medicines", id);

    await deleteDoc(medicineDoc);
  } catch (error) {
    console.error("Delete Medicine Error:", error);
    throw error;
  }
};