import { Timestamp } from 'firebase/firestore';

export interface PearlUser {
    uid: string;
    pearlUserId: number;
    displayName: string;
    email: string;
    role: 'tourist' | 'tourGuide';
}

export interface Chat {
    id: string;
    participants: string[];
    participantInfo: { [key: string]: { displayName: string; pearlUserId: number; } };
    lastMessage: string;
    lastUpdated: Timestamp;
}

export interface Message {
    id: string;
    text: string;
    senderId: string;
    createdAt: Timestamp;
}