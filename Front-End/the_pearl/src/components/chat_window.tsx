"use client";

import { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { FiSend } from 'react-icons/fi';

const firebaseConfig = {
    apiKey: "AIzaSyDR1TubACNZnWcVGotjVehzZpDFebnOfOk",
    authDomain: "the-pearl-app.firebaseapp.com",
    projectId: "the-pearl-app",
    storageBucket: "the-pearl-app.firebasestorage.app",
    messagingSenderId: "298308275070",
    appId: "1:298308275070:web:c5daabdf1bacb23200c12f",
    measurementId: "G-PXKLNHNEG4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

type Message = {
    id?: string;
    text: string;
    senderId: string;
    senderName: string;
    timestamp: any;
};

export type ChatPartner = {
    id: string;
    name: string;
    details?: string;
};

type ChatWindowProps = {
    contacts: ChatPartner[];
    contactListTitle: string;
    currentUserName: string;
};

export default function ChatWindow({ contacts, contactListTitle, currentUserName }: ChatWindowProps) {
    const [user, setUser] = useState<User | null>(null);
    const [selectedContact, setSelectedContact] = useState<ChatPartner | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        signInAnonymously(auth).catch(error => console.error("Anonymous sign-in failed:", error));
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (contacts.length > 0 && !selectedContact) {
            setSelectedContact(contacts[0]);
        }
    }, [contacts, selectedContact]);

    useEffect(() => {
        if (user && selectedContact) {
            const chatId = [user.uid, selectedContact.id].sort().join('_');
            const messagesRef = collection(db, 'chats', chatId, 'messages');
            const q = query(messagesRef, orderBy('timestamp'));

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const msgs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
                setMessages(msgs);
            });
            return () => unsubscribe();
        }
    }, [user, selectedContact]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !selectedContact || newMessage.trim() === '') return;
        const chatId = [user.uid, selectedContact.id].sort().join('_');
        const messagesRef = collection(db, 'chats', chatId, 'messages');
        await addDoc(messagesRef, {
            text: newMessage,
            senderId: user.uid,
            senderName: currentUserName,
            timestamp: serverTimestamp(),
        });
        setNewMessage('');
    };

    if (!user) {
        return <div className="flex items-center justify-center h-screen">Connecting to Chat...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div className="md:col-span-1 lg:col-span-1 bg-white rounded-xl shadow-md border border-gray-200 p-6 h-[80vh] flex flex-col">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{contactListTitle}</h2>
                <div className="space-y-3 overflow-y-auto">
                    {contacts.map(contact => (
                        <button
                            key={contact.id}
                            onClick={() => setSelectedContact(contact)}
                            className={`w-full text-left p-4 rounded-lg transition-colors ${selectedContact?.id === contact.id ? 'bg-violet-100 text-violet-800 font-semibold' : 'hover:bg-gray-100'}`}
                        >
                            {contact.name}
                            {contact.details && <span className="text-sm text-gray-500 ml-2">- {contact.details}</span>}
                        </button>
                    ))}
                </div>
            </div>

            <div className="md:col-span-2 lg:col-span-3 bg-white rounded-xl shadow-md border border-gray-200 h-[80vh] flex flex-col">
                {selectedContact ? (
                    <>
                        <header className="bg-violet-600 text-white p-4 rounded-t-xl">
                            <h3 className="text-xl font-semibold">Chat With {selectedContact.name} {selectedContact.details && `from ${selectedContact.details}`}</h3>
                        </header>
                        <main className="flex-1 p-6 overflow-y-auto space-y-2">
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex flex-col ${msg.senderId === user.uid ? 'items-end' : 'items-start'}`}>
                                    {msg.senderId !== user.uid && (
                                        <span className="text-xs text-gray-500 ml-3 mb-1">{msg.senderName}</span>
                                    )}
                                    <p className={`max-w-lg px-4 py-2 rounded-2xl ${msg.senderId === user.uid ? 'bg-violet-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                        {msg.text}
                                    </p>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </main>
                        <footer className="p-4 border-t">
                            <form onSubmit={handleSendMessage} className="relative">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="w-full py-3 pl-4 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-500"
                                />
                                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-violet-600 rounded-full hover:bg-violet-100">
                                    <FiSend size={24} />
                                </button>
                            </form>
                        </footer>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <p>Select a contact to start chatting.</p>
                    </div>
                )}
            </div>
        </div>
    );
}