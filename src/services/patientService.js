import { db } from "../firebase/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from "firebase/firestore";

const patientRef = collection(db, "patients");

// CREATE PATIENT
export const createPatient = async (data) => {
  return await addDoc(patientRef, {
    ...data,
    role: "patient",
    createdAt: serverTimestamp()
  });
};

// GET ALL PATIENTS
export const getPatients = async () => {
  const snapshot = await getDocs(patientRef);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// UPDATE PATIENT
export const updatePatient = async (id, data) => {
  const ref = doc(db, "patients", id);
  return await updateDoc(ref, data);
};

// DELETE PATIENT
export const deletePatient = async (id) => {
  const ref = doc(db, "patients", id);
  return await deleteDoc(ref);
};