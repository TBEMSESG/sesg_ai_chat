import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync'; // <-- sync entry point

import { conversationRepository } from '../repositories/conversation.repository';
import template from '../prompts/chatbot.txt';
import { llmClient } from '../llm/client';

type ChatResponse = {
   id?: string;
   message: string;
};

function readCsvSync<T = Record<string, string>>(relativePath: string): T[] {
   // -----------------------------------------------------------------
   // 1️⃣ Resolve the absolute file path (works in CommonJS & ES‑M)
   // -----------------------------------------------------------------
   // If you are in an ES‑module where __dirname is unavailable,
   // replace the line below with the `import.meta.url` trick shown later.
   const csvPath = path.resolve(__dirname, relativePath);

   // -----------------------------------------------------------------
   // 2️⃣ Load the whole file as a UTF‑8 string (blocking)
   // -----------------------------------------------------------------
   const raw = fs.readFileSync(csvPath, 'utf-8');

   // -----------------------------------------------------------------
   // 3️⃣ Parse the CSV synchronously
   // -----------------------------------------------------------------
   const records = parse(raw, {
      columns: true, // first row becomes object keys
      skip_empty_lines: true, // ignore blank lines
      trim: true, // strip surrounding whitespace
      // You can add more options here, e.g.:
      delimiter: ',',
      // relax_quotes: true,
   }) as T[];

   return records;
}

const rows = readCsvSync<Record<string, string>>('../prompts/report.csv');
console.log(`I have ${rows.length} old tickets in memory`);

const caseExportData = fs.readFileSync(
   path.join(__dirname, '..', 'prompts', 'report.csv'),
   'utf-8'
);

const instructions = template.replace('{{caseExport}}', JSON.stringify(rows));

export const chatService = {
   async sendMessage(prompt: string): Promise<ChatResponse> {
      const response = await llmClient.chatSESG(
         template,
         caseExportData,
         prompt
      );

      return {
         message: response,
      };
   },

   async sendMessageOld(
      prompt: string,
      conversationId: string
   ): Promise<ChatResponse> {
      const response = await llmClient.generateText({
         model: 'gpt-5-nano',
         prompt,
         instructions,
         max_output_tokens: 2000,
         reasoning: {
            effort: 'low',
         },
         previous_response_id:
            conversationRepository.getLastResponseId(conversationId),
      });

      conversationRepository.setLastResponseId(conversationId, response.id);

      return {
         id: response.id,
         message: response.text,
      };
   },
};
