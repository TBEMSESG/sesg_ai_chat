import { useRef, useState } from 'react';

import TypingIndicator from './TypingIndicator';
import type { Message } from './ChatMessages';
import ChatMessages from './ChatMessages';
import ChatInput, { type ChatFormData } from './ChatInput';
import axios from 'axios';
import popSound from '../../assets/sounds/pop.mp3';
import notificationSound from '../../assets/sounds/notification.mp3';

type ChatResponse = {
   message: string;
};

const popAudio = new Audio(popSound);
popAudio.volume = 0.1;

const notificationAudio = new Audio(notificationSound);
notificationAudio.volume = 0.2;

const ChatBot = () => {
   const [isBotTyping, setIsBotTyping] = useState(false);
   const [messages, setMessages] = useState<Message[]>([]);
   const [error, setError] = useState('');
   // const conversationId = useRef(crypto.randomUUID());
   const conversationId = useRef('029a672b-5a41-492c-ba4b-8d5b04bf94c1');

   const onSubmit = async ({ prompt }: ChatFormData) => {
      try {
         setError('');
         setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
         setIsBotTyping(true);
         popAudio.play();

         const { data } = await axios.post<ChatResponse>('/api/chat', {
            prompt,
            conversationId: conversationId.current,
         });
         console.log(messages);
         setMessages((prev) => [
            ...prev,
            { content: data.message, role: 'bot' },
         ]);
         notificationAudio.play();
      } catch (error) {
         console.log('Error folgt: ')
         console.error(error);
         setError('Something went wrong, try again!');
      } finally {
         setIsBotTyping(false);
      }
   };

   return (
      <div className="flex flex-col h-full">
         <div className="flex flex-col flex-1 gap-3 mb-6 overflow-y-auto">
            <ChatMessages messages={messages} />

            {isBotTyping && <TypingIndicator />}
            {error && <p className="text-red-500">{error}</p>}
         </div>
         <ChatInput onSubmit={onSubmit} />
      </div>
   );
};

export default ChatBot;
