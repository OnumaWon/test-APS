import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { askGeminiFlash, askGeminiProThinking } from '../services/geminiService';
import { BotIcon } from './icons/BotIcon';
import { UserIcon } from './icons/UserIcon';
import { ThinkingIcon } from './icons/ThinkingIcon';

export const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isThinkingMode, setIsThinkingMode] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto'; // Reset height to shrink when text is deleted
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [input]);

    const submitMessage = async () => {
        const textToSubmit = input.trim();
        if (!textToSubmit || isLoading) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            text: textToSubmit,
            thinking: isThinkingMode,
        };
        
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const botMessageId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, { id: botMessageId, role: 'model', text: '', thinking: isThinkingMode }]);
        
        try {
            const history = [...messages, userMessage].map(msg => ({
                role: msg.role,
                parts: [{ text: msg.text }]
            }));
            
            const stream = isThinkingMode
                ? await askGeminiProThinking(history, textToSubmit)
                : await askGeminiFlash(history, textToSubmit);

            for await (const chunk of stream) {
                const chunkText = chunk.text;
                setMessages(prev => prev.map(msg => 
                    msg.id === botMessageId ? { ...msg, text: msg.text + chunkText } : msg
                ));
            }

        } catch (error) {
            console.error('Gemini API error:', error);
            setMessages(prev => prev.map(msg => 
                msg.id === botMessageId ? { ...msg, text: 'Sorry, I encountered an error. Please try again.' } : msg
            ));
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        await submitMessage();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            submitMessage();
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-xl">
            <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Assistant</h2>
                <div className="flex items-center space-x-2">
                    <ThinkingIcon />
                    <span className={`text-sm font-medium ${isThinkingMode ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500'}`}>
                        Thinking Mode
                    </span>
                    <button
                        onClick={() => setIsThinkingMode(!isThinkingMode)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isThinkingMode ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isThinkingMode ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
            </header>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'model' && (
                            <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${msg.thinking ? 'bg-indigo-500 text-white' : 'bg-gray-600 text-white'}`}>
                                {msg.thinking ? <ThinkingIcon /> : <BotIcon />}
                            </div>
                        )}
                        <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'}`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            {msg.id === messages[messages.length-1].id && isLoading && msg.role === 'model' && msg.text.length === 0 && (
                                <div className="flex items-center space-x-2">
                                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></div>
                                </div>
                            )}
                        </div>
                         {msg.role === 'user' && (
                            <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200">
                                <UserIcon />
                            </div>
                        )}
                    </div>
                ))}
                 <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="relative">
                    <textarea
                        ref={textareaRef}
                        rows={1}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={isThinkingMode ? "Ask a complex question..." : "Ask a question..."}
                        className="w-full pl-4 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none overflow-y-auto"
                        style={{ maxHeight: '200px' }}
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || !input.trim()} className="absolute bottom-1.5 right-1.5 flex items-center justify-center h-9 w-9 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:text-gray-300 dark:disabled:text-gray-500 disabled:cursor-not-allowed rounded-full transition-colors">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></svg>
                    </button>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-2">
                    <kbd className="font-sans border rounded px-1 py-0.5 bg-gray-200 dark:bg-gray-600">Enter</kbd> to add a new line. <kbd className="font-sans border rounded px-1 py-0.5 bg-gray-200 dark:bg-gray-600">Ctrl+Enter</kbd> to send.
                </p>
            </form>
        </div>
    );
};
