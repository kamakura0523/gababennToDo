// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, getDocs, query, where,setDoc,doc} from "firebase/firestore"; // 追加
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBfjRurjyPInFNMRxFeBjGPXzbHAyMUAA4",
  authDomain: "gababenn-todo.firebaseapp.com",
  projectId: "gababenn-todo",
  storageBucket: "gababenn-todo.appspot.com",
  messagingSenderId: "1066952164599",
  appId: "1:1066952164599:web:5dd781baf63f0742defff2",
  measurementId: "G-SCW7FT6263"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}
const db = getFirestore(app);
const auth = getAuth(app);

// サインアップ
async function signUp (email, password, address,todos) {
  try {
    // Firebase Authenticationでのユーザー作成
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Firestoreにユーザー情報を保存（uidを使って紐づけ）
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      password: password,  // 任意の追加データ (例: username, address など)
      todo: todos,  // 任意の追加データ (例: username, address など)
      createdAt: new Date(),
    });

    console.log("ユーザーが正常に登録され、Firestoreに保存されました");
  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
}

// サインイン
const signIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// ToDoの追加
const addTodo = async (userId, todo) => {
  const todosRef = collection(db, "todos");
  await addDoc(todosRef, { userId, ...todo });
};

// 特定ユーザーのToDo取得
const getTodos = async (userId) => {
  const todosRef = collection(db, "todos");
  const q = query(todosRef, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data());
};

export { db, auth, analytics, signIn, signUp, createUserWithEmailAndPassword, signInWithEmailAndPassword,onAuthStateChanged, addTodo, getTodos };