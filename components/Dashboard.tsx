
import React, { useState, useEffect, useCallback } from 'react';
import { mockConsults, mockPatients } from '../services/mockData';
import type { Consult, Patient } from '../types';
import { Urgency } from '../types';
import { triageConsults, analyzePatient } from '../services/geminiService';
import { PatientCard } from './PatientCard';
import { Spinner } from './Spinner';

const UrgencyBadge: React.FC<{ urgency: Urgency }> = ({ urgency }) => {
    const colors = {
        [Urgency.HIGH]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        [Urgency.MEDIUM]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        [Urgency.LOW]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        [Urgency.UNKNOWN]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[urgency]}`}>{urgency}</span>
}

export const Dashboard: React.FC = () => {
    const [consults, setConsults] = useState<Consult[]>(mockConsults);
    const [patients, setPatients] = useState<Patient[]>(mockPatients);
    const [isTriageLoading, setIsTriageLoading] = useState(false);
    const [analyzingPatientId, setAnalyzingPatientId] = useState<number | null>(null);

    const runAITriage = useCallback(async () => {
        setIsTriageLoading(true);
        const results = await triageConsults(consults.filter(c => c.urgency === Urgency.UNKNOWN));
        if (results) {
            setConsults(prevConsults => prevConsults.map(c => {
                const updated = results.find((r: any) => r.id === c.id);
                if(updated) {
                    return {...c, urgency: updated.urgency, aiRationale: updated.rationale};
                }
                return c;
            }));
        }
        setIsTriageLoading(false);
    }, [consults]);

    const runPatientAnalysis = useCallback(async (patientId: number) => {
        setAnalyzingPatientId(patientId);
        const patientToAnalyze = patients.find(p => p.id === patientId);
        if (patientToAnalyze) {
            const result = await analyzePatient(patientToAnalyze);
            if (result) {
                setPatients(prevPatients => prevPatients.map(p => 
                    p.id === patientId 
                        ? { ...p, aiRecommendation: result.recommendation, reboundPainRisk: result.reboundPainRisk } 
                        : p
                ));
            }
        }
        setAnalyzingPatientId(null);
    }, [patients]);
    
    useEffect(() => {
        // Automatically run triage on initial load if there are unknown consults
        if (consults.some(c => c.urgency === Urgency.UNKNOWN)) {
            runAITriage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const highUrgencyConsults = consults.filter(c => c.urgency === Urgency.HIGH).length;
    const uncontrolledPainPatients = patients.filter(p => p.vitals[p.vitals.length -1].painScore > 7).length;

    return (
        <div className="p-4 md:p-6 lg:p-8 space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">APS Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Real-time patient monitoring and AI-powered insights.</p>
            </header>

            <section id="alerts" className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-500/10 dark:bg-red-500/20 border border-red-500/30 text-red-800 dark:text-red-200 p-4 rounded-lg">
                    <h3 className="font-bold">High Urgency Consults</h3>
                    <p className="text-2xl font-mono">{highUrgencyConsults}</p>
                </div>
                <div className="bg-yellow-500/10 dark:bg-yellow-500/20 border border-yellow-500/30 text-yellow-800 dark:text-yellow-200 p-4 rounded-lg">
                    <h3 className="font-bold">Uncontrolled Pain</h3>
                    <p className="text-2xl font-mono">{uncontrolledPainPatients}</p>
                </div>
                <div className="bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/30 text-blue-800 dark:text-blue-200 p-4 rounded-lg">
                    <h3 className="font-bold">New Block Candidates</h3>
                    <p className="text-2xl font-mono">{patients.filter(p => p.isBlockCandidate).length}</p>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <section id="consult-queue" className="lg:col-span-1 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Live Consult Queue</h2>
                        <button 
                            onClick={runAITriage} 
                            disabled={isTriageLoading}
                            className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline disabled:opacity-50"
                        >
                            {isTriageLoading ? 'Triaging...' : 'Re-Triage'}
                        </button>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 space-y-4">
                         {isTriageLoading && !consults.some(c => c.urgency !== Urgency.UNKNOWN) && <div className="flex justify-center p-8"><Spinner /></div>}
                        {consults.sort((a,b) => {
                                const order = { [Urgency.HIGH]: 1, [Urgency.MEDIUM]: 2, [Urgency.LOW]: 3, [Urgency.UNKNOWN]: 4 };
                                return order[a.urgency] - order[b.urgency];
                            }).map(consult => (
                                <div key={consult.id} className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-gray-800 dark:text-gray-200">{consult.patientName}</p>
                                        <UrgencyBadge urgency={consult.urgency} />
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{consult.reason}</p>
                                    {consult.aiRationale && <p className="text-xs italic text-indigo-500 dark:text-indigo-400 mt-1">AI: {consult.aiRationale}</p>}
                                </div>
                            ))}
                    </div>
                </section>

                <section id="patient-list" className="lg:col-span-2 space-y-4">
                     <h2 className="text-xl font-bold text-gray-900 dark:text-white">Patient List</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {patients.map(patient => (
                            <PatientCard 
                                key={patient.id} 
                                patient={patient}
                                isAnalyzing={analyzingPatientId === patient.id}
                                onAnalyze={runPatientAnalysis}
                            />
                        ))}
                     </div>
                </section>
            </div>
        </div>
    );
};
