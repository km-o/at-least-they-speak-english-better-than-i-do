import { Suspense } from "react";
import { getArticles } from "../api/db";
import Link from "next/link";

async function Article({ id }: { id: number }) {
  return (
    <div>{id}</div>
  )
}

export default async function ChatHistory() {

  const res = await fetch("https://localhost:3000/api/chat", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
  const json = await res.json();
  const data = json.data;

  return (
    <div>
      <h2 className="text-2xl">記事一覧</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <table className="table-auto">
          <thead>
            <tr>
              <th>id</th>
              <th>role</th>
              <th>text</th>
            </tr>
          </thead>
          <tbody>
            {data.map((chat: any)=>
              <tr 
                className={chat.role === "llm1" ? "bg-gray-800": "bg-gray-900"}
                key={chat.id}
              >
                <td>{chat.id}</td>
                <td>{chat.role}</td>
                <td>{chat.text}</td>
              </tr>)}
          </tbody>
        </table>

      </Suspense>
    </div>
  );
}