import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

const invoiceCollection = collection(db, "invoices");

/* CREATE */
export const createInvoice = async (invoiceData) => {
  try {
    const docRef = await addDoc(invoiceCollection, {
      ...invoiceData,
      createdAt: new Date(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Create Invoice Error:", error);
    throw error;
  }
};

/* GET ALL */
export const getInvoices = async () => {
  try {
    const snapshot = await getDocs(invoiceCollection);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Get Invoices Error:", error);
    throw error;
  }
};

/* UPDATE */
export const updateInvoice = async (id, updatedData) => {
  try {
    const invoiceDoc = doc(db, "invoices", id);

    await updateDoc(invoiceDoc, {
      ...updatedData,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Update Invoice Error:", error);
    throw error;
  }
};

/* DELETE */
export const deleteInvoice = async (id) => {
  try {
    const invoiceDoc = doc(db, "invoices", id);

    await deleteDoc(invoiceDoc);
  } catch (error) {
    console.error("Delete Invoice Error:", error);
    throw error;
  }
};