import OpenAI from 'openai';
import { InferenceClient } from '@huggingface/inference';
import { Ollama } from 'ollama';

import summarizePrompt from '../prompts/summarize-reviews.txt';

const openAIClient = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

const inferenceClient = new InferenceClient(process.env.HF_TOKEN);

const ollamaClient = new Ollama({ host: 'http://10.10.0.16:11434' });

type GenerateTextOptions = {
   model?: string;
   prompt: string;
   instructions?: string;
   previous_response_id?: string;
   max_output_tokens?: number;
   reasoning?: object;
};

type GenerateTextResult = {
   id: string;
   text: string;
};

export const llmClient = {
   async generateText({
      model = 'gpt-5-nano',
      prompt,
      instructions,
      previous_response_id,
      max_output_tokens = 500,
      reasoning = {
         effort: 'low',
      },
   }: GenerateTextOptions): Promise<GenerateTextResult> {
      const response = await openAIClient.responses.create({
         model,
         input: prompt,
         instructions,
         max_output_tokens,
         reasoning,
         previous_response_id,
      });

      return {
         id: response.id,
         text: response.output_text,
      };
   },
   async summarizeReviews(reviews: string) {
      const output = await ollamaClient.chat({
         model: 'tinyllama',
         messages: [
            {
               role: 'system',
               content: summarizePrompt,
            },
            {
               role: 'user',
               content: reviews,
            },
         ],
      });
      return output.message.content || '';
   },

   async chatSESG(instructions: string, request: string) {
      const output = await ollamaClient.chat({
         model: 'tinyllama',
         messages: [
            {
               role: 'system',
               content: instructions,
            },
            {
               role: 'user',
               content: request,
            },
         ],
      });
      return output.message.content || '';
   },
};
