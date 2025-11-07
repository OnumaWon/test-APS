
import React from 'react';
import type { Patient } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
// Fix: Import Spinner component to resolve 'Cannot find name 'Spinner'' error.
import { Spinner } from './Spinner';

interface PatientCardProps {
    patient: Patient;
    isAnalyzing: boolean;
    onAnalyze: (patientId: number) => void;
}

const TrendIcon: React.FC<{ trend: 'up' | 'down' | 'stable' }> = ({ trend }) => {
    if (trend === 'up') return <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-3.75-.625m3.75.625V3.375" className="text-red-500" />;
    if (trend === 'down') return <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.511l-6.364-2.182" className="text-green-500" />;
    return <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" className="text-yellow-500" />;
};

export const PatientCard: React.FC<PatientCardProps> = ({ patient, isAnalyzing, onAnalyze }) => {
    const latestVital = patient.vitals[patient.vitals.length - 1];

    const painColor = latestVital.painScore > 6 ? 'text-red-500' : latestVital.painScore > 3 ? 'text-yellow-500' : 'text-green-500';

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col space-y-4">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{patient.name}, {patient.age}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{patient.procedure}</p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <span>Pain Trend</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <TrendIcon trend={patient.painTrend} />
                    </svg>
                </div>
            </div>

            <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={patient.vitals} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis dataKey="time" tick={{ fill: 'rgb(107 114 128)', fontSize: 12 }} />
                        <YAxis yAxisId="left" domain={[0, 10]} tick={{ fill: 'rgb(239 68 68)', fontSize: 12 }} />
                        <YAxis yAxisId="right" orientation="right" domain={[0, 24]} tick={{ fill: 'rgb(59 130 246)', fontSize: 12 }}/>
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: 'none' }} />
                        <Line yAxisId="left" type="monotone" dataKey="painScore" stroke="#ef4444" strokeWidth={2} name="Pain" dot={false} />
                        <Line yAxisId="right" type="monotone" dataKey="respiratoryRate" stroke="#3b82f6" strokeWidth={2} name="Resp Rate" dot={false}/>
                    </LineChart>
                </ResponsiveContainer>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400"><span className="font-semibold">Plan:</span> {patient.analgesiaPlan}</p>
            
            {patient.isBlockCandidate && <span className="text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 py-1 px-2 rounded-full self-start">New Block Candidate</span>}
            
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg mt-2">
                {patient.aiRecommendation ? (
                    <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">AI Recommendation:</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{patient.aiRecommendation}</p>
                        {patient.reboundPainRisk && <p className="text-sm text-gray-600 dark:text-gray-300 mt-1"><span className="font-semibold">Rebound Pain Risk:</span> {patient.reboundPainRisk}</p>}
                    </div>
                ) : (
                    <button 
                        onClick={() => onAnalyze(patient.id)} 
                        disabled={isAnalyzing}
                        className="w-full flex items-center justify-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 disabled:opacity-50 disabled:cursor-wait"
                    >
                        {isAnalyzing ? (
                            <>
                                <Spinner size="sm" />
                                <span className="ml-2">Analyzing...</span>
                            </>
                        ) : (
                           'Analyze & Recommend'
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};
