"use client";

import { useState, useRef, useEffect } from 'react';
import { FiX, FiSend } from 'react-icons/fi';

type Message = {
    text: string;
    sender: 'user' | 'bot';
};

type WandyChatProps = {
    onClose: () => void;
};

export default function WandyChat({ onClose }: WandyChatProps) {
    const [messages, setMessages] = useState<Message[]>([
        { text: "Hi, I am Wandy. How can I help you plan your trip?", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const userMessage = inputValue.trim();
        if (!userMessage || isLoading) return;

        setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:8004/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: userMessage }),
            });

            if (!response.ok) {
                throw new Error("Sorry, I couldn't get a response. Please try again.");
            }

            const data = await response.json();
            setMessages(prev => [...prev, { text: data.answer, sender: 'bot' }]);

        } catch (error: any) {
            setMessages(prev => [...prev, { text: error.message, sender: 'bot' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50">
            <header className="flex items-center justify-between p-4 bg-violet-600 text-white rounded-t-2xl">
                <h2 className="text-xl font-semibold">Ask From Wandy</h2>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-violet-700">
                    <FiX size={24} />
                </button>
            </header>

            <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs px-4 py-2 rounded-xl ${
                                msg.sender === 'user'
                                    ? 'bg-violet-500 text-white'
                                    : 'bg-gray-200 text-gray-800'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="max-w-xs px-4 py-2 rounded-xl bg-gray-200 text-gray-500">
                                Typing...
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <footer className="p-4 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask something..."
                        className="flex-1 w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-violet-500 focus:border-violet-500"
                    />
                    <button type="submit" disabled={isLoading} className="p-3 bg-violet-600 text-white rounded-full hover:bg-violet-700 disabled:bg-gray-400">
                        <FiSend size={20} />
                    </button>
                </form>
            </footer>
        </div>
    );
}