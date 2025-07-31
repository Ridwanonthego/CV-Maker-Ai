import React from 'react';
import { CvRatingReport } from '../types';
import { Icon } from './Icon';
import Spinner from './Spinner';

interface RatingModalProps {
    report: CvRatingReport | null;
    isLoading: boolean;
    onClose: () => void;
}

const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
    const getScoreColor = () => {
        if (score >= 8.5) return 'bg-emerald-500 border-emerald-700';
        if (score >= 7) return 'bg-yellow-400 border-yellow-600';
        return 'bg-red-500 border-red-700';
    };

    return (
        <div className={`w-32 h-32 rounded-full flex flex-col justify-center items-center text-white shadow-lg border-4 ${getScoreColor()}`}>
            <span className="text-5xl font-bold tracking-tighter">{score.toFixed(1)}</span>
            <span className="text-sm uppercase font-semibold tracking-wider">/ 10</span>
        </div>
    );
};

export const RatingModal: React.FC<RatingModalProps> = ({ report, isLoading, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 font-sans" onClick={onClose}>
            <div className="bg-white border-2 border-black shadow-[8px_8px_0px_#000] w-full max-w-3xl transform transition-all max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b-2 border-black sticky top-0 bg-white z-10">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900">CV Analysis Report</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-900">
                           <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6" />
                        </button>
                    </div>
                     <p className="text-sm text-gray-500 mt-1">AI-powered feedback from an expert recruiter's perspective.</p>
                </div>

                <div className="p-8 overflow-y-auto">
                    {isLoading && (
                         <div className="flex flex-col items-center justify-center h-64">
                            <Spinner />
                            <p className="mt-4 text-lg font-semibold text-gray-600">Analyzing your CV...</p>
                        </div>
                    )}
                    {report && (
                        <div className="space-y-8">
                            <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-gray-50 border-2 border-dashed border-gray-300">
                                <ScoreCircle score={report.score} />
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-800">Overall Feedback</h3>
                                    <p className="mt-2 text-gray-600">{report.overallFeedback}</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <h3 className="flex items-center gap-2 text-lg font-semibold text-emerald-700">
                                        <Icon path="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-6 h-6" />
                                        <span>Recruiter's Highlights (Pros)</span>
                                    </h3>
                                    <ul className="list-disc list-inside space-y-2 text-gray-700 pl-2">
                                        {report.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                                    </ul>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="flex items-center gap-2 text-lg font-semibold text-red-700">
                                        <Icon path="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" className="w-6 h-6" />
                                        <span>Points of Concern (Cons)</span>
                                    </h3>
                                     <ul className="list-disc list-inside space-y-2 text-gray-700 pl-2">
                                        {report.cons.map((con, i) => <li key={i}>{con}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                 <div className="p-6 border-t-2 border-black sticky bottom-0 bg-gray-50 z-10 text-right">
                     <button
                        onClick={onClose}
                        className="px-6 py-2 bg-indigo-600 text-white font-semibold border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                    >
                        Close Report
                    </button>
                </div>
            </div>
        </div>
    );
};