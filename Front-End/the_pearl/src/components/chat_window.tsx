/*
"use client";

import { useState, useEffect, useRef } from 'react';
import { db } from '@/utils/firebase';
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp,
    doc,
    updateDoc,
} from 'firebase/firestore';
import { Message, PearlUser, Chat } from '@/utils/firestore';

export interface ChatContact extends Pick<Chat, 'id' | 'participantInfo'> {}

interface ChatWindowProps {
    contacts: ChatContact[];
    contactListTitle: string;
    currentUser: PearlUser | null;
}

export default function ChatWindow({ contacts, contactListTitle, currentUser }: ChatWindowProps) {
    const [activeChat, setActiveChat] = useState<ChatContact | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (!activeChat) {
            setMessages([]);
            return;
        }

        const messagesRef = collection(db, 'chats', activeChat.id, 'messages');
        const q = query(messagesRef, orderBy('createdAt', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedMessages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...(doc.data() as Omit<Message, 'id'>),
            }));
            setMessages(fetchedMessages);
        });

        return () => unsubscribe();
    }, [activeChat]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !activeChat || !currentUser) return;

        try {
            const messagesRef = collection(db, 'chats', activeChat.id, 'messages');
            await addDoc(messagesRef, {
                text: newMessage,
                senderId: currentUser.uid,
                createdAt: serverTimestamp(),
            });

            const chatDocRef = doc(db, 'chats', activeChat.id);
            await updateDoc(chatDocRef, {
                lastMessage: newMessage,
                lastUpdated: serverTimestamp(),
            });

            setNewMessage('');
        } catch (error) {
            console.error("Error sending message: ", error);
        }
    };

    const getOtherParticipantName = (chat: ChatContact) => {
        if (!currentUser || !chat.participantInfo) return "Chat";
        const otherUserId = Object.keys(chat.participantInfo).find(uid => uid !== currentUser.uid);
        return otherUserId ? chat.participantInfo[otherUserId].displayName : "Unknown User";
    };

    return (
        <div className="flex h-[calc(100vh-12rem)] w-full gap-6">
            {/!* Left Panel: Contact List *!/}
            <div className="w-1/3 flex-shrink-0 rounded-lg bg-white p-4 shadow-lg">
                <h2 className="mb-4 text-xl font-bold text-gray-800">{contactListTitle}</h2>
                <div className="flex flex-col gap-2">
                    {/!* --- CHANGE STARTS HERE --- *!/}
                    {contacts.length > 0 ? (
                        contacts.map((contact) => (
                            <button
                                key={contact.id}
                                onClick={() => setActiveChat(contact)}
                                className={`w-full rounded-lg p-3 text-left text-lg font-medium transition-colors ${
                                    activeChat?.id === contact.id
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {getOtherParticipantName(contact)}
                            </button>
                        ))
                    ) : (
                        <p className="mt-4 text-center text-gray-500">
                            No chats found.
                        </p>
                    )}
                    {/!* --- CHANGE ENDS HERE --- *!/}
                </div>
            </div>

            {/!* Right Panel: Chat Window *!/}
            <div className="flex w-2/3 flex-col rounded-lg bg-white shadow-lg">
                {activeChat && currentUser ? (
                    <>
                        {/!* Chat Header *!/}
                        <div className="rounded-t-lg bg-purple-600 p-4 text-white">
                            <h2 className="text-xl font-bold">Chat With {getOtherParticipantName(activeChat)}</h2>
                        </div>

                        {/!* Messages Area *!/}
                        <div className="flex-grow space-y-4 overflow-y-auto p-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.senderId === currentUser.uid ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-md rounded-2xl px-4 py-2 ${
                                            msg.senderId === currentUser.uid
                                                ? 'rounded-br-none bg-purple-500 text-white'
                                                : 'rounded-bl-none bg-gray-200 text-gray-800'
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/!* Message Input Form *!/}
                        <form onSubmit={handleSendMessage} className="border-t p-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="w-full rounded-full border bg-gray-50 py-3 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 text-purple-600 transition-transform hover:scale-110">
                                        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-xl text-gray-400">Select a chat to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
}*/

"use client";

import { useState, useEffect, useRef } from 'react';

const dummyMessages = {
    chat_1: [
        { id: 'm1', text: 'Hello! I am interested in the tour of Sigiriya.', senderId: 'tourist_user_123', createdAt: new Date() },
        { id: 'm2', text: 'Hi Jane, absolutely! When are you planning to visit?', senderId: 'guide_user_456', createdAt: new Date() },
        { id: 'm3', text: 'Sometime next week. What is the best time to go?', senderId: 'tourist_user_123', createdAt: new Date() },
    ],
    chat_2: [
        { id: 'm4', text: 'Hi, can you tell me more about the wildlife safari?', senderId: 'tourist_user_abc', createdAt: new Date() },
    ],
    chat_3: [],
};

export default function ChatWindow({ contacts, contactListTitle, currentUser }) {
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [aiMessage, setAiMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (activeChat) {
            setMessages(dummyMessages[activeChat.id] || []);
        } else {
            setMessages([]);
        }
    }, [activeChat]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !activeChat || !currentUser) return;

        const messageToSend = {
            id: `msg_${Date.now()}`,
            text: newMessage,
            senderId: currentUser.uid,
            createdAt: new Date(),
        };

        setMessages(prevMessages => [...prevMessages, messageToSend]);
        setNewMessage('');
    };

    const handleSendAiMessage = (e) => {
        e.preventDefault();
        if (aiMessage.trim() === '') return;
        console.log("Sending to AI:", aiMessage);
        setAiMessage('');
    };

    const getOtherParticipantName = (chat) => {
        if (!currentUser || !chat.participantInfo) return "Chat";
        const otherUserId = Object.keys(chat.participantInfo).find(uid => uid !== currentUser.uid);
        return otherUserId ? chat.participantInfo[otherUserId].displayName : "Unknown User";
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gray-100">
            <div className="h-[80vh] w-full max-w-6xl flex flex-col rounded-lg shadow-2xl overflow-hidden">
                <div className="h-[35px] w-full flex-shrink-0 bg-purple-600"></div>

                <div className="flex flex-grow bg-white p-6 gap-6 overflow-hidden">
                    <div className="flex w-1/3 flex-shrink-0 flex-col">
                        <h2 className="mb-4 text-xl font-bold text-gray-800">{contactListTitle}</h2>
                        <div className="flex-grow overflow-y-auto pr-2">
                            <div className="flex flex-col gap-2">
                                {contacts.length > 0 ? (
                                    contacts.map((contact) => (
                                        <button
                                            key={contact.id}
                                            onClick={() => setActiveChat(contact)}
                                            className={`w-full rounded-lg p-3 text-left text-lg font-medium transition-colors ${
                                                activeChat?.id === contact.id
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            {getOtherParticipantName(contact)}
                                        </button>
                                    ))
                                ) : (
                                    <p className="mt-4 text-center text-gray-500">No chats found.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex w-2/3 flex-col border rounded-lg overflow-hidden">
                        {activeChat && currentUser ? (
                            <>
                                <div className="flex-shrink-0 bg-gray-50 p-4 border-b">
                                    <h2 className="text-xl font-bold text-gray-800">Chat With {getOtherParticipantName(activeChat)}</h2>
                                </div>

                                <div className="flex-grow space-y-4 overflow-y-auto p-4 bg-white">
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.senderId === currentUser.uid ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-md rounded-2xl px-4 py-2 ${
                                                    msg.senderId === currentUser.uid
                                                        ? 'rounded-br-none bg-purple-500 text-white'
                                                        : 'rounded-bl-none bg-gray-200 text-gray-800'
                                                }`}
                                            >
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>

                                <form onSubmit={handleSendMessage} className="flex-shrink-0 border-t p-4 bg-gray-50">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type your message..."
                                            className="w-full rounded-full border bg-white py-3 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                        <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 text-purple-600 transition-transform hover:scale-110">
                                                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                                            </svg>
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className="flex h-full items-center justify-center bg-white">
                                <p className="text-xl text-gray-400">Select a chat to start messaging</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-shrink-0 bg-white p-4 border-t">
                    <form onSubmit={handleSendAiMessage}>
                        <div className="relative">
                            <input
                                type="text"
                                value={aiMessage}
                                onChange={(e) => setAiMessage(e.target.value)}
                                placeholder="Ask the AI Assistant..."
                                className="w-full rounded-full border bg-gray-50 py-3 pl-5 pr-28 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button type="submit" className="absolute inset-y-0 right-0 my-1.5 mr-1.5 flex items-center rounded-full bg-purple-600 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-purple-700">
                                Send
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}