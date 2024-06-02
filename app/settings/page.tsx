import Link from "next/link";
import ArticleList from "../_component/ArticleList";
import ChatHistory from "../_component/ChatHistory";

export default function Home() {


  return (
    <main className="min-h-screen my-4 px-2 lg:m-24">
      <Link className="text-blue-500" href={`/`}>戻る</Link>
      <br/>
      <ArticleList/>
      <br/>
      <ChatHistory/>
    </main>
  );
}
