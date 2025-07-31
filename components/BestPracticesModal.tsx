import React from 'react';
import { Icon } from './Icon';

interface BestPracticesModalProps {
    onClose: () => void;
}

const practices = [
    {
        title: "Tailor for the Job",
        description: "Customize your CV for each application. Highlight the skills and experiences most relevant to the job description. Use keywords from the posting.",
        icon: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
    },
    {
        title: "Quantify Your Achievements",
        description: "Instead of listing duties, showcase results. Use numbers and data to demonstrate your impact. For example, 'Increased sales by 20%' is better than 'Responsible for sales'.",
        icon: "M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-3.75-.625m3.75.625l-6.25 3.75"
    },
    {
        title: "Use Action Verbs",
        description: "Start bullet points with strong action verbs. Words like 'Led', 'Managed', 'Developed', 'Engineered', and 'Architected' are more powerful than passive phrases.",
        icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
    },
    {
        title: "Keep it Clean and Concise",
        description: "Aim for a one-page CV if you have less than 10 years of experience. Use clear headings, bullet points, and ample white space for readability. Proofread meticulously.",
        icon: "M3.75 9.75h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
    }
];

export const BestPracticesModal: React.FC<BestPracticesModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white border-2 border-black shadow-[8px_8px_0px_#000] w-full max-w-2xl transform transition-all max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b-2 border-black sticky top-0 bg-white z-10">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900">CV Best Practices</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-900">
                           <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6" />
                        </button>
                    </div>
                     <p className="text-sm text-gray-500 mt-1">Expert advice to guarantee your CV gets noticed.</p>
                </div>
                <div className="p-6">
                    <ul className="space-y-6">
                        {practices.map((practice, index) => (
                            <li key={index} className="flex items-start space-x-4">
                                <div className="flex-shrink-0 bg-white border-2 border-black p-3">
                                    <Icon path={practice.icon} className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-800">{practice.title}</h3>
                                    <p className="text-gray-600 mt-1">{practice.description}</p>
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
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
};