
export enum CVStyle {
    Modern = 'Modern',
    Classic = 'Classic',
    Creative = 'Creative',
}

export enum CVType {
    Chronological = 'Chronological',
    Functional = 'Functional',
    Combination = 'Combination',
}

export const colorThemes: Record<string, { main: string; gradient?: string }> = {
    'Indigo': { main: 'bg-indigo-500' },
    'Teal': { main: 'bg-teal-500' },
    'Crimson': { main: 'bg-rose-600' },
    'Slate': { main: 'bg-slate-600' },
    'Ocean': { main: 'bg-gradient-to-tr from-cyan-500 to-blue-500', gradient: 'from-cyan-500 to-blue-500' },
    'Sunset': { main: 'bg-gradient-to-tr from-amber-500 to-orange-600', gradient: 'from-amber-500 to-orange-600' },
    'Forest': { main: 'bg-gradient-to-tr from-green-500 to-emerald-600', gradient: 'from-green-500 to-emerald-600' },
};


export interface InputPanelProps {
    apiKey: string;
    setApiKey: (value: string) => void;
    rawInfo: string;
    setRawInfo: (value: string) => void;
    imageUrl: string;
    setImageUrl: (value: string) => void;
    colorTheme: string;
    setColorTheme: (value: string) => void;
    handleGenerate: () => void;
    isLoading: boolean;
    isFormatting: boolean;
    handleFormat: () => void;
    onInfoIconClick: () => void;
}

export interface CvDisplayProps {
    generatedCvs: GeneratedCv[];
    activeCvIndex: number | null;
    setActiveCvIndex: (index: number) => void;
    editPrompt: string;
    setEditPrompt: (value: string) => void;
    handleRefine: () => void;
    isLoading: boolean;
    error: string | null;
    onCvUpdate: (updatedCv: GeneratedCv) => void;
    handleRateCv: () => void;
    isRating: boolean;
}

export interface GeneratedCv {
    name: string;
    html: string;
    jobSuggestions: string[];
    style: CVStyle;
}

export interface CvRatingReport {
    score: number;
    pros: string[];
    cons: string[];
    overallFeedback: string;
}

export interface LogEntry {
    timestamp: Date;
    message: string;
    type: 'info' | 'success' | 'error';
}

export interface TipsOverlayProps {
    onClose: () => void;
}

export interface ApiKeyModalProps {
    onClose: () => void;
}
