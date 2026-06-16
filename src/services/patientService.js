import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { initializeApp, getApps } from "firebase/app";
import app, { db } from "../firebase/firebase";
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from "firebase/firestore";

const secondaryApp =
  getApps().find((app) => app.name === "patientRegistration") ||
  initializeApp(app.options, "patientRegistration");

const secondaryAuth = getAuth(secondaryApp);

// CREATE PATIENT (Auth + Database)
export const createPatient = async (data) => {
  const userCredential = await createUserWithEmailAndPassword(
    secondaryAuth,
    data.email,
    data.password
  );

  const uid = userCredential.user.uid;

  const { password, confirmPassword, ...patientData } = data;

  const patientRef = doc(db, "patients", uid);

  await setDoc(patientRef, {
    ...patientData,
    role: "patient",
    createdAt: serverTimestamp(),
  });

  return {
    id: uid,
    ...patientData,
  };
};
// GET ALL PATIENTS
export const getPatients = async () => {
  const snapshot = await getDocs(collection(db, "patients"));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// UPDATE PATIENT
export const updatePatient = async (id, data) => {
  // If password was included, exclude it as it's handled via Auth service
  const { password, confirmPassword, ...updateData } = data;
  const ref = doc(db, "patients", id);
  return await updateDoc(ref, updateData);
};

// DELETE PATIENT
export const deletePatient = async (id) => {
  return await deleteDoc(doc(db, "patients", id));
};