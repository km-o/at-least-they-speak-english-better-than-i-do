"use client";

import { useState, useEffect } from "react";
import { chat, run } from "../api/gemini";

export default function GenTest() {
  const [text, setText] = useState("");


  const handleClick = async () => {
    // const text = await chat();
    setText(text);
  }

  return (
    <main>
      <button
        className="bg-blue-500 p-4 m-4"
        onClick={handleClick}
      >
        レッツゴー
      </button>
      <div>
        <p className="text-gray-500">途中経過：{text}</p>
        <div>ENV: {process.env.GEMINI_API_KEY}</div>
      </div>
    </main>
  );
}