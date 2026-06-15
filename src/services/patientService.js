import { db } from "../firebase/firebase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from "firebase/firestore";

// CREATE PATIENT (Auth + Database)
export const createPatient = async (data) => {
  const auth = getAuth();
  
  // 1. Create user in Firebase Authentication
  const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
  const uid = userCredential.user.uid;

  // 2. Prepare data without sensitive password
  const { password, confirmPassword, ...patientData } = data;

  // 3. Create document in Firestore using the Auth UID
  const patientRef = doc(db, "patients", uid);
  await setDoc(patientRef, {
    ...patientData,
    role: "patient",
    createdAt: serverTimestamp()
  });

  return { id: uid, ...patientData };
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