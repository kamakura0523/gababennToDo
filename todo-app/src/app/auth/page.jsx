"use client";

import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signUp,
  auth,
} from "../../Firebase/firebase";
import { useRouter } from "next/navigation";

const Auth = () => {
  const initialValues = {
    mailAddress: "",
    password: "",
    address: "",
    todos: [],
  };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    console.log(formValues);
  };

  const validate = (values) => {
    const errors = {};
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!values.mailAddress) {
      errors.mailAddress = "メールアドレスを入力してください";
    } else if (!regex.test(values.mailAddress)) {
      errors.mailAddress = "メールアドレスの形式が正しくありません";
    }
    if (!values.password) {
      errors.password = "パスワードを入力してください";
    } else if (values.password.length < 4 || values.password.length > 15) {
      errors.password = "パスワードは4文字以上15文字以下で入力してください";
    }
    return errors;
  };

  const LoginButton = ({ formValues, validate, setFormErrors }) => {
    const Login = async (e) => {
      e.preventDefault();
      const errors = validate(formValues);
      setFormErrors(errors);
      if (Object.keys(errors).length > 0) {
        return;
      }
      try {
        const user = await signInWithEmailAndPassword(
          auth,
          formValues.mailAddress,
          formValues.password
        );
        console.log("サインインUser情報 : ", user);
        if (user) {
          navigate.push("/home");
        } else {
          alert("ログインに失敗しました。");
        }
      } catch (error) {
        console.error("Error signing in:", error);
        alert("ログインに失敗しました。");
      }
    };

    return (
      <button className="submitButton" onClick={Login}>
        ログイン
      </button>
    );
  };

  const SignUpButton = ({ formValues, validate, setFormErrors }) => {
    const navigate = useRouter();

    const handleSignUp = async (e) => {
      e.preventDefault();
      const errors = validate(formValues);
      setFormErrors(errors);
      if (Object.keys(errors).length === 0) {
        try {
          const user = await signUp(
            formValues.mailAddress,
            formValues.password,
            formValues.address,
            formValues.todos
          );
          console.log(user);
          navigate.push("/auth");
        } catch (error) {
          console.error("Error signing up:", error);
          alert("新規登録に失敗しました。");
        }
      }
    };

    return (
      <button className="submitButton" onClick={handleSignUp}>
        新規登録
      </button>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(formValues);
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      try {
        const user = await signUp(
          formValues.mailAddress,
          formValues.password,
          formValues.address,
          formValues.todos
        );
        console.log(user);
        navigate.push("/about");
      } catch (error) {
        console.error("Error signing up:", error);
        alert("新規登録に失敗しました。");
      }
    }
  };

  return (
    <div className="Home">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>ログインフォーム</h1>
          <hr />
          <div className="uiForm">
            <p className="errorMsg">{formErrors.username}</p>
            <div className="formField">
              <label>メールアドレス</label>
              <input
                type="text"
                placeholder="メールアドレス"
                name="mailAddress"
                onChange={handleChange}
              ></input>
            </div>
            <p className="errorMsg">{formErrors.mailAddress}</p>
            <div className="formField">
              <label>パスワード</label>
              <input
                type="text"
                placeholder="パスワード"
                name="password"
                onChange={handleChange}
              ></input>
            </div>
            <p className="errorMsg">{formErrors.password}</p>
            <LoginButton
              formValues={formValues}
              validate={validate}
              setFormErrors={setFormErrors}
            />
            <SignUpButton
              formValues={formValues}
              validate={validate}
              setFormErrors={setFormErrors}
            />
          </div>
        </form>
      </div>
      <style>
        {`
          body {
            background-color: #2ec4b6;
          }

          .formContainer {
            height: 100vh;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .formContainer form {
            background-color: white;
            width: 70%;
            max-width: 450px;
            padding: 30px;
            border-radius: 10px;
            border: 1px solid #dfdfdf;
            box-shadow: 17px 16px 18px -5px #777777;
            border-radius: 10px;
          }

          .uiForm {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-evenly;
            height: 400px;
          }

          h1, h3 {
            text-align: center;
          }

          .formField {
            display: flex;
            flex-direction: column;
            width: 100%;
          }

          .formField input {
            border: 1px solid gray;
            padding: 20px;
            border-radius: 4px;
          }

          .formField label {
            font-size: 15px;
            font-weight: 600;
            margin-bottom: 3px;
          }

          button {
            background-color: #186fbb;
            width: 100%;
            margin-top: 10px;
            border: none;
            border-radius: 5px;
            padding: 10px 30px;
            color: white;
            font-size: 15px;
            cursor: pointer;
            transition: all 0.2s;
          }

          button:hover {
            background-color: #0d548a;
          }

          .errorMsg {
            color: red;
            margin: 0;
            align-self: flex-start;
          }
        `}
      </style>
    </div>
  );
};

export default Auth;
