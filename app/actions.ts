'use server'

import { generateText } from 'ai'
import { google } from '@ai-sdk/google'

export async function testGeminiIntegration(promptText: string) {
  try {
    const { text } = await generateText({
      model: google('gemini-3.6-flash'),
      prompt: promptText,
    })
    return { success: true, text }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  return { error: errorMessage };
  }
}