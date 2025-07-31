
import React from 'react';
import { ApiKeyModalProps } from '../types';
import { Icon } from './Icon';

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div 
                className="bg-white border-2 border-black shadow-[8px_8px_0px_#000] w-full max-w-lg transform transition-all flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b-2 border-black">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900">How to Get Your Gemini API Key</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-900">
                           <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6" />
                        </button>
                    </div>
                     <p className="text-sm text-gray-500 mt-1">Follow these steps to enable the app.</p>
                </div>
                <div className="p-8">
                    <ol className="space-y-6">
                        <li className="flex items-start space-x-4">
                            <div className="flex-shrink-0 bg-indigo-100 text-indigo-700 font-bold w-8 h-8 flex items-center justify-center rounded-full border-2 border-indigo-200">1</div>
                            <div>
                                <h3 className="font-semibold text-lg text-gray-800">Create an AI Studio account</h3>
                                <p className="text-gray-600 mt-1">If you don't have one, you'll need to create an account with Google AI Studio. It's free and gives you access to the Gemini family of models.</p>
                                <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-sm font-bold text-indigo-600 hover:text-indigo-800">
                                    Go to Google AI Studio &rarr;
                                </a>
                            </div>
                        </li>
                        <li className="flex items-start space-x-4">
                            <div className="flex-shrink-0 bg-indigo-100 text-indigo-700 font-bold w-8 h-8 flex items-center justify-center rounded-full border-2 border-indigo-200">2</div>
                            <div>
                                <h3 className="font-semibold text-lg text-gray-800">Generate your API Key</h3>
                                <p className="text-gray-600 mt-1">Once logged in, navigate to the API key section and generate a new key. This key is your personal credential to use the service.</p>
                                <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-sm font-bold text-indigo-600 hover:text-indigo-800">
                                    Get Your API Key Here &rarr;
                                </a>
                            </div>
                        </li>
                         <li className="flex items-start space-x-4">
                            <div className="flex-shrink-0 bg-indigo-100 text-indigo-700 font-bold w-8 h-8 flex items-center justify-center rounded-full border-2 border-indigo-200">3</div>
                            <div>
                                <h3 className="font-semibold text-lg text-gray-800">Paste the Key</h3>
                                <p className="text-gray-600 mt-1">Copy the generated key and paste it into the "Gemini API Key" field in this app to unlock all features.</p>
                            </div>
                        </li>
                    </ol>
                </div>
                 <div className="p-6 border-t-2 border-black bg-gray-50 text-right">
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
