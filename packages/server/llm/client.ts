import OpenAI from 'openai';

const client = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

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
      const response = await client.responses.create({
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
};
