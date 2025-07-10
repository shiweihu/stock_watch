
import ai from '@/app/lib/GenAi';
import { NextRequest, NextResponse } from 'next/server';



export async function POST(request: NextRequest) {

  const { signal } = request; // 获取AbortSignal

  let aborted = false;
  signal.addEventListener('abort', () => {
    aborted = true
    console.log('Client disconnected, stream stopped.');
  });
  try {
    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash-preview-05-20",
      contents: JSON.stringify(JSON.stringify(await request.json())),
      config: {
        systemInstruction: "你是一个股票分析师,根据我给你的新闻内容分析股票的涨跌.用简体中文回答我.我给你的数据包含新闻标题,新闻总结,日期,以及新闻全文URL.如果你觉得哪个新闻对股票影响非常重要,记得把URL列出来.最好能给与买入建议.例如该股票10分里可以给多少分.",
        //maxOutputTokens: 500,
        temperature: 0.1,
      },
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const text = chunk.text
            if (aborted) {
              console.log('Stream aborted by client.');
              break
            }
            controller.enqueue(encoder.encode(text));
            console.log("片段:" + text)
          }
          // for (let i = 0; i < 1000; i++) {
          //    if(aborted){
          //     console.log('Stream aborted by client.');
          //     break
          //   }
          //   controller.enqueue(encoder.encode("asdasd dsa dsa dsa dsa d"));
          //   await new Promise((resolve) => setTimeout(resolve, 300));
          // }
        } catch (err) {
          controller.error(err);
        } finally {
          if (!aborted) {
            controller.close();
          }
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}