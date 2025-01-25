import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, AlertCircle } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  type: 'user' | 'bot';
  timestamp: Date;
}

interface DocumentChatProps {
  selectedDocument: any;
}

export const DocumentChat: React.FC<DocumentChatProps> = ({ selectedDocument }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (chatContainerRef.current) {
      const scrollHeight = chatContainerRef.current.scrollHeight;
      chatContainerRef.current.scrollTo({
        top: scrollHeight,
        behavior
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedDocument) {
      setMessages([{
        id: crypto.randomUUID(),
        content: `I'm ready to help you analyze "${selectedDocument.name}". What would you like to know?`,
        type: 'bot',
        timestamp: new Date()
      }]);
    }
  }, [selectedDocument]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: input,
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    scrollToBottom();

    // Simulate AI response
    setTimeout(() => {
      const botMessage: Message = {
        id: crypto.randomUUID(),
        content: generateResponse(input),
        type: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateResponse = (query: string): string => {
    if (query.toLowerCase().includes('summary')) {
      return "Based on my analysis, this document contains key information about patient medical history, current medications, and treatment plans. Would you like me to focus on any specific aspect?";
    }
    if (query.toLowerCase().includes('extract')) {
      return "I can help extract specific information. Please let me know what data points you're interested in, such as dates, medications, or diagnoses.";
    }
    return "I've analyzed the document and can help answer specific questions about its content. What would you like to know?";
  };

  return (
    <div className="flex flex-col h-[calc(100vh-13rem)] bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Document Analysis
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Ask questions about your document
        </p>
      </div>

      {selectedDocument ? (
        <>
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
          >
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-start gap-3 ${
                  message.type === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div className={`p-2 rounded-full ${
                  message.type === 'user' 
                    ? 'bg-blue-100 dark:bg-blue-900/20' 
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  {message.type === 'user' 
                    ? <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    : <Bot className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  }
                </div>
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`flex-1 p-4 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  {message.content}
                </motion.div>
              </motion.div>
            ))}
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3"
              >
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <Bot className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="flex-1 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="w-2 h-2 bg-blue-500 rounded-full"
                    />
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.2
                      }}
                      className="w-2 h-2 bg-blue-500 rounded-full"
                    />
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.4
                      }}
                      className="w-2 h-2 bg-blue-500 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about your document..."
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <motion.button
                type="submit"
                disabled={isLoading || !input.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-5 w-5" />
              </motion.button>
            </div>
          </form>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center text-gray-500 dark:text-gray-400"
          >
            <AlertCircle className="h-12 w-12 mx-auto mb-4" />
            <p className="text-lg font-medium">No Document Selected</p>
            <p className="mt-2">Select a document to start analyzing</p>
          </motion.div>
        </div>
      )}
    </div>
  );
};