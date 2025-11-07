
import type { Patient, Consult, TeamMember } from '../types';
import { Urgency } from '../types';

export const mockPatients: Patient[] = [
    {
        id: 101,
        name: "John Doe",
        age: 45,
        procedure: "Total Knee Arthroplasty",
        painTrend: 'down',
        vitals: [
            { time: "4h ago", painScore: 7, sedationScore: 1, respiratoryRate: 16 },
            { time: "2h ago", painScore: 5, sedationScore: 1, respiratoryRate: 18 },
            { time: "Now", painScore: 4, sedationScore: 0, respiratoryRate: 18 },
        ],
        analgesiaPlan: "Femoral Nerve Block + PCA Morphine",
        isBlockCandidate: false,
    },
    {
        id: 102,
        name: "Jane Smith",
        age: 62,
        procedure: "Laparoscopic Cholecystectomy",
        painTrend: 'up',
        vitals: [
            { time: "4h ago", painScore: 4, sedationScore: 0, respiratoryRate: 18 },
            { time: "2h ago", painScore: 6, sedationScore: 1, respiratoryRate: 16 },
            { time: "Now", painScore: 8, sedationScore: 2, respiratoryRate: 14 },
        ],
        analgesiaPlan: "IV Acetaminophen + PO Oxycodone",
        isBlockCandidate: true,
    },
    {
        id: 103,
        name: "Peter Jones",
        age: 78,
        procedure: "Exploratory Laparotomy",
        painTrend: 'stable',
        vitals: [
            { time: "4h ago", painScore: 6, sedationScore: 2, respiratoryRate: 12 },
            { time: "2h ago", painScore: 6, sedationScore: 2, respiratoryRate: 12 },
            { time: "Now", painScore: 5, sedationScore: 1, respiratoryRate: 14 },
        ],
        analgesiaPlan: "Epidural Analgesia",
        isBlockCandidate: false,
    },
];

export const mockConsults: Consult[] = [
    { id: 1, patientId: 102, patientName: "Jane Smith", reason: "Uncontrolled post-op pain, high sedation.", time: "15m ago", urgency: Urgency.UNKNOWN },
    { id: 2, patientId: 101, patientName: "John Doe", reason: "PCA setting adjustment inquiry.", time: "45m ago", urgency: Urgency.UNKNOWN },
    { id: 3, patientId: 103, patientName: "Peter Jones", reason: "Epidural check, mild hypotension.", time: "1h ago", urgency: Urgency.UNKNOWN },
];

export const mockTeamMembers: TeamMember[] = [
    { id: 1, name: "Dr. Anya Sharma", location: "Floor 3 East" },
    { id: 2, name: "Dr. Ben Carter", location: "Floor 5 West" },
    { id: 3, name: "NP Chloe Davis", location: "Floor 3 West" },
];
