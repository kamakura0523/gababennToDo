"use client";

import { useEffect, useState, useRef } from "react";
import { auth, db } from "../../Firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Create from "../components/create";
import Sortable from "sortablejs";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const router = useRouter();
  const todosRef = useRef(null);

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
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setIsLoading(false);
        fetchUserData(user);
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const el = todosRef.current;
    if (el && todos.length) {
      const sortable = new Sortable(el, {
        animation: 150,
        onEnd: async (evt) => {
          const newTodos = [...todos];
          const [reorderedItem] = newTodos.splice(evt.oldIndex, 1);
          newTodos.splice(evt.newIndex, 0, reorderedItem);

          setTodos(newTodos);
          console.log("ToDoの順序が更新されました");

          // Firestoreに新しい順序を保存
          try {
            const user = auth.currentUser;
            if (user) {
              const userDocRef = doc(db, "users", user.uid);
              await updateDoc(userDocRef, {
                todos: newTodos, // 新しい順序で上書き
              });
              console.log("Firestoreに順序が更新されました");
            } else {
              console.log("ログインしているユーザーがいません");
            }
          } catch (error) {
            console.error("順序の更新中にエラーが発生しました:", error);
          }
        },
      });

      return () => sortable.destroy();
    }
  }, [todos]);

  const handleAddTodo = async (todo) => {
    if (todo.trim() === "") {
      setError("ToDoを入力してください");
      return;
    }
    setError("");
    const newTodo = { todo, createdAt: new Date(), completed: false };

    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const updatedTodos = [...userData.todos, newTodo];
          await updateDoc(userDocRef, {
            todos: updatedTodos,
          });
          setTodos(updatedTodos);
          console.log("ToDoが正常に登録されました");
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

  const handleToggleComplete = (index) => {
    setTodos((prevTodos) => {
      const updatedTodos = [...prevTodos];
      updatedTodos[index] = {
        ...updatedTodos[index],
        completed: !updatedTodos[index].completed,
      };
      return updatedTodos;
    });
    console.log("ToDoの状態が更新されました");
  };

  const handleDeleteCompleted = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const updatedTodos = todos.filter((item) => !item.completed);
        setTodos(updatedTodos);

        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          todos: updatedTodos,
        });
        console.log("完了済みのToDoが削除されました");
      } else {
        console.log("ログインしているユーザーがいません");
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <header
        style={{
          backgroundColor: "#2ec4b6",
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          position: "fixed",
          top: 0,
          width: "100%",
          padding: "2% 5%",
          fontSize: "30px",
        }}
      >
        ToDoアプリ
      </header>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <div
          id="todos"
          ref={todosRef}
          style={{
            backgroundColor: "#90e0ef",
            height: "70%",
            width: "60%",
            alignItems: "center",
            marginTop: "10%",
            borderRadius: "10px",
          }}
        >
          {todos.map((item, index) => (
            <div
              key={item.createdAt.toString()}
              data-index={index}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#e2e8f0",
                padding: "0.5rem",
                borderRadius: "0.25rem",
                marginBottom: "0.5rem",
                marginLeft: "10%",
                marginRight: "10%",
                marginTop: "2%",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={item?.completed || false}
                  onChange={() => handleToggleComplete(index)}
                  style={{ marginRight: "0.5rem" }}
                />
                <p
                  style={{
                    color: "black",
                    textDecoration: item?.completed ? "line-through" : "none",
                  }}
                >
                  {item?.todo}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          backgroundColor: "#2ec4b6",
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          position: "fixed",
          bottom: 0,
          width: "100%",
          padding: "2% 5%",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Create onSubmit={handleAddTodo} />
          <Button
            variant="contained"
            color="success"
            width="60px"
            onClick={handleDeleteCompleted}
            sx={{
              backgroundColor: "#48bb78",
              color: "white",
              "&:hover": {
                backgroundColor: "#38a169",
              },
            }}
          >
            Delete
          </Button>
        </Stack>
      </div>
    </div>
  );
};

export default Home;
