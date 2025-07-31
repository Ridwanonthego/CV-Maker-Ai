
import { GoogleGenAI, Type } from "@google/genai";
import { CVStyle, CVType, GeneratedCv, colorThemes, CvRatingReport } from "../types";

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        personName: {
            type: Type.STRING,
            description: "The full name of the person for whom the CV is generated, extracted from the raw text. E.g., 'Naziba Zaman'."
        },
        cvHtml: {
            type: Type.STRING,
            description: "The complete HTML of the CV, styled with Tailwind CSS classes within a single parent div."
        },
        jobSuggestions: {
            type: Type.ARRAY,
            description: "An array of 3-5 specific job titles or roles this CV is well-suited for, based on its content. E.g., ['Software Engineer', 'Frontend Developer', 'UI/UX Designer']. This MUST be populated.",
            items: {
                type: Type.STRING
            }
        },
        style: {
            type: Type.STRING,
            enum: ['Modern', 'Classic', 'Creative'],
            description: "The CV style used for generation. MUST be one of 'Modern', 'Classic', or 'Creative'."
        }
    },
    required: ["personName", "cvHtml", "jobSuggestions", "style"]
};

const getDesignInstructionsForStyle = (style: CVStyle, colorThemeKey: string): string => {
    const theme = colorThemes[colorThemeKey];
    
    const colorNameMap: { [key: string]: string } = {
        'Indigo': 'indigo',
        'Teal': 'teal',
        'Crimson': 'rose',
        'Slate': 'slate',
        'Ocean': 'cyan',
        'Sunset': 'amber',
        'Forest': 'green',
    };
    const colorName = colorNameMap[colorThemeKey] || 'indigo';
    const isGradient = !!theme.gradient;
    
    const primaryColorText = isGradient ? `text-transparent bg-clip-text bg-gradient-to-r ${theme.gradient}` : `text-${colorName}-600`;
    const primaryColorBorder = `border-${colorName}-500`;
    const primaryColorHighlightText = `text-${colorName}-700`;
    const solidColorForGradientTitle = isGradient ? `text-cyan-700` : primaryColorHighlightText;

    switch (style) {
        case CVStyle.Classic:
             return `
            **Design Analysis & Principles (Classic 'Elite' Style):**
            - **Layout:** MUST be a clean, elegant, single-column layout. Use generous margins and whitespace for a formal, readable, and uncluttered document. The root element MUST be: \`<div class="max-w-4xl mx-auto bg-white p-12 md:p-16 font-serif text-slate-800">\`.
            - **Typography:** Employ a classic, sophisticated serif font like \`font-serif\`. 
                - The name should be large but not ostentatious: \`<h1 class="text-4xl text-center font-bold text-slate-800 tracking-wider">\`.
                - Contact info should be centered below the name, separated by elegant dividers: \`<span>(123) 456-7890</span> <span class="text-slate-400 mx-2">|</span> <span>email@example.com</span>\`.
                - Section headers (\`<h2>\`) must be uppercase, using letter-spacing for elegance (\`tracking-widest\`), and have a subtle, thin horizontal rule below them. Example: \`<h2 class="text-xl font-semibold text-slate-700 tracking-widest uppercase mt-10 mb-4 pb-2 border-b border-slate-300">Experience</h2>\`.
            - **Color:** Use color with extreme subtlety and restraint. The palette is predominantly black/slate on white. The chosen theme color '${colorThemeKey}' should only be used for the most subtle accents, like the border under the section headers (\`border-${colorName}-200\`), if at all. The aesthetic is timeless and professional, not trendy. Avoid bright, loud colors.
            - **Structure:**
                - **Header:** Centered Name, followed by a centered line with Contact Info.
                - **Sections:** Logical order: Summary, Experience, Education, Skills. 
                - **Experience:** Clearly defined roles with company and dates. Use concise, impactful bullet points.
                - **Skills:** MUST be a simple, categorized list under the 'Skills' heading. Absolutely NO graphical "pills" or bars. Just clean text lists, potentially in columns. Example: \`<p><strong class="font-semibold">Languages:</strong> Spanish, English</p>\`.
            - **Image:** The provided image URL MUST be used in an \`<img>\` tag. If no image URL is provided, provide an elegant monogram SVG placeholder, not a generic avatar. E.g., for 'Naziba Zaman', a circle with 'NZ' in a serif font.
            `;

        case CVStyle.Creative:
            return `
            **Design Analysis & Principles (Creative 'Agency' Style):**
            - **Goal:** To create a CV that is stylish, memorable, and professional, suitable for roles in design, marketing, or tech. The aesthetic should be 'design agency clean', not 'art school project wild'.
            - **Layout:** MUST be a clean, controlled asymmetrical layout. A common pattern is a narrower left or right column for key info, and a wider main column for detailed content. Root element MUST be: \`<div class="max-w-5xl mx-auto bg-white shadow-xl font-sans flex flex-col md:flex-row text-slate-800">\`.
            - **Typography:** Employ a modern, clean sans-serif font family (e.g., 'font-sans'). Create a strong visual hierarchy using font weight (bold, medium) and size. The person's name should be prominent but tastefully integrated.
            - **Color Application:** The chosen '${colorThemeKey}' theme must be used strategically and with sophistication.
                - Use the primary color for major headings (\`<h2>\`), icons, and perhaps a thin border on one side of the sidebar. The \`${primaryColorText}\` class should be used on key text elements.
                - The overall background MUST be white. Avoid large, distracting blocks of solid color. The goal is a clean, bright document with pops of color.
            - **Structure & Elements:**
                - **Sidebar:** A narrower column (e.g., \`w-1/3\`) containing the Profile Image (circular, cleanly integrated), Contact Info (with icons), a brief 'About' or 'Profile' section, and Skills.
                - **Main Content:** A wider column (e.g., \`w-2/3\`) for the detailed Experience, Education, and Projects sections. Use clear headings with the accent color.
                - **Skill Pills:** Skills should be presented as clean, modern badges. Each pill MUST have the 'skill-pill-deletable' class. Use these exact classes for a subtle look: \`<span class="skill-pill-deletable inline-block bg-${colorName}-100 text-${colorName}-800 rounded px-3 py-1 text-sm font-medium mr-2 mb-2">JavaScript</span>\`.
            - **Image:** The provided image URL MUST be used in an \`<img>\` tag. The profile image should be circular and well-integrated into the sidebar, not floating oddly.
            `;
        
        case CVStyle.Modern:
        default:
            const sidebarBg = `bg-slate-50`;
            const skillPillBg = `bg-${colorName}-100`;
            const skillPillText = `text-${colorName}-800`;

            return `
            **Design Analysis & Principles (Modern Style):**
            - **Layout:** A clean, functional two-column layout. The left column (\`w-1/3\`) serves as a sidebar, and the right column (\`w-2/3\`) is for main content. This creates a balanced, scannable document. The root element MUST be: \`<div class="max-w-5xl mx-auto bg-white shadow-xl font-sans flex text-slate-800">\`.
            - **Typography:** Strong visual hierarchy with a sans-serif font (\`font-sans\`). Use a large, bold font for the name and a smaller, colored font for the professional title. Section headers (\`<h2>\`) should be bold and distinct.
            - **Color Application:** The user selected the '${colorThemeKey}' theme.
                - Main Name Header: Apply this class: \`${primaryColorText}\`.
                - Professional Title: Apply this class: \`${solidColorForGradientTitle}\`.
                - Section Dividers: Section headers in the main column MUST use this style: \`<h2 class="text-2xl font-bold text-slate-800 border-b-4 ${primaryColorBorder} pb-2 mb-6">...\`.
                - Sidebar: The left sidebar MUST use this background class: \`${sidebarBg}\`.
                - **Skill Pills (Mandatory):** Render each skill as a distinct "pill" or "badge". Each pill MUST have the 'skill-pill-deletable' class for interactivity. Use these exact classes: \`<span class="skill-pill-deletable inline-block ${skillPillBg} ${skillPillText} rounded-md px-3 py-1 text-sm font-medium mr-2 mb-2">JavaScript</span>\`.
            - **Structure:**
                - **Left Column (Sidebar - \`w-1/3 ${sidebarBg} p-8\`):** Profile Image (circular), Contact Info (with icons), Skills (using Pills), and Education.
                - **Right Column (Main Content - \`w-2/3 p-10\`):** Full Name Header, Professional Title, Professional Summary, Work Experience (reverse chronological), and Projects.
            `;
    }
};

const generateCvPrompt = (rawInfo: string, imageUrl: string, cvStyle: CVStyle, cvType: CVType, colorThemeKey: string): string => {
    
    const designInstructions = getDesignInstructionsForStyle(cvStyle, colorThemeKey);

    return `
    **Objective:** Transform raw, messy user-provided text into a visually stunning, professional, and comprehensive Curriculum Vitae (CV) based on a chosen style. The final output must be world-class, filling at least one full page.

    **Persona:** You are 'CV Architect', a world-class graphic designer and CV strategist. Your task is to produce a document that is both visually stunning and strategically potent, strictly adhering to the specified design style.

    **Input Data:**
    - **Raw User Information:** \`\`\`${rawInfo}\`\`\`
    - **Profile Image URL:** ${imageUrl || 'Not provided. Use a placeholder SVG.'}
    - **Desired Style:** ${cvStyle}.
    - **Desired Format:** ${cvType}.
    - **Color Theme:** ${colorThemeKey}

    ${designInstructions}

    **CRITICAL INSTRUCTIONS (APPLY TO ALL STYLES):**

    1.  **Parse and Synthesize (Intelligence is Key):** Deeply analyze the 'Raw User Information'. Extract the subject's name, contact info, work experience, education, and skills.
    2.  **AGGRESSIVELY DISCARD GARBAGE DATA:** Ignore irrelevant UI text ('Skip to search', 'Follow', 'Message'), ads, social media fluff ('People you may know', follower counts), etc. Focus ONLY on the professional story of the main subject.
    3.  **Proactively Enhance Content:** A great CV is comprehensive. If the raw text is sparse, you must still generate a full 1-2 page CV by elaborating on provided information and adding common sections (like 'Projects' or 'Certifications') with realistic, editable placeholder content.
    4.  **Design According to Style (Aesthetics are Paramount):** Strictly follow all rules in the **Design Analysis & Principles** section for the chosen '${cvStyle}' style. This is the most important instruction.
    5.  **Profile Image:** The provided 'Profile Image URL' MUST be used directly as the 'src' attribute of an \`<img>\` tag. If no URL is provided, create a stylish placeholder SVG that fits the chosen style (e.g., simple initials for Classic/Modern, something more abstract for Creative).
    6.  **Suggest Suitable Jobs:** Based on the final, generated CV content, identify and return an array of 3-5 specific job titles or roles the candidate appears qualified for in the \`jobSuggestions\` field.
    7.  **Generate Final HTML:** The entire CV must be a single HTML \`<div>\` element for the 'cvHtml' JSON key. Use **ONLY Tailwind CSS classes**. No inline \`style\` attributes or \`<style>\` tags. The design must be rich and detailed enough to span 1-2 pages.
    8.  **NO DARK MODE:** The CV MUST be light-themed. Do NOT use any 'dark:' Tailwind CSS prefixes. All text and backgrounds should be designed for a white page. This is a strict requirement.
    9.  **Final JSON Response:** Return ONLY a valid JSON object matching the schema, containing 'personName', 'cvHtml', 'jobSuggestions', and 'style'. The 'style' field MUST be set to '${cvStyle}'.
    `;
};

const refineCvPrompt = (currentCvHtml: string, editRequest: string, colorThemeKey: string, imageUrl: string): string => {
    return `
    **Objective:** Refine an existing, professionally designed CV based on user feedback while preserving its core design language.

    **Persona:** You are 'CV Architect', making precise edits to your masterpiece.

    **Input Data:**
    - **Current CV HTML:** \`\`\`html\n${currentCvHtml}\n\`\`\`
    - **User's Edit Request:** "${editRequest}"
    - **Color Theme (for reference):** ${colorThemeKey}
    - **Potentially Updated Profile Image URL:** ${imageUrl}

    **Mandatory Instructions:**
    1.  **Analyze Existing Style:** First, recognize the style of the current CV (e.g., is it a single-column 'Classic' design, a two-column 'Modern' one, or an expressive 'Creative' layout?).
    2.  **Apply Changes Intelligently:** Analyze the user's request and apply the changes to the provided HTML. 
        - If the user asks to change the profile picture, you MUST use the provided 'Potentially Updated Profile Image URL' as the new src for the image tag.
        - If they ask for content changes (e.g., 'rephrase my summary'), do it while keeping the existing HTML tags and classes.
        - If they ask for a color change, re-apply the styling rules for the new theme, but respect the original layout and typography.
    3.  **Maintain Integrity:** Preserve the fundamental structure (e.g., single vs. two-column), typography, and styling rules from the original creation. DO NOT break the layout or remove the detailed styling that defines its character.
    4.  **Preserve Interactivity:** If the original CV has skill pills with the \`skill-pill-deletable\` class, ensure they retain this class in the updated HTML.
    5.  **NO DARK MODE:** Ensure the final output contains no 'dark:' Tailwind CSS prefixes. This is a strict rule.
    6.  **Extract Name:** Identify the person's full name from the HTML content.
    7.  **Update Job Suggestions:** After applying the edits, re-evaluate the CV and provide an updated array of 3-5 suitable job roles in the 'jobSuggestions' field.
    8.  **Return Full HTML:** Output the complete, updated HTML for the entire CV.
    9.  **Final JSON Response:** Return ONLY a valid JSON object conforming to the schema, with 'personName', 'cvHtml', 'jobSuggestions', and the 'style' you identified from the original HTML.
    `;
}

const parseJsonResponse = (jsonText: string): GeneratedCv => {
    const result = JSON.parse(jsonText);
    if (result && result.cvHtml && result.personName && result.jobSuggestions && result.style) {
        return { name: result.personName, html: result.cvHtml, jobSuggestions: result.jobSuggestions, style: result.style as CVStyle };
    } else {
        console.error("Invalid AI response structure:", result);
        throw new Error("AI response was missing required content: 'personName', 'cvHtml', 'jobSuggestions', or 'style'.");
    }
};


export const generateCv = async (
    apiKey: string,
    rawInfo: string,
    imageUrl: string,
    cvStyle: CVStyle,
    cvType: CVType,
    colorTheme: string
): Promise<GeneratedCv> => {
    try {
        if (!apiKey) throw new Error("API Key is required.");
        const ai = new GoogleGenAI({ apiKey });
        const prompt = generateCvPrompt(rawInfo, imageUrl, cvStyle, cvType, colorTheme);
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
        return parseJsonResponse(response.text.trim());
    } catch (error: any) {
        console.error(`Error generating CV with style ${cvStyle}:`, error);
        let message = `Failed to generate CV (${cvStyle}): ${error.message}`;
        if (typeof error.message === 'string') {
            if (error.message.includes("API key not valid")) {
                message = "The provided API Key is not valid. Please check your key and try again.";
            } else if (error.message.includes("JSON")) {
                 message = "The AI returned an invalid format. This can happen with complex input. Please try simplifying your text.";
            } else if (error.message.includes("500") && error.message.includes("Rpc failed")) {
                 message = "The AI service encountered a temporary error. This could be due to long input. Please try again, or shorten the text in the 'Brain Dump' area.";
            }
        }
        throw new Error(message);
    }
};

export const refineCv = async (
    apiKey: string,
    currentCvHtml: string,
    editRequest: string,
    colorTheme: string,
    imageUrl: string,
): Promise<GeneratedCv> => {
     try {
        if (!apiKey) throw new Error("API Key is required.");
        const ai = new GoogleGenAI({ apiKey });
        const prompt = refineCvPrompt(currentCvHtml, editRequest, colorTheme, imageUrl);
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        return parseJsonResponse(response.text.trim());
    } catch (error: any) {
        console.error("Error refining CV:", error);
        let message = `Failed to refine CV: ${error.message}`;
        if (typeof error.message === 'string') {
            if (error.message.includes("API key not valid")) {
                message = "The provided API Key is not valid. Please check your key and try again.";
            } else if (error.message.includes("JSON")) {
                 message = "The AI returned an invalid format during refinement. Please try your request again with different phrasing.";
            } else if (error.message.includes("500") && error.message.includes("Rpc failed")) {
                 message = "The AI service encountered a temporary error during refinement. Please try your request again.";
            }
        }
        throw new Error(message);
    }
};

const ratingSchema = {
    type: Type.OBJECT,
    properties: {
        score: {
            type: Type.NUMBER,
            description: "A numerical score from 1 to 10 (e.g., 8.5) representing the overall quality and job-readiness of the CV."
        },
        pros: {
            type: Type.ARRAY,
            description: "A list of bullet points highlighting the strengths of the CV. This is from a recruiter's perspective, answering 'Why I would hire this person'.",
            items: { type: Type.STRING }
        },
        cons: {
            type: Type.ARRAY,
            description: "A list of bullet points identifying weaknesses or areas for improvement. This is from a recruiter's perspective, answering 'What gives me pause about this candidate'.",
            items: { type: Type.STRING }
        },
        overallFeedback: {
            type: Type.STRING,
            description: "A concise, actionable paragraph summarizing the CV's effectiveness and suggesting the most critical next steps for improvement."
        }
    },
    required: ["score", "pros", "cons", "overallFeedback"]
};

const rateCvPrompt = (cvHtml: string) => {
    return `
    **Objective:** Act as an expert recruiter and CV analyst to provide a comprehensive, critical review of a candidate's CV. You will analyze both the visual presentation (from the image) and the textual content (from the HTML).

    **Persona:** You are a senior technical recruiter at a top tech firm. You have seen thousands of CVs and know exactly what separates a good one from a great one. You are sharp, insightful, and provide direct, actionable feedback.

    **Input:**
    1.  **CV Image:** Provided as a visual part of this prompt. Analyze it for layout, whitespace, typography, color theory, and overall aesthetic appeal. Does it look professional and easy to read?
    2.  **CV Content (HTML):** \`\`\`html\n${cvHtml}\n\`\`\` Analyze this for content quality, clarity, use of action verbs, quantification of achievements, keyword optimization for Applicant Tracking Systems (ATS), and overall narrative strength.

    **Task:**
    Based on your holistic analysis of both the visual design and the content, generate a JSON object that provides a detailed critique.

    **Evaluation Criteria (consider these for your score and feedback):**
    - **First Impression & Design (Visual):** Is it clean, modern, and professional? Is the hierarchy clear?
    - **Clarity & Conciseness (Content):** Is the information easy to digest? Is it free of jargon and fluff?
    - **Impact & Achievements (Content):** Are accomplishments quantified? Does the candidate demonstrate value?
    - **Relevance & Keywords (Content):** Is the CV tailored? Does it contain relevant keywords for its target roles?
    - **Overall Professionalism:** No typos, grammatical errors. Consistent formatting.

    **Final JSON Response:**
    Return ONLY a valid JSON object matching the defined schema. Be critical and honest in your assessment to provide maximum value to the user.
    `;
}

export const rateCv = async (apiKey: string, cvHtml: string, cvImageBase64: string): Promise<CvRatingReport> => {
    try {
        if (!apiKey) throw new Error("API Key is required.");
        if (!cvImageBase64.startsWith('data:image/png;base64,')) {
            throw new Error("Invalid Base64 image format provided for rating.");
        }
        
        const ai = new GoogleGenAI({ apiKey });

        const imagePart = {
            inlineData: {
                mimeType: 'image/png',
                data: cvImageBase64.replace('data:image/png;base64,', ''),
            },
        };

        const textPart = {
            text: rateCvPrompt(cvHtml),
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: ratingSchema,
            },
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);

        if (result && result.score && result.pros && result.cons && result.overallFeedback) {
            return result as CvRatingReport;
        } else {
            console.error("Invalid AI response structure for rating:", result);
            throw new Error("AI response was missing required rating content.");
        }

    } catch (error: any) {
        console.error("Error rating CV:", error);
        let message = `Failed to rate CV: ${error.message}`;
         if (typeof error.message === 'string') {
            if (error.message.includes("API key not valid")) {
                message = "The provided API Key is not valid. Please check your key and try again.";
            } else if (error.message.includes("JSON")) {
                 message = "The AI returned an invalid format while rating. Please try again.";
            } else if (error.message.includes("500") && error.message.includes("Rpc failed")) {
                 message = "The AI service encountered a temporary error while rating the CV. Please try again in a moment.";
            }
        }
        throw new Error(message);
    }
};

const formatRawInfoPrompt = (rawInfo: string): string => {
    return `
    **Objective:** Clean, format, and structure raw, messy text into a well-organized summary of professional information.

    **Persona:** You are an intelligent data-parser and text-formatter. Your only job is to take unstructured text and make it clean and logical.

    **Input Text:**
    \`\`\`
    ${rawInfo}
    \`\`\`

    **CRITICAL INSTRUCTIONS:**
    1.  **Identify the Core Subject:** Find the main person the text is about.
    2.  **Extract Key Information ONLY:** Systematically extract the following sections if present:
        - Full Name
        - Contact Information (Email, Phone, Location, Professional Website/LinkedIn URLs)
        - Professional Summary or Bio
        - Work Experience (Job Title, Company, Dates, Responsibilities/Achievements)
        - Education (Degree, University, Dates)
        - Skills (Categorize them if possible, e.g., Languages, Technical Skills)
        - Projects
        - Certifications
    3.  **AGGRESSIVELY DISCARD GARBAGE:** You MUST remove all irrelevant text. This includes but is not limited to:
        - UI navigation text ('Skip to main content', 'Home', 'My Network')
        - Social media interactions ('Follow', 'Message', 'Connect', 'followers', 'People you may know')
        - Advertisements or promotions ('Retry Premium Free')
        - Generic website footer/header content.
    4.  **Format the Output:** Structure the extracted information clearly using Markdown-style headings. For example:
        \`\`\`
        # [Full Name]

        ## Contact
        - Email: email@example.com
        - Phone: (123) 456-7890
        - LinkedIn: linkedin.com/in/username

        ## Professional Summary
        [Summary text here]

        ## Work Experience
        **[Job Title]** at [Company]
        *([Start Date] - [End Date])*
        - [Responsibility/Achievement 1]
        - [Responsibility/Achievement 2]

        ## Education
        **[Degree]**, [University]
        *([Start Date] - [End Date])*

        ## Skills
        - **Languages:** [List]
        - **Technical:** [List]
        \`\`\`
        This example format is a guideline. The key is to produce clean, structured text.
    5.  **Return ONLY Cleaned Text:** The final output should be a single block of clean, formatted text. Do not add any commentary or explanation. Just return the formatted professional data.
    `;
};

export const formatRawInfo = async (apiKey: string, rawInfo: string): Promise<string> => {
    try {
        if (!apiKey) throw new Error("API Key is required.");
        const ai = new GoogleGenAI({ apiKey });
        const prompt = formatRawInfoPrompt(rawInfo);
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const formattedText = response.text.trim();
        if (!formattedText) {
            throw new Error("AI returned an empty response during formatting.");
        }
        return formattedText;

    } catch (error: any) {
        console.error(`Error formatting raw info:`, error);
        let message = `Failed to format input: ${error.message}`;
        if (typeof error.message === 'string') {
             if (error.message.includes("API key not valid")) {
                message = "The provided API Key is not valid. Please check your key and try again.";
            } else if (error.message.includes("500") && error.message.includes("Rpc failed")) {
                message = "The AI service encountered a temporary error while formatting. Please try again.";
            }
        }
        throw new Error(message);
    }
};
