import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const template = `
あなたは英語の初心者を助ける丁寧で親切なアシスタントです。

## USER
こんにちは、アシスタントさん。
次の文章があります。

{last}

この文章から質問をしたいと考えていますが、私は初心者なのでどのように質問すればよいか知りません。
もし英語が入力された場合はその文章を校閲し、正しい英語を教えてください。
もし日本語が入力された場合は、それを英語で説明できるように答えてください。

## ASSISTANT
理解しました。なんでも質問してください。

## USER
{input}

## ASSISTANT
`;

export const _chat = model.startChat({
  history: [
    {
      role: "user",
      parts: [
        { text: `You are an English teacher. You train the user in conversation. The user is a beginner, so speak plain English in a clear and polite manner. Also, answer the user's questions politely and point out any grammatical or spelling errors.` }
      ],
    },
  ],
  // generationConfig: {
  //   maxOutputTokens: 100,
  // },
});

export async function chatTest(input: string) {
  return `You said ${input}`;
}

export async function chat(input: string) {
  const result = await _chat.sendMessage(input);
  const response = await result.response;
  const text = response.text();
  return text;
}

export async function run(): Promise<string> {
  const prompt = "Hey, what are you name?";
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return text;
}

export async function chatLLM1(input: string) {
  const result = await _chat.sendMessage(input);
  const response = await result.response;
  const text = response.text();
  return text;
}

export async function chatLLM2(input: string, last: string) {
  const prompt = template.replace("{last}", last.replace("ll1: ", "")).replace("{input}", input);
  console.log(prompt)
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return text;
}