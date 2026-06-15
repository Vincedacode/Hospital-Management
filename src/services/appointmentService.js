import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

const appointmentCollection = collection(db, "appointments");

// In your appointmentService.js
export const getPatientAppointments = async (patientId) => {
  try {
    const q = query(appointmentCollection, where("patientId", "==", patientId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching patient appointments:", error);
    throw error;
  }
};

/* CREATE */
export const createAppointment = async (appointmentData) => {
  try {
    const docRef = await addDoc(appointmentCollection, {
      ...appointmentData,
      createdAt: new Date(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Create Appointment Error:", error);
    throw error;
  }
};

/* GET ALL */
export const getAppointments = async () => {
  try {
    const snapshot = await getDocs(appointmentCollection);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Get Appointments Error:", error);
    throw error;
  }
};

/* UPDATE */
export const updateAppointment = async (id, updatedData) => {
  try {
    const appointmentDoc = doc(db, "appointments", id);

    await updateDoc(appointmentDoc, {
      ...updatedData,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Update Appointment Error:", error);
    throw error;
  }
};

/* DELETE */
export const deleteAppointment = async (id) => {
  try {
    const appointmentDoc = doc(db, "appointments", id);

    await deleteDoc(appointmentDoc);
  } catch (error) {
    console.error("Delete Appointment Error:", error);
    throw error;
  }
};