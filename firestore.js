import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"

const firebaseConfig = {
    apiKey: "AIzaSyBmtedsuWLA7AKD-xiHi0BGlSpddYBI6v0",
    authDomain: "inventario-935b9.firebaseapp.com",
    projectId: "inventario-935b9",
    storageBucket: "inventario-935b9.appspot.com",
    messagingSenderId: "1074001538555",
    appId: "1:1074001538555:web:a70ae56ce2861a510d2f5e"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function addProduct(producto) {
    try {
        const docRef = await addDoc(collection(db, "inventario"), producto);
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export async function getProducts() {
    const querySnapshot = await getDocs(collection(db, "inventario"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function updateProduct(id, producto) {
    try {
        await updateDoc(doc(db, "inventario", id), producto);
    } catch (e) {
        console.error("Error updating document: ", e);
    }
}

export async function deleteProduct(id) {
    try {
        await deleteDoc(doc(db, "inventario", id));
    } catch (e) {
        console.error("Error deleting document: ", e);
    }
}

export async function isProductUnique(name) {
    const q = query(collection(db, "inventario"), where("name", "==", name));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
}
