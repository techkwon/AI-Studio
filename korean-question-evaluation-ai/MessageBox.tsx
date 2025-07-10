
import React, { useEffect } from 'react';
import { Message } from '../types';

interface MessageBoxProps {
  message: Message | null;
  onDismiss: (id: string) => void;
}

const MessageBox: React.FC<MessageBoxProps> = ({ message, onDismiss }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onDismiss(message.id);
      }, message.type === 'error' ? 5000 : 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onDismiss]);

  if (!message) {
    return null;
  }

  const baseClasses = "fixed top-5 left-1/2 -translate-x-1/2 py-3 px-5 rounded-lg shadow-xl z-[1000] transition-all duration-300 ease-in-out text-sm";
  const typeClasses = message.type === 'success' 
    ? "bg-green-600 text-white border border-green-700" 
    : "bg-red-600 text-white border border-red-700";
  
  const visibilityClasses = message ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5";

  return (
    <div 
      className={`${baseClasses} ${typeClasses} ${visibilityClasses}`}
      role={message.type === 'error' ? "alert" : "status"}
      aria-live="polite"
    >
      {message.text}
      <button 
        onClick={() => onDismiss(message.id)} 
        className="ml-4 text-lg font-bold hover:text-opacity-75"
        aria-label="메시지 닫기"
      >
        &times;
      </button>
    </div>
  );
};

export default MessageBox;
