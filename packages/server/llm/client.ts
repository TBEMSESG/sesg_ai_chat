import OpenAI from 'openai';
import { InferenceClient } from '@huggingface/inference';
import { Ollama } from 'ollama';

import summarizePrompt from '../prompts/summarize-reviews.txt';

const openAIClient = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

const inferenceClient = new InferenceClient(process.env.HF_TOKEN);

const ollamaClient = new Ollama({ host: 'http://localhost:11434' });

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
         model: 'llama3.1',
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

   async chatSESG(instructions: string, oldData: string, request: string) {
      try {
         const output = await ollamaClient.chat({
            // model: 'llama3.1',
            // model: 'tinyllama',
            model: 'hf.co/bartowski/Llama-3.2-3B-Instruct-GGUF:Q4_K_M',
            messages: [
               {
                  role: 'system',
                  content: `Follow this instructions: ---- ${instructions} ---- `,
               },
               {
                  role: 'user',
                  content: `base your answers only on these old cases. The old data is provided as an JSON array of cases with the following Keys:  "Case Number","Date/Time Opened","Subject","Description","Resolution Reports"
---- ${oldData} ----  `,
               },
               
               {
                  role: 'user',
                  content: request,
               },
            ],
            options: {
               temperature: 0.5,
               num_ctx: 15000,
            },
         });
         return output.message.content || '';
      } catch (error) {
         console.log('error contacting ollama');
         return;
      }
   },
};
