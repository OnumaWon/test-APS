import React from 'react';
import { mockPatients } from '../services/mockData';
import type { Patient } from '../types';

const StatusBadge: React.FC<{ trend: 'up' | 'down' | 'stable' }> = ({ trend }) => {
    const statusMap = {
        up: { text: 'Worsening', classes: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
        down: { text: 'Improving', classes: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
        stable: { text: 'Stable', classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
    };
    const { text, classes } = statusMap[trend];
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${classes}`}>{text}</span>;
};

export const PatientList: React.FC = () => {
    return (
        <div className="p-4 md:p-6 lg:p-8 space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Patient List</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Overview of all current patients under APS care.</p>
            </header>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Patient
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Age
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Procedure
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Status (Pain Trend)
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockPatients.map((patient: Patient) => (
                                <tr key={patient.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                                                <span className="text-indigo-600 dark:text-indigo-300 font-semibold">
                                                    {patient.name.split(' ').map(n => n[0]).join('')}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="text-base font-semibold">{patient.name}</div>
                                                <div className="font-normal text-gray-500">ID: {patient.id}</div>
                                            </div>
                                        </div>
                                    </th>
                                    <td className="px-6 py-4">
                                        {patient.age}
                                    </td>
                                    <td className="px-6 py-4">
                                        {patient.procedure}
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge trend={patient.painTrend} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="font-medium text-indigo-600 dark:text-indigo-500 hover:underline">View Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
