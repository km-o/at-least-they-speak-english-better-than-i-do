import { Suspense } from "react";
import { getArticles } from "../api/db";

async function Article({ id, title }: { id: number, title: string }) {
  return (
    <div className="flex justify-between" key={id}>
      <div>{id}</div>
      <div>{title}</div>
    </div>
  )
}

export default async function ArticleList() {

  const articles = await getArticles();

  return (
    <div>
      <h2 className="text-2xl">記事一覧</h2>
      <Suspense fallback={<div>Loading...</div>}>
        {articles.map((article: any) => <Article id={article.id} title={article.title}/>)}
      </Suspense>
    </div>
  );
}