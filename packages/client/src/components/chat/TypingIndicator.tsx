const TypingIndicator = () => {
   return (
      <div className="flex gap-1 px-3 py-3 bg-gray-200 self-start rounded-2xl">
         <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse"></div>
         <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.2s]"></div>
         <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.4s]"></div>
      </div>
   );
};

export default TypingIndicator;
