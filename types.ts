
export enum Urgency {
    HIGH = 'High',
    MEDIUM = 'Medium',
    LOW = 'Low',
    UNKNOWN = 'Unknown'
}

export interface Vital {
    time: string;
    painScore: number;
    sedationScore: number;
    respiratoryRate: number;
}

export interface Patient {
    id: number;
    name: string;
    age: number;
    procedure: string;
    painTrend: 'up' | 'down' | 'stable';
    vitals: Vital[];
    analgesiaPlan: string;
    isBlockCandidate: boolean;
    aiRecommendation?: string;
    reboundPainRisk?: 'High' | 'Medium' | 'Low';
}

export interface Consult {
    id: number;
    patientId: number;
    patientName: string;
    reason: string;
    time: string;
    urgency: Urgency;
    aiRationale?: string;
}

export interface TeamMember {
    id: number;
    name: string;
    location: string;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
    thinking?: boolean;
}
