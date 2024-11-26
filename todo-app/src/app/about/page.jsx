"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../Firebase/firebase"; // dbをインポート
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth"; // onAuthStateChangedをインポート
import { useRouter } from "next/navigation"; // useRouterをインポート

export default function About() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter(); // useRouterを使用

  useEffect(() => {
    const fetchUserData = async (user) => {
      try {
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setTodos(userData.todos || []);
            console.log("ユーザーデータ:", userData);
          } else {
            console.log("ユーザードキュメントが存在しません");
          }
        } else {
          console.log("ログインしているユーザーがいません");
        }
      } catch (error) {
        console.error("エラーが発生しました:", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login"); // ログインページへのリダイレクト
      } else {
        setIsLoading(false); // ログイン状態ならローディングを解除
        fetchUserData(user); // ユーザーデータをフェッチ
      }
    });

    // クリーンアップ関数でリスナーを解除
    return () => unsubscribe();
  }, [router]);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          todos: arrayUnion({ todo, createdAt: new Date() }),
        });
        setTodos((prevTodos) => [
          ...prevTodos,
          { todo, createdAt: new Date() },
        ]);
        setTodo("");
        console.log("ToDoが正常に登録されました");
      } else {
        console.log("ログインしているユーザーがいません");
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  return (
    <div>
      <h1>About Page</h1>
      <p>これはAboutページです。</p>
      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          placeholder="ToDoを入力"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
        />
        <button type="submit">追加</button>
      </form>
      <ul>
        {todos.map((item, index) => (
          <li key={index}>{item.todo}</li>
        ))}
      </ul>
    </div>
  );
}
