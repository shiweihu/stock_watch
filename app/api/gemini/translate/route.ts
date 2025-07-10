import ai from '@/app/lib/GenAi';
import { NextRequest, NextResponse } from 'next/server';



export async function POST(request: NextRequest) {

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: JSON.stringify(await request.json()),
    config: {
      systemInstruction: "把这个数据中的文字翻译成中文.其他内容不要动，原样返回,去除开头```json\n和结尾",
      //maxOutputTokens: 500,
      temperature: 0,
    },
  });

  // 去除 Markdown 包裹
  const cleaned = response.text!.replace(/^```json\n/, '').replace(/\n```$/, '');

  // 解析为对象
  //const parsed = JSON.parse(cleaned);

  return new NextResponse(cleaned, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  });

}