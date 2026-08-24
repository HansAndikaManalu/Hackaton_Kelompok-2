import { NextResponse } from 'next/server'
import { generateText } from 'ai'
import { google } from '@ai-sdk/google'

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt field is required' },
        { status: 400 }
      )
    }

    const { text } = await generateText({
      model: google('gemini-3.6-flash'),
      prompt,
    })

    return NextResponse.json({
      success: true,
      model: 'gemini-3.6-flash',
      prompt,
      response: text,
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}