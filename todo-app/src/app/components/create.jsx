import React, { useState } from "react";
import { Slide, Box, TextField, Button } from "@mui/material";

function Create({ onSubmit }) {
  const [showForm, setShowForm] = useState(false);
  const [inputValue, setInputValue] = useState(""); // 入力値を管理

  // 入力のハンドラー
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // 送信ボタンのハンドラー
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the form from submitting normally
    onSubmit(inputValue); // Call the onSubmit prop (passed from Home)
    setInputValue(""); // Clear the input field
    setShowForm(false); // Close the form
  };

  // 背景クリックでフォームを閉じるハンドラー
  const handleBackgroundClick = (e) => {
    // フォームのボックス以外がクリックされた場合に閉じる
    if (e.target.id === "background") {
      setShowForm(false);
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        color="success"
        width="60px"
        sx={{
          backgroundColor: "#48bb78",
          color: "white",
          "&:hover": {
            backgroundColor: "#38a169",
          },
        }}
        onClick={() => setShowForm(true)}
      >
        Create
      </Button>
      <Slide direction="up" in={showForm} mountOnEnter unmountOnExit>
        <Box
          id="background"
          onClick={handleBackgroundClick}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999, // Ensure the background is on top
          }}
        >
          <Box
            sx={{
              width: 300,
              padding: 5,
              backgroundColor: "white",
              borderRadius: 1,
              border: "1px solid #000",
              height: "40%",
              zIndex: 10000, // Ensure the form itself appears above other elements
              position: "relative", // This ensures the z-index is applied correctly
            }}
          >
            <TextField
              label="ToDoを入力"
              variant="outlined"
              fullWidth
              value={inputValue}
              onChange={handleInputChange}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit}
              sx={{ marginTop: 2 }}
            >
              追加
            </Button>
          </Box>
        </Box>
      </Slide>
    </div>
  );
}

export default Create;
