import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Chatbot } from './components/Chatbot';
import { SunIcon } from './components/icons/SunIcon';
import { MoonIcon } from './components/icons/MoonIcon';
import { ChevronDoubleLeftIcon } from './components/icons/ChevronDoubleLeftIcon';
import { UserCircleIcon } from './components/icons/UserCircleIcon';
import { DocumentTextIcon } from './components/icons/DocumentTextIcon';
import { PresentationChartLineIcon } from './components/icons/PresentationChartLineIcon';
import { ClipboardDocumentListIcon } from './components/icons/ClipboardDocumentListIcon';
import { PatientList } from './components/PatientList';

const DashboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 00-4-4H3V9h2a4 4 0 004-4V3h2a4 4 0 004 4h6v2h-6a4 4 0 00-4 4v2H9z" />
    </svg>
);

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

type View = 'dashboard' | 'chat' | 'patients' | 'reports' | 'operations' | 'procedures';

const PlaceholderView: React.FC<{ title: string }> = ({ title }) => (
    <div className="p-4 md:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">This is a placeholder for the {title} view. Content for this section is under development.</p>
    </div>
);

export default function App() {
    const [activeView, setActiveView] = useState<View>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (localStorage.getItem('theme') === 'dark') return true;
        if (localStorage.getItem('theme') === 'light') return false;
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const NavItem: React.FC<{ view: View, label: string, icon: React.ReactNode }> = ({ view, label, icon }) => (
        <button
            onClick={() => setActiveView(view)}
            className={`flex items-center p-3 rounded-lg w-full text-left transition-colors ${
                activeView === view
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            } ${isSidebarOpen ? 'space-x-3' : 'justify-center'}`}
        >
            {icon}
            <span className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0'}`}>
                {label}
            </span>
        </button>
    );

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <nav className={`flex flex-col p-4 bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                <div className="flex items-center gap-2 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="p-2 bg-indigo-600 rounded-lg flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20M1 12v7.5l4-2.222M23 12v7.5l-4-2.222M1 12l4 2.222M23 12l-4 2.222" />
                        </svg>
                    </div>
                    <h1 className={`text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0'}`}>
                        APS AI
                    </h1>
                </div>
                <div className="mt-6 space-y-2 flex-grow">
                    <NavItem view="dashboard" label="Dashboard" icon={<DashboardIcon />} />
                    <NavItem view="patients" label="Patient List" icon={<UserCircleIcon />} />
                    <NavItem view="reports" label="Reports" icon={<DocumentTextIcon />} />
                    <NavItem view="operations" label="Operations" icon={<PresentationChartLineIcon />} />
                    <NavItem view="procedures" label="Procedures" icon={<ClipboardDocumentListIcon />} />
                    <NavItem view="chat" label="AI Assistant" icon={<ChatIcon />} />
                </div>
                <div className="flex flex-col gap-2">
                    <div className={`text-center text-xs text-gray-400 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                         <p>&copy; 2024. For demonstration purposes only.</p>
                    </div>
                    <button
                        onClick={toggleSidebar}
                        className="flex items-center p-3 rounded-lg w-full text-left text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                    >
                       <ChevronDoubleLeftIcon className={`transition-transform duration-300 ${!isSidebarOpen && 'rotate-180'}`} />
                        <span className={`ml-3 font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0'}`}>
                            Collapse
                        </span>
                    </button>
                </div>
            </nav>
            <main className="flex-1 overflow-y-auto relative">
                <div className="absolute top-4 right-6 z-10">
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        aria-label="Toggle dark mode"
                    >
                        {isDarkMode ? <SunIcon /> : <MoonIcon />}
                    </button>
                </div>

                {activeView === 'dashboard' && <Dashboard />}
                {activeView === 'patients' && <PatientList />}
                {activeView === 'reports' && <PlaceholderView title="Reports" />}
                {activeView === 'operations' && <PlaceholderView title="Operations" />}
                {activeView === 'procedures' && <PlaceholderView title="Procedures" />}
                {activeView === 'chat' && (
                    <div className="p-4 md:p-6 lg:p-8 h-full">
                        <Chatbot />
                    </div>
                )}
            </main>
        </div>
    );
}