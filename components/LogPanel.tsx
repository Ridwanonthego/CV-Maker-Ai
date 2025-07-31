
import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { Icon } from './Icon';

interface LogPanelProps {
    logs: LogEntry[];
}

const LogIcon: React.FC<{ type: LogEntry['type'] }> = ({ type }) => {
    switch (type) {
        case 'success':
            return <Icon path="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-5 h-5 text-green-500" />;
        case 'error':
            return <Icon path="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" className="w-5 h-5 text-red-500" />;
        case 'info':
        default:
            return <Icon path="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" className="w-5 h-5 text-gray-400" />;
    }
};

const getLogTextColor = (type: LogEntry['type']) => {
    switch (type) {
        case 'success': return 'text-green-700';
        case 'error': return 'text-red-700';
        case 'info':
        default: return 'text-gray-600';
    }
};


export const LogPanel: React.FC<LogPanelProps> = ({ logs }) => {
    const logContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);
    
    return (
        <div className="h-full bg-white p-4 md:p-6 flex flex-col">
            <h2 className="flex-shrink-0 text-lg font-bold text-gray-800 mb-3 border-b-2 border-black pb-2">
                Logs
            </h2>
            {logs.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-400">
                    <Icon path="M3.75 9.75h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" className="w-10 h-10 mb-3"/>
                    <p className="text-xs font-medium">Logs will appear here.</p>
                </div>
            ) : (
                <div ref={logContainerRef} className="flex-grow overflow-y-auto -mr-2 pr-2 space-y-3">
                    {logs.map((log, index) => (
                        <div key={index} className="flex items-start gap-2.5 text-xs">
                           <div className="flex-shrink-0 mt-0.5">
                             <LogIcon type={log.type} />
                           </div>
                           <div className="flex-grow">
                             <p className={`font-mono text-gray-400`} style={{ fontSize: '0.65rem', lineHeight: '1rem' }}>{log.timestamp.toLocaleTimeString()}</p>
                             <p className={`leading-tight ${getLogTextColor(log.type)}`}>{log.message}</p>
                           </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
