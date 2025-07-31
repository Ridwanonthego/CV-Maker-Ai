
import React from 'react';
import { TipsOverlayProps } from '../types';
import { Icon } from './Icon';

const tips = [
    {
        icon: "M6 3.75l6 6m0 0l6-6M12 9.75V21",
        title: "1. Switch Designs Instantly",
        description: "Your CV has been generated in three styles. Click the tabs at the top of the preview to switch between 'Modern', 'Classic', and 'Creative' designs."
    },
    {
        icon: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125",
        title: "2. Edit Text Directly",
        description: "Need to fix a typo or change a word? Click the 'Edit Text' button. You can then click directly on the CV text to make changes. Click 'Save Edits' when you are done."
    },
    {
        icon: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-4.991-2.695v-4.992m0 0h-4.992m4.992 0l-3.181-3.183a8.25 8.25 0 00-11.664 0l-3.181 3.183",
        title: "3. Refine with AI",
        description: "Use the text box at the bottom to ask the AI for changes. Try commands like 'Make my summary more impactful' or 'Add a project about a website I built'."
    },
    {
        icon: "M10.788 3.212a.75.75 0 011.06 0l.545.545a.75.75 0 001.06 0l.546-.545a.75.75 0 111.06 1.06l-.545.545a.75.75 0 000 1.06l.545.545a.75.75 0 11-1.06 1.06l-.546-.545a.75.75 0 00-1.06 0l-.545.545a.75.75 0 11-1.06-1.06l.545-.545a.75.75 0 000-1.06l-.545-.545a.75.75 0 010-1.06z",
        title: "4. Get a Recruiter's Feedback",
        description: "Click 'Rate My CV' to get an AI-powered analysis. It will score your CV out of 10 and give you pros, cons, and feedback from a recruiter's perspective."
    }
];

export const TipsOverlay: React.FC<TipsOverlayProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 animate-fade-in">
            <div className="bg-white border-2 border-black shadow-[8px_8px_0px_#000] w-full max-w-2xl transform transition-all max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b-2 border-black sticky top-0 bg-white z-10">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900">Your CVs are Ready!</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-900">
                           <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6" />
                        </button>
                    </div>
                     <p className="text-sm text-gray-500 mt-1">Here’s a quick guide to the powerful features at your fingertips.</p>
                </div>
                <div className="p-6">
                    <ul className="space-y-6">
                        {tips.map((tip, index) => (
                            <li key={index} className="flex items-start space-x-4">
                                <div className="flex-shrink-0 bg-indigo-100 border-2 border-indigo-200 p-3">
                                    <Icon path={tip.icon} className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-800">{tip.title}</h3>
                                    <p className="text-gray-600 mt-1">{tip.description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                 <div className="p-6 border-t-2 border-black sticky bottom-0 bg-gray-50 z-10 text-right">
                     <button
                        onClick={onClose}
                        className="px-6 py-2 bg-indigo-600 text-white font-semibold border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                    >
                        Got it, thanks!
                    </button>
                </div>
            </div>
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};
