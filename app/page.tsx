import Image from "next/image";
import Speech from "./_component/Speech";
import GenTest from "./_component/GenTest";

export default function Home() {

  return (
    <main className="min-h-screen flex  flex-col items-center p-0 m-0 w-full lg:p-24">
      <h1 className="text-3xl text-balance px-4 my-4">At least they (AI) speak english better than i do, so please teach me English!</h1>
      <Speech/>
    </main>
  );
}
