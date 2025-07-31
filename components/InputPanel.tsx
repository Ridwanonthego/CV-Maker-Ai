
import React from 'react';
import { InputPanelProps, colorThemes } from '../types';
import Spinner from './Spinner';
import { Icon } from './Icon';

export const InputPanel: React.FC<InputPanelProps> = ({
  apiKey,
  setApiKey,
  rawInfo,
  setRawInfo,
  imageUrl,
  setImageUrl,
  colorTheme,
  setColorTheme,
  handleGenerate,
  isLoading,
  isFormatting,
  handleFormat
}) => {
  return (
    <div className="h-full bg-white p-6 md:p-8 flex flex-col space-y-6 overflow-y-auto">
      <div className="space-y-3">
        <label htmlFor="api-key" className="block text-sm font-bold text-gray-700">
          Gemini API Key <span className="font-normal text-gray-500">(Required)</span>
        </label>
        <input
          type="password"
          id="api-key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Paste your API key here to begin"
          className="w-full p-3 border-2 border-black bg-gray-900 text-white focus:border-indigo-500 focus:ring-0 placeholder-gray-400"
        />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center mb-2">
            <label htmlFor="raw-info" className="block text-sm font-bold text-gray-700">
                Brain Dump
            </label>
            <button
                onClick={handleFormat}
                disabled={isFormatting || isLoading || !rawInfo || !apiKey}
                className="flex items-center gap-2 px-3 py-1 text-xs font-semibold text-indigo-700 bg-indigo-100 border-2 border-indigo-200 rounded-md hover:bg-indigo-200 transition-all disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none"
                >
                {isFormatting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-700"></div>
                ) : (
                    <Icon path="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.572a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" className="w-4 h-4" />
                )}
                <span>{isFormatting ? 'Formatting...' : 'Format & Clean'}</span>
            </button>
        </div>
        <textarea
          id="raw-info"
          rows={10}
          value={rawInfo}
          onChange={(e) => setRawInfo(e.target.value)}
          placeholder="Paste all your information here: job history, skills, education, projects, contact details, career goals, etc. Don't worry about formatting, the AI will handle it."
          className="w-full p-4 border-2 border-black bg-gray-900 text-white focus:border-indigo-500 focus:ring-0 placeholder-gray-400"
        />
      </div>

      <div className="space-y-3">
        <label htmlFor="image-url" className="block text-sm font-medium text-gray-700">
          Profile Image URL
        </label>
        <input
          type="url"
          id="image-url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/your-photo.jpg"
          className="w-full p-3 border-2 border-black bg-gray-900 text-white focus:border-indigo-500 focus:ring-0 placeholder-gray-400"
        />
      </div>
      
       <div className="space-y-3">
        <label className="block text-sm font-bold text-gray-700">
            Color Theme
        </label>
        <div className="flex flex-wrap gap-3">
            {Object.entries(colorThemes).map(([name, theme]) => (
                <button 
                    key={name}
                    onClick={() => setColorTheme(name)}
                    className={`w-10 h-10 transition-all duration-200 border-2 ${colorTheme === name ? 'border-indigo-600 border-4' : 'border-black'}`}
                    aria-label={`Select ${name} theme`}
                >
                    <div className={`w-full h-full ${theme.main}`}></div>
                </button>
            ))}
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isLoading || isFormatting || !rawInfo || !apiKey}
        className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-indigo-600 text-white font-bold border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0"
      >
        {isLoading ? (
          <>
            <Spinner />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <Icon path="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 22.5l-.648-1.938a2.25 2.25 0 01-1.476-1.476L12 18.75l1.938-.648a2.25 2.25 0 011.476-1.476L16.25 15l.648 1.938a2.25 2.25 0 011.476 1.476L20.25 18.75l-1.938.648a2.25 2.25 0 01-1.476 1.476z" />
            <span>Generate CV</span>
          </>
        )}
      </button>
    </div>
  );
};
