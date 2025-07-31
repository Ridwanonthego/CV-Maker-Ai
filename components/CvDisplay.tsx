
import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CvDisplayProps, GeneratedCv } from '../types';
import Spinner from './Spinner';
import { Icon } from './Icon';

const JobSuggestions: React.FC<{ suggestions: string[] }> = ({ suggestions }) => (
    <div className="mt-4 p-4 bg-gray-50 border-2 border-dashed border-gray-300">
        <h3 className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wider">
            <Icon path="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" className="w-5 h-5" />
            <span>Suggested Roles</span>
        </h3>
        <p className="text-xs text-gray-500 mb-3">This CV is a good fit for these types of positions:</p>
        <div className="flex flex-wrap gap-2">
            {suggestions.map((job, index) => (
                <span key={index} className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                    {job}
                </span>
            ))}
        </div>
    </div>
);

const DesignSwitcher: React.FC<{
    cvs: GeneratedCv[];
    activeIndex: number;
    onSelect: (index: number) => void;
}> = ({ cvs, activeIndex, onSelect }) => (
    <div className="flex border-b-2 border-black">
        {cvs.map((cv, index) => (
            <button
                key={index}
                onClick={() => onSelect(index)}
                className={`flex-1 p-3 text-center font-bold text-sm uppercase tracking-wider transition-colors duration-200 ${
                    activeIndex === index 
                    ? 'bg-black text-white' 
                    : 'bg-gray-200 text-black hover:bg-gray-300'
                }`}
            >
                {cv.style}
            </button>
        ))}
    </div>
);

export const CvDisplay: React.FC<CvDisplayProps> = ({
  generatedCvs,
  activeCvIndex,
  setActiveCvIndex,
  editPrompt,
  setEditPrompt,
  handleRefine,
  isLoading,
  error,
  onCvUpdate,
  handleRateCv,
  isRating,
}) => {
  const [isDirectEditing, setIsDirectEditing] = useState(false);
  const cvContentRef = useRef<HTMLDivElement>(null);
  const activeCv = activeCvIndex !== null ? generatedCvs[activeCvIndex] : null;
  
  const handleDownloadPdf = () => {
    if(isDirectEditing) setIsDirectEditing(false);
    
    const cvElement = cvContentRef.current?.firstChild as HTMLElement;
    const personName = activeCv?.name;

    if (!cvElement || !personName) {
        console.error("CV content not found for PDF generation.");
        return;
    }
    
    const originalBg = cvElement.style.backgroundColor;
    cvElement.style.backgroundColor = '#ffffff';

    html2canvas(cvElement, { scale: 2.5, useCORS: true, logging: false })
      .then(canvas => {
        cvElement.style.backgroundColor = originalBg;

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const ratio = canvas.height / canvas.width;
        let position = 0;
        let heightLeft = pdfWidth * ratio;

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, heightLeft);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
          position = heightLeft - (pdfWidth * ratio);
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfWidth * ratio);
          heightLeft -= pdfHeight;
        }
        
        pdf.save(`CV-${personName.replace(/\s+/g, '-')}.pdf`);
      }).catch(err => {
        console.error("Error generating PDF:", err);
        cvElement.style.backgroundColor = originalBg;
      });
  };

 useEffect(() => {
    const wrapper = cvContentRef.current;
    if (!wrapper) return;
    const cvElement = wrapper.firstChild as HTMLElement;
    if (!cvElement) return;

    cvElement.setAttribute('contentEditable', String(isDirectEditing));

    if (isDirectEditing) {
      cvElement.classList.add('ring-2', 'ring-indigo-400', 'focus:outline-none');
      
      const styleEl = document.createElement('style');
      styleEl.id = 'cv-edit-styles';
      styleEl.innerHTML = `
          .skill-pill-deletable:hover::after {
              content: '×'; position: absolute; top: -5px; right: -5px; width: 20px; height: 20px;
              border-radius: 9999px; background-color: #ef4444; color: white; display: flex;
              align-items: center; justify-content: center; font-weight: bold; font-size: 14px;
              line-height: 20px; cursor: pointer; user-select: none;
          }`;
      document.head.appendChild(styleEl);

      const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (getComputedStyle(target, '::after').content === '"×"') {
          const pill = target.closest('.skill-pill-deletable');
          if (pill) {
            e.preventDefault(); e.stopPropagation();
            pill.remove();
          }
        }
      };
      
      wrapper.addEventListener('click', handleClick);
      return () => {
        wrapper.removeEventListener('click', handleClick);
        document.getElementById('cv-edit-styles')?.remove();
      };
    } else {
      cvElement.classList.remove('ring-2', 'ring-indigo-400', 'focus:outline-none');
    }
  }, [isDirectEditing, activeCv?.html]);


  const handleToggleEdit = () => {
    if (isDirectEditing) { // This block runs when SAVING edits
      const cvElement = cvContentRef.current?.firstChild as HTMLElement;
      if (cvElement && activeCv) {
        cvElement.setAttribute('contentEditable', 'false');
        cvElement.classList.remove('ring-2', 'ring-indigo-400', 'focus:outline-none');
        // FIX: Use outerHTML to preserve the root element and its classes.
        const updatedHtml = cvElement.outerHTML;
        onCvUpdate({ ...activeCv, html: updatedHtml });
      }
    }
    setIsDirectEditing(!isDirectEditing);
  };

  const renderContent = () => {
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-red-500 p-4">
                <Icon path="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" className="w-16 h-16 text-red-400 mb-4" />
                <h3 className="text-xl font-semibold">An Error Occurred</h3>
                <p className="mt-2 text-sm max-w-md">{error}</p>
            </div>
        );
    }
    
    if (isLoading && generatedCvs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <h3 className="text-xl font-semibold mt-4">Generating your CVs...</h3>
                <p className="mt-2 max-w-sm">The AI is crafting your professional story. Please wait.</p>
            </div>
        );
    }
    
    if (!isLoading && generatedCvs.length === 0) {
        return (
             <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-4">
                <Icon path="M11.35 3.836l-8.5 8.5a.75.75 0 000 1.06l8.5 8.5a.75.75 0 001.06-1.06l-7.97-7.97 7.97-7.97a.75.75 0 00-1.06-1.06zM17.35 3.836l-8.5 8.5a.75.75 0 000 1.06l8.5 8.5a.75.75 0 001.06-1.06l-7.97-7.97 7.97-7.97a.75.75 0 00-1.06-1.06z" className="w-20 h-20 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold">Your CVs will appear here</h3>
                <p className="mt-2 max-w-sm">Fill in your details, and click 'Generate CV' to create three designs.</p>
            </div>
        );
    }

    if (activeCv) {
        return (
            <>
                <DesignSwitcher cvs={generatedCvs} activeIndex={activeCvIndex!} onSelect={setActiveCvIndex} />
                <div className="flex-grow overflow-y-auto p-4 md:p-6 bg-gray-200">
                    <div id="cv-content-wrapper" ref={cvContentRef} dangerouslySetInnerHTML={{ __html: activeCv.html }} />
                </div>
            </>
        );
    }

    return null; // Should not be reached in normal flow
  }

  return (
    <div className="h-full p-6 md:p-8 flex flex-col bg-gray-100 lg:border-r-2 lg:border-l-2 border-black">
       <div className="flex-shrink-0 flex flex-wrap justify-between items-center gap-4 mb-4">
            <h2 className="text-xl font-bold text-gray-800">Generated CV</h2>
            {activeCv && (
                <div className="flex items-center flex-wrap gap-3">
                    <button onClick={handleRateCv} disabled={isRating || isDirectEditing} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black bg-white border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0">
                        {isRating ? <Spinner /> : <Icon path="M10.788 3.212a.75.75 0 011.06 0l.545.545a.75.75 0 001.06 0l.546-.545a.75.75 0 111.06 1.06l-.545.545a.75.75 0 000 1.06l.545.545a.75.75 0 11-1.06 1.06l-.546-.545a.75.75 0 00-1.06 0l-.545.545a.75.75 0 11-1.06-1.06l.545-.545a.75.75 0 000-1.06l-.545-.545a.75.75 0 010-1.06zM9.212 10.788a.75.75 0 011.06 0l.545.545a.75.75 0 001.06 0l.546-.545a.75.75 0 111.06 1.06l-.545.545a.75.75 0 000 1.06l.545.545a.75.75 0 11-1.06 1.06l-.546-.545a.75.75 0 00-1.06 0l-.545.545a.75.75 0 11-1.06-1.06l.545-.545a.75.75 0 000-1.06l-.545-.545a.75.75 0 010-1.06zM3.212 10.788a.75.75 0 011.06 0l.545.545a.75.75 0 001.06 0l.546-.545a.75.75 0 111.06 1.06l-.545.545a.75.75 0 000 1.06l.545.545a.75.75 0 11-1.06 1.06l-.546-.545a.75.75 0 00-1.06 0l-.545.545a.75.75 0 11-1.06-1.06l.545-.545a.75.75 0 000-1.06l-.545-.545a.75.75 0 010-1.06z" className="w-5 h-5"/>}
                        <span>{isRating ? 'Analyzing...' : 'Rate My CV'}</span>
                    </button>
                    <button onClick={handleToggleEdit} className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all ${isDirectEditing ? 'text-white bg-indigo-600' : 'text-black bg-white'}`}>
                        <Icon path={isDirectEditing ? "M5 13l4 4L19 7" : "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"} className="w-5 h-5"/>
                        <span>{isDirectEditing ? 'Save Edits' : 'Edit Text'}</span>
                    </button>
                    <button onClick={handleDownloadPdf} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black bg-white border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                        <Icon path="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" className="w-5 h-5"/>
                        <span>Download PDF</span>
                    </button>
                </div>
            )}
        </div>

      <div id="cv-preview-area" className="flex-grow bg-gray-200 border-2 border-black overflow-hidden relative min-h-[400px] flex flex-col">
          {renderContent()}
      </div>

      {activeCv && (
        <div className="mt-6 flex-shrink-0">
          <div className="relative">
            <textarea rows={3} value={editPrompt} onChange={(e) => setEditPrompt(e.target.value)} placeholder="Want changes? Type your edits here. e.g., 'Make the summary more concise.'" className="w-full p-4 pr-32 border-2 border-black bg-gray-900 text-white focus:border-indigo-500 focus:ring-0 placeholder-gray-400 transition-all"/>
            <button onClick={handleRefine} disabled={isLoading || !editPrompt} className="absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center justify-center gap-2 py-2 px-4 bg-indigo-600 text-white font-semibold border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:bg-gray-400 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0">
              {isLoading && editPrompt ? <Spinner /> : <Icon path="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-4.991-2.695v-4.992m0 0h-4.992m4.992 0l-3.181-3.183a8.25 8.25 0 00-11.664 0l-3.181 3.183" className="w-5 h-5"/>}
              Refine
            </button>
          </div>
          {activeCv.jobSuggestions && activeCv.jobSuggestions.length > 0 && (
            <JobSuggestions suggestions={activeCv.jobSuggestions} />
          )}
        </div>
      )}
    </div>
  );
};
