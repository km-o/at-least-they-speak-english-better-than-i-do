"use client";

import { useState, useEffect } from "react";
import { chat, chatLLM1, chatLLM2 } from "../api/gemini";
import Link from "next/link";

interface Chat {
  id: number,
  text: string
}

export default function Speech() {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );
  const [history, setHistory] = useState<Chat[]>([]);

  const synth = window.speechSynthesis;

  const startRecording = () => {
    if (typeof window !== "undefined") {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsRecording(true);
      }

      recognition.onend = () => {
        setIsRecording(isRecording);
      }

      recognition.onresult = async (event) => {
        const results = event.results;
        const input = results[0][0].transcript;
        const oldInputText = inputText;
        setInputText(oldInputText + input + ". ");
      };

      recognition.start();
      setRecognition(recognition);
    }
  }

  const stopRecording = () => {
    setIsRecording(false);
    recognition?.stop();
  }
  const [inputText, setInputText] = useState('');

  const tts = (text: string, lang: string = "en-US") => {
    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.lang = lang
    const englishVoice = window.speechSynthesis.getVoices().find((voice)=>voice.lang == lang);
    if (englishVoice) {
      utterThis.voice = englishVoice;
      utterThis.pitch = 1.0;
      utterThis.rate = 1.0;
    }

    synth.speak(utterThis);
  }

  // window.addEventListener("keydown", async (e) => {
  //   if (e.code === "Space") {
  //     e.preventDefault();
  //     startRecording();
  //   }
  // });

  const askLLM1 = async () => {
    setInputText("");
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ role: "user", text: inputText})
    });
    const userInputResult = await res.json();
    setHistory((prevHistory) => [{ id: prevHistory.length, text: `user: ${inputText}` }, ...prevHistory,]);

    let llmText = await chatLLM1(inputText);
    const llmRes = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ role: "llm1", text: llmText})
    });
    const llmInputResult = await llmRes.json();

    llmText = llmText.replaceAll("*", "");

    setHistory((prevHistory) => [{ id: prevHistory.length, text: `llm1: ${llmText}` }, ...prevHistory,]);
    tts(llmText, "en-US");
  }

  const askLLM2 = async () => {

    const llmLastChat = history[0];

    setInputText("");
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ role: "user", text: inputText})
    });
    const userInputResult = await res.json();
    setHistory((prevHistory) => [{ id: prevHistory.length, text: `user: ${inputText}` }, ...prevHistory,]);

    let llmText = await chatLLM2(inputText, llmLastChat.text);
    const llmRes = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ role: "llm2", text: llmText})
    });
    const llmInputResult = await llmRes.json();

    llmText = llmText.replaceAll("*", "");

    setHistory((prevHistory) => [{ id: prevHistory.length, text: `llm2: ${llmText}` }, ...prevHistory,]);
    tts(llmText, "ja-JP");
  }

  return (
    <main className="w-full px-4 mx-4 my-8">
      <div className="text-2xl">History</div>
      <div className="my-4 h-48 overflow-y-scroll flex flex-col-reverse border border-solid-white">
        {history.map((history: Chat) => <div key={history.id}>{history.text}</div>)}
      </div>

      <div className="flex m-4 justify-between">
        <button
          className="bg-blue-500 p-4 m-4 min-w-12"
          onClick={askLLM1}
        >
          <div className="text-xs text-slate-100">英会話する</div>
          <div>Ask LLM_1</div>
        </button>
        <button
          className="bg-green-500 p-4 m-4 min-w-12"
          onClick={askLLM2}
        >
          <div className="text-xs text-slate-100">日本語で質問</div>
          Ask LLM_2
        </button>
      </div>

      <div className="text-2xl"> Query</div>
      <div className="my-4 h-24 border border-solid border-white p-2">
        <textarea 
          className="w-full h-full bg-black text-wrap"
          id="pre-input"
          onChange={(e) => setInputText(e.target.value)}
          value={inputText}
          defaultValue={`ここに入力`}
        >
        </textarea>
      </div>
      <div className="flex m-4 justify-between">
        <button
          className="bg-blue-500 p-4 m-4 min-w-24"
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? "停止" : "録音開始"}
        </button>
        <button
          className="bg-red-500 p-4 m-4 min-w-24"
          onClick={() => setInputText("")}
        >
          クリア
        </button>
      </div>

      <div className="flex justify-center">
        <Link className="m-2 p-2 bg-blue-500" href={`/settings`}>Go to settings</Link>
      </div>
    </main>
  );
}