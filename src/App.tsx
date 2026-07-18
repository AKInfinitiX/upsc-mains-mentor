import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Award, 
  FileText, 
  CheckCircle, 
  TrendingUp, 
  HelpCircle, 
  ChevronRight, 
  Copy, 
  RefreshCw, 
  AlertCircle, 
  Trash2, 
  Save, 
  Landmark, 
  ShieldAlert, 
  Zap,
  BookmarkCheck,
  Check,
  Plus,
  BookMarked,
  Sun,
  Moon,
  Upload,
  X,
  ChevronDown,
  Calendar,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { SYLLABUS_TOPICS, PRESET_QUESTIONS, HIGH_YIELD_VAULT } from './data/syllabusData';
import { GSPaper, PresetQuestion, EvaluationResult, AnswerAttempt, SavedModelAnswer, HighYieldFact, EvaluationRubric, RubricDetail } from './types';

// Pre-populate mock attempts for immediate premium feel on first load
const INITIAL_ATTEMPTS: AnswerAttempt[] = [
  {
    id: 'mock-1',
    questionText: 'The office of the Governor in India has often become a battleground between the Center and the States. Discuss the constitutional position of the Governor and suggest reformative measures.',
    gsPaper: 'GS2',
    marks: 15,
    userAnswer: 'The Governor is appointed by the President under Article 155. He acts as a bridge between Centre and State. However, there are many issues: 1. Misuse of Article 356 (President\'s rule) as seen historically in Karnataka or Uttarakhand. 2. Role in choosing CM in a hung assembly where discretionary power under Article 163 is abused. 3. Delaying assent to bills under Article 200 without reason. For reforms, Sarkaria Commission recommended that Governor should be from outside the state, not active in politics. Also, Punchhi commission said Governor should be impeachable by the state assembly.',
    evaluatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    evaluation: {
      marksAwarded: 8.0,
      marksRationale: "An impressive, well-structured attempt. You have correctly highlighted the core federal issues and cited the gold-standard Sarkaria and Punchhi Commission recommendations. To reach the absolute top tier, add reference to Article 174 (Assembly summoning discretion) and quote the landmark Nabam Rebia (2016) judgment.",
      strengths: [
        "Directly addresses the core federal friction points.",
        "Cites relevant Constitutional Articles (Article 155, 163, 200).",
        "Includes strong policy/committee recommendations (Sarkaria, Punchhi)."
      ],
      weaknesses: [
        "Lacks landmark judicial precedents (e.g., S.R. Bommai v. UOI, Nabam Rebia).",
        "Introduction could define the dual-role of the Governor more elegantly.",
        "Does not represent the flow diagrammatically to save writing time."
      ],
      missingDimensions: [
        "Article 174 regarding Governor's power to summon, prorogue or dissolve the House, which must align with Council of Ministers advice as held by SC.",
        "Venkatachaliah Commission (NCRWC) on consultation of Chief Minister before appointment."
      ],
      suggestedValueAdditions: [
        "Reference Article 163(1) - Governor's discretion is limited, not absolute.",
        "S.R. Bommai case (1994) - floor test is the only metric of majority, not Governor's subjective evaluation.",
        "Shamsher Singh v. State of Punjab (1974) - Governor must act in harmony with Cabinet advice."
      ],
      suggestedDiagram: "Create an Institutional Relationship Diagram: A central hub labeled 'Governor' with dual spokes: 'Agent of Union (Art 155)' and 'Constitutional Head of State (Art 154)', showing federal friction lines when they conflict.",
      actionableAdvice: [
        "Revamp the introduction to state: 'The office of the Governor represents a structural bridge in India\'s cooperative federalism, balancing national integrity and state autonomy.'",
        "Draw a quick schematic diagram mapping federal tension lines to save approx. 50 words in your answer copy."
      ],
      rubric: {
        demandAddressal: { rating: 'Strong', remarks: "Addresses core demand of constitutional position and Sarkaria/Punchhi commissions well." },
        structurePresentation: { rating: 'Strong', remarks: "Good structure, but writing speed could be improved by using standard diagrams." },
        factualValueAddition: { rating: 'Average', remarks: "Constitutional articles present but missing S.R. Bommai and Nabam Rebia judgements." },
        analyticalDepth: { rating: 'Strong', remarks: "Sufficient federal friction depth explored." },
        diagramsVisualAid: { rating: 'Poor', remarks: "No diagrams or visual structures presented." }
      }
    }
  },
  {
    id: 'mock-2',
    questionText: 'What is Green Hydrogen? Examine its potential in achieving India\'s Panchamrit targets of Net-Zero emissions by 2070, while highlighting key bottlenecks.',
    gsPaper: 'GS3',
    marks: 15,
    userAnswer: 'Green hydrogen is hydrogen produced by electrolysis of water using renewable energy like solar or wind. India wants Net-Zero emissions by 2070 under the Panchamrit declaration at COP26. Potential: 1. Decarbonizing heavy industry (steel, cement). 2. Reducing oil import bill. 3. Clean storage for renewable energy. But there are major bottlenecks: 1. High cost of electrolyzers and solar power. 2. Huge water requirement (pure demineralized water). 3. Transportation and storage (hydrogen is highly flammable and escapes easily). 4. Lack of policy mandate.',
    evaluatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    evaluation: {
      marksAwarded: 7.0,
      marksRationale: "Factual understanding of water electrolysis and renewable coupling is strong. Excellent mapping of heavy industry decarbonization. To achieve topper-grade scores, include specific statistics (e.g., National Green Hydrogen Mission targets) and highlight India's specific infrastructure bottlenecks.",
      strengths: [
        "Clear, accurate scientific definition of Green Hydrogen.",
        "Decarbonization potential of hard-to-abate sectors is well identified.",
        "Excellent outline of storage and flammability challenges."
      ],
      weaknesses: [
        "Missed citing the National Green Hydrogen Mission and its concrete 2030 targets.",
        "R&D spending statistics were not leveraged to back the cost argument.",
        "Missing geographical aspect of renewable corridors."
      ],
      missingDimensions: [
        "The target of producing 5 MMT (Million Metric Tonnes) of Green Hydrogen per annum by 2030.",
        "Round-The-Clock (RTC) power tariffs which increase electrolyzer utilization factors."
      ],
      suggestedValueAdditions: [
        "National Green Hydrogen Mission (allocated Rs. 19,744 Crore).",
        "Cite the International Energy Agency (IEA) cost estimates showing electrolyzer capital costs are expected to fall 50% by 2030.",
        "Mention 'Critical Mineral Alliance' for secure supply chains of Iridium/Platinum used in PEM electrolyzers."
      ],
      suggestedDiagram: "Draw a simple input-output cause-effect loop: [Renewable Energy (Solar/Wind)] + [Demineralized Water] --> [Electrolyzer (PEM)] --> [Green Hydrogen] --> Spanning into 3 spokes: [Steel Decarbonization], [Export Potential], and [RTC Power Storage].",
      actionableAdvice: [
        "Begin with a current context: 'With the Cabinet approving the National Green Hydrogen Mission, India is positioning itself as a global hub for clean hydrogen technology.'",
        "Add a brief table contrasting Grey, Blue, and Green Hydrogen based on carbon footprint and extraction methodology."
      ],
      rubric: {
        demandAddressal: { rating: 'Strong', remarks: "Satisfactorily covers potential and major technical bottlenecks." },
        structurePresentation: { rating: 'Strong', remarks: "Good bullet-point distribution and clean separation." },
        factualValueAddition: { rating: 'Average', remarks: "No mention of specific government missions or target metrics (MMT/Crores)." },
        analyticalDepth: { rating: 'Strong', remarks: "Great coverage of storage, water demand, and heavy transport aspects." },
        diagramsVisualAid: { rating: 'Poor', remarks: "Candidate missed drawing input-output loops or transition diagrams." }
      }
    }
  }
];

// Rich custom dropdown component definition
const RichSelect = ({ 
  label, 
  options, 
  value, 
  onChange, 
  isOpen, 
  setIsOpen, 
  darkMode 
}: { 
  label: string; 
  options: { value: any; label: string; icon?: string; desc?: string }[]; 
  value: any; 
  onChange: (val: any) => void; 
  isOpen: boolean; 
  setIsOpen: (open: boolean) => void; 
  darkMode: boolean; 
}) => {
  const selectedOption = options.find(o => o.value === value) || options[0];
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  const renderIcon = (iconName?: string) => {
    if (!iconName) return null;
    switch (iconName) {
      case 'BookOpen': return <BookOpen className="w-4 h-4 text-indigo-500" />;
      case 'Landmark': return <Landmark className="w-4 h-4 text-indigo-500" />;
      case 'TrendingUp': return <TrendingUp className="w-4 h-4 text-indigo-500" />;
      case 'ShieldAlert': return <ShieldAlert className="w-4 h-4 text-indigo-500" />;
      case 'FileText': return <FileText className="w-4 h-4 text-indigo-500" />;
      case 'Award': return <Award className="w-4 h-4 text-amber-500" />;
      default: return null;
    }
  };

  return (
    <div className="relative font-sans text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-xs rounded-lg p-2.5 flex justify-between items-center transition-all border outline-none cursor-pointer ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100 focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-[#1E293B] focus:border-indigo-500 focus:bg-white'}`}
      >
        <div className="flex items-center gap-2">
          {renderIcon(selectedOption.icon)}
          <span className="font-semibold block truncate">{selectedOption.label}</span>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </button>

      {isOpen && (
        <div className={`absolute z-55 mt-1 w-full rounded-lg shadow-lg border overflow-hidden max-h-[280px] overflow-y-auto ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-850'}`}>
          <div className="py-1">
            {options.map((opt) => (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs transition-colors flex flex-col gap-0.5 hover:bg-slate-100 dark:hover:bg-slate-800 ${opt.value === value ? (darkMode ? 'bg-indigo-950/50 text-white' : 'bg-indigo-50 text-indigo-950') : ''}`}
              >
                <div className="flex items-center gap-2 font-semibold">
                  {renderIcon(opt.icon)}
                  <span>{opt.label}</span>
                </div>
                {opt.desc && (
                  <span className={`text-[10px] pl-6 leading-normal block ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{opt.desc}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  // Navigation & General State
  const [activeTab, setActiveTab] = useState<'evaluate' | 'generate' | 'vault' | 'progress'>('evaluate');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('upsc_dark_mode');
    return saved === 'true';
  });

  const [attempts, setAttempts] = useState<AnswerAttempt[]>(() => {
    const saved = localStorage.getItem('upsc_attempts');
    return saved ? JSON.parse(saved) : INITIAL_ATTEMPTS;
  });
  const [savedModelAnswers, setSavedModelAnswers] = useState<SavedModelAnswer[]>(() => {
    const saved = localStorage.getItem('upsc_model_answers');
    return saved ? JSON.parse(saved) : [];
  });
  const [apiKeyStatus, setApiKeyStatus] = useState<{ checked: boolean; configured: boolean }>({
    checked: false,
    configured: false
  });

  // State for Answer Evaluator
  const [evalQuestion, setEvalQuestion] = useState<string>('');
  const [evalAnswer, setEvalAnswer] = useState<string>('');
  const [evalGsPaper, setEvalGsPaper] = useState<GSPaper>('GS2');
  const [evalMarks, setEvalMarks] = useState<10 | 15 | 125>(15);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null);
  const [evalError, setEvalError] = useState<string | null>(null);
  const [evalFeedbackSuccess, setEvalFeedbackSuccess] = useState<boolean>(false);

  // Multiple Handwritten Photos Upload State
  const [uploadedPhotos, setUploadedPhotos] = useState<{ name: string; data: string; size: number; type: string }[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Rich dropdown status management
  const [isOpenEvalPaper, setIsOpenEvalPaper] = useState<boolean>(false);
  const [isOpenEvalMarks, setIsOpenEvalMarks] = useState<boolean>(false);
  const [isOpenGenPaper, setIsOpenGenPaper] = useState<boolean>(false);
  const [isOpenGenMarks, setIsOpenGenMarks] = useState<boolean>(false);

  // State for Model Answer Generator
  const [genQuestion, setGenQuestion] = useState<string>('');
  const [genGsPaper, setGenGsPaper] = useState<GSPaper>('GS2');
  const [genMarks, setGenMarks] = useState<10 | 15 | 125>(15);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [genAnswer, setGenAnswer] = useState<string>('');
  const [genError, setGenError] = useState<string | null>(null);
  const [answerSavedNotification, setAnswerSavedNotification] = useState<boolean>(false);
  const [enableEssayBrainstorm, setEnableEssayBrainstorm] = useState<boolean>(true);

  // Custom Confirmation Dialog state (replaces native window.confirm / alert inside iframes)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Sync GSPaper and Marks changes
  const handleEvalGsPaperChange = (paper: GSPaper) => {
    setEvalGsPaper(paper);
    if (paper === 'Essay') {
      setEvalMarks(125);
    } else if (evalMarks === 125) {
      setEvalMarks(15);
    }
  };

  const handleEvalMarksChange = (marks: 10 | 15 | 125) => {
    setEvalMarks(marks);
    if (marks === 125) {
      setEvalGsPaper('Essay');
    } else if (evalGsPaper === 'Essay') {
      setEvalGsPaper('GS2');
    }
  };

  const handleGenGsPaperChange = (paper: GSPaper) => {
    setGenGsPaper(paper);
    if (paper === 'Essay') {
      setGenMarks(125);
    } else if (genMarks === 125) {
      setGenMarks(15);
    }
  };

  const handleGenMarksChange = (marks: 10 | 15 | 125) => {
    setGenMarks(marks);
    if (marks === 125) {
      setGenGsPaper('Essay');
    } else if (genGsPaper === 'Essay') {
      setGenGsPaper('GS2');
    }
  };

  // State for Reference Vault (Dynamic Daily CA feed)
  const [vaultSearch, setVaultSearch] = useState<string>('');
  const [vaultPaperFilter, setVaultPaperFilter] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dailyFeed, setDailyFeed] = useState<any[]>([]);
  const [isLoadingDailyFeed, setIsLoadingDailyFeed] = useState<boolean>(false);

  // Fetch API Health Status on load
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setApiKeyStatus({
          checked: true,
          configured: !!data.apiKeyConfigured
        });
      })
      .catch(() => {
        setApiKeyStatus({ checked: true, configured: false });
      });
  }, []);

  // Fetch Dynamic Daily Current affairs when the Vault Tab is activated
  useEffect(() => {
    if (activeTab === 'vault' && dailyFeed.length === 0) {
      setIsLoadingDailyFeed(true);
      fetch('/api/vault/daily')
        .then(res => res.json())
        .then(data => {
          setDailyFeed(data);
          setIsLoadingDailyFeed(false);
        })
        .catch(err => {
          console.error("Failed to load daily vault feed", err);
          setIsLoadingDailyFeed(false);
        });
    }
  }, [activeTab, dailyFeed.length]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('upsc_attempts', JSON.stringify(attempts));
  }, [attempts]);

  useEffect(() => {
    localStorage.setItem('upsc_model_answers', JSON.stringify(savedModelAnswers));
  }, [savedModelAnswers]);

  useEffect(() => {
    localStorage.setItem('upsc_dark_mode', String(darkMode));
  }, [darkMode]);

  // Utility to handle copy reference
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Preset question selectors
  const handleSelectPresetForEval = (pq: PresetQuestion) => {
    setEvalQuestion(pq.questionText);
    setEvalGsPaper(pq.gsPaper);
    setEvalMarks(pq.marks);
  };

  const handleSelectPresetForGen = (pq: PresetQuestion) => {
    setGenQuestion(pq.questionText);
    setGenGsPaper(pq.gsPaper);
    setGenMarks(pq.marks);
  };

  // Helper to compress images on the client side before base64 conversion
  const compressImage = (file: File): Promise<{ data: string; size: number }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1600; // Optimal for UPSC paper handwriting readability

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error("Could not get canvas context"));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          // Compress as JPEG with 0.8 quality to reduce payload size to ~150-300kb while maintaining ultra-sharp text
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          const approxSize = Math.round((dataUrl.length - 22) * 3 / 4);
          resolve({ data: dataUrl, size: approxSize });
        };
        img.onerror = (err) => reject(err);
        img.src = e.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  // Helper to read and convert files into compressed base64 images
  const processFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        alert("Only image files are supported for handwritten copy uploads.");
        return;
      }
      
      // Perform fast high-ratio canvas compression first
      compressImage(file)
        .then(({ data, size }) => {
          setUploadedPhotos(prev => [
            ...prev,
            {
              name: file.name,
              data: data,
              size: size,
              type: 'image/jpeg'
            }
          ]);
        })
        .catch(err => {
          console.error("Error compressing image, falling back to raw reader:", err);
          const reader = new FileReader();
          reader.onloadend = () => {
            setUploadedPhotos(prev => [
              ...prev,
              {
                name: file.name,
                data: reader.result as string,
                size: file.size,
                type: file.type
              }
            ]);
          };
          reader.readAsDataURL(file);
        });
    });
  };

  // Submit Answer for strict UPSC Evaluation
  const handleEvaluateAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evalQuestion.trim()) {
      setEvalError('Please enter the question text.');
      return;
    }
    if (!evalAnswer.trim() && uploadedPhotos.length === 0) {
      setEvalError('Please provide either a written answer copy or upload at least one photo page of your handwritten answer sheet.');
      return;
    }

    setIsEvaluating(true);
    setEvalError(null);
    setEvalResult(null);
    setEvalFeedbackSuccess(false);

    try {
      // Map base64 uploaded photos to express-friendly mimeType and plain base64 format
      const mappedImages = uploadedPhotos.map(photo => {
        let cleanData = photo.data;
        if (cleanData.includes("base64,")) {
          cleanData = cleanData.split("base64,")[1];
        }
        return {
          mimeType: photo.type,
          data: cleanData
        };
      });

      const response = await fetch('/api/mentor/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: evalQuestion,
          userAnswer: evalAnswer,
          gsPaper: evalGsPaper,
          marks: evalMarks,
          images: mappedImages
        })
      });

      if (!response.ok) {
        let errMsg = 'Evaluation failed.';
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errData = await response.json();
            errMsg = errData.error || errMsg;
          } else {
            const textBody = await response.text();
            if (response.status === 413) {
              errMsg = "The image files you uploaded are too large to process. Please try uploading a smaller image or compressed PDF.";
            } else {
              errMsg = `Server error (${response.status}): ${textBody.substring(0, 150)}`;
            }
          }
        } catch (parseErr) {
          errMsg = `Server returned status ${response.status}`;
        }
        throw new Error(errMsg);
      }

      const evaluation: EvaluationResult = await response.json();
      setEvalResult(evaluation);

      // Save to historical attempts list
      const newAttempt: AnswerAttempt = {
        id: 'attempt-' + Date.now(),
        questionText: evalQuestion,
        gsPaper: evalGsPaper,
        marks: evalMarks,
        userAnswer: evalAnswer || `[Evaluated using ${uploadedPhotos.length} uploaded handwritten pages]`,
        evaluatedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        evaluation
      };

      setAttempts(prev => [newAttempt, ...prev]);
      setEvalFeedbackSuccess(true);
      // Clear uploaded photos after successful evaluation
      setUploadedPhotos([]);
    } catch (err: any) {
      console.error(err);
      setEvalError(err.message || 'Something went wrong during evaluation.');
    } finally {
      setIsEvaluating(false);
    }
  };

  // Generate Topper Model Answer
  const handleGenerateAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genQuestion.trim()) {
      setGenError('Please provide or select a question to generate.');
      return;
    }

    setIsGenerating(true);
    setGenError(null);
    setGenAnswer('');

    try {
      const response = await fetch('/api/mentor/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: genQuestion,
          gsPaper: genGsPaper,
          marks: genMarks,
          brainstorm: enableEssayBrainstorm
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Answer generation failed.');
      }

      const data = await response.json();
      setGenAnswer(data.text);
    } catch (err: any) {
      console.error(err);
      setGenError(err.message || 'Failed to generate model answer.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Direct generation after evaluation transition
  const handleGenerateModelFromEvaluation = async (question: string, paper: GSPaper, marks: 10 | 15 | 125) => {
    setGenQuestion(question);
    setGenGsPaper(paper);
    setGenMarks(marks);
    setActiveTab('generate');
    
    setIsGenerating(true);
    setGenError(null);
    setGenAnswer('');

    try {
      const response = await fetch('/api/mentor/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          gsPaper: paper,
          marks,
          brainstorm: enableEssayBrainstorm
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Answer generation failed.');
      }

      const data = await response.json();
      setGenAnswer(data.text);
    } catch (err: any) {
      console.error(err);
      setGenError(err.message || 'Failed to generate model answer.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Save generated model answer to notebook
  const handleSaveModelAnswer = () => {
    if (!genAnswer) return;
    
    const isAlreadySaved = savedModelAnswers.some(ans => ans.questionText === genQuestion);
    if (isAlreadySaved) {
      alert("This model answer is already saved in your progress dashboard!");
      return;
    }

    const newSaved: SavedModelAnswer = {
      id: 'saved-' + Date.now(),
      questionText: genQuestion,
      gsPaper: genGsPaper,
      marks: genMarks,
      modelAnswerText: genAnswer,
      savedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    setSavedModelAnswers(prev => [newSaved, ...prev]);
    setAnswerSavedNotification(true);
    setTimeout(() => setAnswerSavedNotification(false), 3000);
  };

  // Delete evaluation attempt
  const handleDeleteAttempt = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Remove Evaluation Attempt",
      message: "Are you sure you want to remove this attempt from your history? This action is permanent and cannot be undone.",
      onConfirm: () => {
        setAttempts(prev => prev.filter(att => att.id !== id));
      }
    });
  };

  // Filter Vault Reference items
  const filteredVault = HIGH_YIELD_VAULT.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(vaultSearch.toLowerCase()) || 
                          item.description.toLowerCase().includes(vaultSearch.toLowerCase()) ||
                          item.category.toLowerCase().includes(vaultSearch.toLowerCase());
    const matchesPaper = vaultPaperFilter === 'All' || item.paper === vaultPaperFilter;
    return matchesSearch && matchesPaper;
  });

  // Calculate stats for Dashboard (tracking only actual user attempts, excluding mock copies)
  const realAttempts = attempts.filter(att => !att.id.startsWith('mock'));
  const totalAttemptsCount = realAttempts.length;
  const averagePercentageScore = totalAttemptsCount > 0 
    ? Math.round(realAttempts.reduce((acc, curr) => acc + (curr.evaluation.marksAwarded / curr.marks), 0) / totalAttemptsCount * 100)
    : 0;
  
  const bestScoreAttempt = totalAttemptsCount > 0
    ? realAttempts.reduce((best, curr) => {
        const currPct = curr.evaluation.marksAwarded / curr.marks;
        const bestPct = best ? best.evaluation.marksAwarded / best.marks : 0;
        return currPct > bestPct ? curr : best;
      }, null as AnswerAttempt | null)
    : null;

  const paperDistribution = realAttempts.reduce((acc, curr) => {
    acc[curr.gsPaper] = (acc[curr.gsPaper] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-200 flex flex-col ${darkMode ? 'bg-[#0B0F17] text-[#F1F5F9]' : 'bg-[#FAF9F6] text-[#1E293B]'}`}>
      {/* Top Professional Academic Header */}
      <header className={`border-b sticky top-0 z-30 shadow-xs px-4 sm:px-6 py-4 transition-colors duration-200 ${darkMode ? 'bg-[#151D2A] border-slate-800' : 'bg-white border-[#E2E8F0]'}`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-950 rounded-lg flex items-center justify-center text-amber-500 shadow-md">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <h1 className={`text-xl sm:text-2xl font-serif font-bold tracking-tight flex items-center gap-2 ${darkMode ? 'text-white' : 'text-[#0F172A]'}`}>
                UPSC MAINS ELITE MENTOR
                <span className="hidden sm:inline-block px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded font-sans">CSE-2026</span>
              </h1>
              <p className={`text-xs font-sans tracking-wide ${darkMode ? 'text-slate-400' : 'text-[#64748B]'}`}>HIGH-YIELD ANSWER EVALUATOR • TOPPER MODEL ARCHITECT • OFFICIAL CRITERIA RUBRICS</p>
            </div>
          </div>

          {/* Active Navigation Tabs & Theme Toggle */}
          <div className="flex items-center gap-2">
            <nav className={`flex flex-wrap gap-1 p-1 rounded-lg border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
              <button 
                onClick={() => setActiveTab('evaluate')}
                className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all flex items-center gap-1.5 ${activeTab === 'evaluate' ? (darkMode ? 'bg-indigo-900 text-white shadow-sm' : 'bg-white text-indigo-950 shadow-xs') : (darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-[#64748B] hover:text-indigo-950')}`}
              >
                <FileText className="w-4 h-4 text-indigo-500" />
                <span>Evaluator</span>
              </button>
              <button 
                onClick={() => setActiveTab('generate')}
                className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all flex items-center gap-1.5 ${activeTab === 'generate' ? (darkMode ? 'bg-indigo-900 text-white shadow-sm' : 'bg-white text-indigo-950 shadow-xs') : (darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-[#64748B] hover:text-indigo-950')}`}
              >
                <Award className="w-4 h-4 text-amber-500" />
                <span>Model Answer</span>
              </button>
              <button 
                onClick={() => setActiveTab('vault')}
                className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all flex items-center gap-1.5 ${activeTab === 'vault' ? (darkMode ? 'bg-indigo-900 text-white shadow-sm' : 'bg-white text-indigo-950 shadow-xs') : (darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-[#64748B] hover:text-indigo-950')}`}
              >
                <Landmark className="w-4 h-4 text-emerald-500" />
                <span>Reference Vault</span>
              </button>
              <button 
                onClick={() => setActiveTab('progress')}
                className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all flex items-center gap-1.5 ${activeTab === 'progress' ? (darkMode ? 'bg-indigo-900 text-white shadow-sm' : 'bg-white text-indigo-950 shadow-xs') : (darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-[#64748B] hover:text-indigo-950')}`}
              >
                <TrendingUp className="w-4 h-4 text-purple-500" />
                <span>My Progress</span>
              </button>
            </nav>

            {/* Premium Dark Mode Toggle button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${darkMode ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-850' : 'bg-white border-slate-200 text-indigo-950 hover:bg-slate-50'}`}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Warning/Alert Banner for Key Setup */}
      {apiKeyStatus.checked && !apiKeyStatus.configured && (
        <div className={`border-b px-4 py-3 ${darkMode ? 'bg-slate-900/60 border-slate-800 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="text-xs sm:text-sm">
              <span className="font-semibold">Backend Offline Mode:</span> Gemini API Key is not set in environment secrets. Answers and evaluations are currently simulated/offline. Please configure <code className={`${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-amber-100 text-slate-800'} px-1 py-0.5 rounded font-mono`}>GEMINI_API_KEY</code> in the <b>Settings &gt; Secrets</b> menu to activate elite full-stack mentoring.
            </div>
          </div>
        </div>
      )}

      {/* Main Viewport Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: ANSWER EVALUATOR */}
          {activeTab === 'evaluate' && (
            <motion.div 
              key="tab-evaluate"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Question Selection & Answer Form (Left side) */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className={`border rounded-xl p-5 shadow-xs transition-colors duration-200 ${darkMode ? 'bg-[#111827] border-slate-800 text-slate-100' : 'bg-white border-[#E2E8F0] text-[#1E293B]'}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-indigo-950 text-amber-400 rounded-md flex items-center justify-center font-bold text-sm shadow-xs">
                      1
                    </div>
                    <div>
                      <h2 className={`font-serif font-bold text-lg ${darkMode ? 'text-white' : 'text-[#0F172A]'}`}>Select Syllabus Topic or Enter Question</h2>
                      <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-[#64748B]'}`}>Choose from standard syllabus presets or paste a custom exam query</p>
                    </div>
                  </div>

                  {/* Preset Questions Slider */}
                  <div className="mb-4">
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-400' : 'text-[#475569]'}`}>Preset High-Yield Questions</label>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                      {PRESET_QUESTIONS.map(q => (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => handleSelectPresetForEval(q)}
                          className={`shrink-0 px-3 py-2 text-xs text-left rounded-lg border transition-all max-w-[280px] ${evalQuestion === q.questionText ? (darkMode ? 'bg-indigo-950/60 border-indigo-500 text-white' : 'bg-indigo-50 border-indigo-400 text-indigo-950 font-medium') : (darkMode ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700')}`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-[10px] uppercase text-indigo-500">{q.gsPaper} • {q.marks}M</span>
                            {q.year && <span className="text-[10px] text-slate-500 font-mono">CSE {q.year}</span>}
                          </div>
                          <p className="line-clamp-2 leading-relaxed">{q.questionText}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleEvaluateAnswer} className="space-y-4">
                    {/* Meta configuration */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${darkMode ? 'text-slate-400' : 'text-[#475569]'}`}>GS Syllabus Paper</label>
                        <RichSelect
                          label="GS Syllabus Paper"
                          value={evalGsPaper}
                          onChange={(val) => handleEvalGsPaperChange(val as GSPaper)}
                          isOpen={isOpenEvalPaper}
                          setIsOpen={setIsOpenEvalPaper}
                          darkMode={darkMode}
                          options={[
                            { value: 'GS1', label: 'GS 1: History, Geography, Society', icon: 'BookOpen', desc: 'Art & Culture, Freedom Struggle, Physical & Indian Geography, Social Issues' },
                            { value: 'GS2', label: 'GS 2: Polity, Governance, IR', icon: 'Landmark', desc: 'Constitution, Welfare Schemes, Executive-Legislative-Judiciary friction, Treaties' },
                            { value: 'GS3', label: 'GS 3: Economy, S&T, Environment', icon: 'TrendingUp', desc: 'Agriculture, Macroeconomics, Space & Biotech, Security, Disaster Management' },
                            { value: 'GS4', label: 'GS 4: Ethics, Case Studies', icon: 'ShieldAlert', desc: 'Public Service Values, Nolan Principles, Probity, Case Analysis' },
                            { value: 'Essay', label: 'UPSC Essay Paper', icon: 'FileText', desc: 'Philosophical, Abstract & Thematic Essays (1000-1200 words)' },
                          ]}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${darkMode ? 'text-slate-400' : 'text-[#475569]'}`}>Target Marks</label>
                        <RichSelect
                          label="Target Marks"
                          value={evalMarks}
                          onChange={(val) => handleEvalMarksChange(Number(val) as 10 | 15 | 125)}
                          isOpen={isOpenEvalMarks}
                          setIsOpen={setIsOpenEvalMarks}
                          darkMode={darkMode}
                          options={[
                            { value: 10, label: '10 Marks', icon: 'Award', desc: '150 Words (Recommended time: 7 minutes)' },
                            { value: 15, label: '15 Marks', icon: 'Award', desc: '250 Words (Recommended time: 11 minutes)' },
                            { value: 125, label: '125 Marks', icon: 'FileText', desc: 'UPSC full-length topper essay copy' },
                          ]}
                        />
                      </div>
                    </div>

                    {/* Question Input */}
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${darkMode ? 'text-slate-400' : 'text-[#475569]'}`}>Question Text</label>
                      <textarea
                        value={evalQuestion}
                        onChange={(e) => setEvalQuestion(e.target.value)}
                        placeholder="Type or paste the exam question here..."
                        rows={2}
                        className={`w-full text-sm rounded-lg p-3 outline-none transition-all resize-none ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-200 focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-[#1E293B] focus:border-indigo-500 focus:bg-white'}`}
                      />
                    </div>

                    {/* Multi-Photo Upload Section */}
                    <div className="space-y-2">
                      <label className={`block text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-[#475569]'}`}>
                        Handwritten Copy Page Photos (Optional, Multi-Page)
                      </label>
                      <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                          if (e.dataTransfer.files) {
                            processFiles(e.dataTransfer.files);
                          }
                        }}
                        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${isDragging ? 'border-indigo-500 bg-indigo-55/10' : (darkMode ? 'border-slate-800 bg-slate-900/20 hover:border-slate-700' : 'border-slate-300 bg-slate-50 hover:border-slate-400')}`}
                      >
                        <input
                          type="file"
                          id="eval-photo-upload"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files) {
                              processFiles(e.target.files);
                            }
                          }}
                        />
                        <label htmlFor="eval-photo-upload" className="cursor-pointer w-full flex flex-col items-center">
                          <Upload className={`w-8 h-8 mb-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                          <span className={`text-xs font-semibold block ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                            Drag & Drop or Click to Add Photos of Handwritten Answers
                          </span>
                          <span className={`text-[10px] mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            Seamlessly transcribes and scores multi-page answer sheets
                          </span>
                        </label>
                      </div>

                      {/* Photo Previews */}
                      {uploadedPhotos.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                          {uploadedPhotos.map((photo, idx) => (
                            <div key={idx} className={`relative border rounded-lg p-1.5 flex flex-col gap-1 overflow-hidden group ${darkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                              <div className="aspect-[4/3] rounded overflow-hidden relative bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
                                <img src={photo.data} alt={photo.name} className="object-contain w-full h-full" referrerPolicy="no-referrer" />
                                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <button
                                    type="button"
                                    onClick={() => setUploadedPhotos(prev => prev.filter((_, i) => i !== idx))}
                                    className="p-1 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-colors"
                                    title="Remove image"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                              <div className="flex flex-col min-w-0 px-1">
                                <span className={`text-[9px] font-medium truncate ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{photo.name}</span>
                                <span className="text-[8px] text-slate-400">{(photo.size / 1024).toFixed(0)} KB</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* User Written Copy Input */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className={`block text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-[#475569]'}`}>Your Written Answer Copy (Transcribed Text)</label>
                        <span className={`text-xs font-mono ${darkMode ? 'text-slate-500' : 'text-[#94A3B8]'}`}>{evalAnswer.split(/\s+/).filter(Boolean).length} words</span>
                      </div>
                      <textarea
                        value={evalAnswer}
                        onChange={(e) => setEvalAnswer(e.target.value)}
                        placeholder="Type, transcribe or paste your full handwritten draft answer copy here (or leave blank if photos are uploaded)..."
                        rows={8}
                        className={`w-full text-sm font-sans rounded-lg p-4 outline-none transition-all leading-relaxed ${darkMode ? 'bg-slate-900/50 border-slate-800 text-slate-100 focus:border-indigo-500' : 'bg-[#FDFCFA] border-slate-200 text-slate-800 focus:border-indigo-500'}`}
                      />
                      <p className={`text-[11px] mt-1 leading-relaxed ${darkMode ? 'text-slate-500' : 'text-[#94A3B8]'}`}>
                        Tip: Write naturally. Incorporate paragraph structures, bullet points, and key terms just as you would on a standard UPSC ruled page.
                      </p>
                    </div>

                    {/* Submit Evaluation Trigger */}
                    <button
                      type="submit"
                      disabled={isEvaluating}
                      className="w-full bg-indigo-950 text-white rounded-lg py-3 px-4 font-sans font-semibold text-sm hover:bg-indigo-900 transition-all disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    >
                      {isEvaluating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                          <span>UPSC Examiner evaluating your response copy...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 text-amber-400" />
                          <span>Submit Answer Copy for Evaluation</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Strict Examiner Feedback View (Right side) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className={`border rounded-xl p-5 shadow-xs flex-1 flex flex-col min-h-[500px] transition-colors duration-200 ${darkMode ? 'bg-[#111827] border-slate-800 text-slate-100' : 'bg-white border-[#E2E8F0] text-[#1E293B]'}`}>
                  
                  {evalError && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs py-3 px-4 rounded-lg flex flex-col gap-2 mb-4 dark:bg-rose-950/20 dark:border-rose-900/60 dark:text-rose-300">
                      <div className="flex items-center gap-2 font-semibold">
                        <AlertCircle className="w-4.5 h-4.5 text-rose-500 shrink-0" />
                        <span>Evaluation Error</span>
                      </div>
                      <p className="leading-relaxed">{evalError}</p>
                    </div>
                  )}

                  {!evalResult && !isEvaluating && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-[#FAF9F6] border border-[#E2E8F0]'}`}>
                        <FileText className={`w-8 h-8 ${darkMode ? 'text-slate-500' : 'text-slate-300'}`} />
                      </div>
                      <h3 className={`font-serif font-semibold text-lg ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>Awaiting Answer Submission</h3>
                      <p className={`text-xs max-w-sm mt-1 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Submit your typed or drafted answer on the left. An experienced UPSC evaluation engine will award realistic marks and suggest strategic improvements.
                      </p>
                    </div>
                  )}

                  {isEvaluating && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                      <div className="relative mb-6">
                        <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-950 rounded-full animate-spin"></div>
                        <Award className="w-8 h-8 text-amber-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      </div>
                      <h3 className={`font-serif font-bold text-lg ${darkMode ? 'text-white' : 'text-[#0F172A]'}`}>Strict Examiner Mode Active</h3>
                      <p className={`text-xs max-w-sm mt-2 leading-relaxed animate-pulse ${darkMode ? 'text-slate-400' : 'text-[#64748B]'}`}>
                        Analyzing core demand addressal, indexing historical landmark judgments, verifying relevant constitutional articles, and compiling a high-yield diagnostic sheet...
                      </p>
                    </div>
                  )}

                  {evalResult && !isEvaluating && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-5"
                    >
                      {/* Evaluation Score Ribbon */}
                      <div className="bg-gradient-to-r from-indigo-950 to-indigo-900 text-white rounded-lg p-4 flex justify-between items-center shadow-xs">
                        <div>
                          <p className="text-[10px] text-amber-400 font-semibold tracking-widest uppercase font-mono">OFFICIAL EVALUATION SHEET</p>
                          <h3 className="font-serif font-bold text-base mt-0.5 leading-tight">Mains Test Copy Reviewed</h3>
                          <p className="text-xs text-indigo-200 mt-1">{evalGsPaper} • Max {evalMarks} Marks</p>
                        </div>
                        <div className="text-center bg-white/10 rounded-lg px-3 py-2 border border-white/10 shrink-0">
                          <div className="text-xs text-amber-400 font-sans font-semibold">MARKS AWARDED</div>
                          <div className="text-3xl font-serif font-bold text-white mt-0.5">
                            {evalResult.marksAwarded}
                            <span className="text-xs text-indigo-300 font-sans font-normal ml-0.5">/ {evalMarks}</span>
                          </div>
                          <div className="text-[10px] text-indigo-200 font-mono mt-0.5">
                            ({Math.round((evalResult.marksAwarded / evalMarks) * 100)}%)
                          </div>
                        </div>
                      </div>

                      {/* Score Rationale */}
                      <div className={`border rounded-lg p-3 text-xs leading-relaxed transition-all ${darkMode ? 'bg-slate-900/50 border-slate-800 text-slate-300' : 'bg-[#FAF9F6] border-indigo-100 text-[#475569]'}`}>
                        <span className={`font-semibold block mb-1 ${darkMode ? 'text-white' : 'text-indigo-950'}`}>Examiner's Core Rationale:</span>
                        {evalResult.marksRationale}
                      </div>

                      {/* OFFICIAL UPSC CRITERIA RUBRIC TABLE */}
                      <div>
                        <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${darkMode ? 'text-white' : 'text-[#0F172A]'}`}>
                          <Award className="w-4 h-4 text-indigo-500 shrink-0" />
                          <span>Diagnostic Criteria Evaluation Rubric</span>
                        </h4>
                        <div className={`border rounded-lg overflow-hidden ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                          <table className="w-full text-left border-collapse text-[11px] sm:text-xs">
                            <thead>
                              <tr className={darkMode ? 'bg-slate-900/80 text-slate-300 border-b border-slate-800' : 'bg-slate-50 text-[#475569] border-b border-slate-200'}>
                                <th className="p-2 font-semibold">UPSC Criteria</th>
                                <th className="p-2 font-semibold text-center">Rating</th>
                                <th className="p-2 font-semibold">Diagnostics</th>
                              </tr>
                            </thead>
                            <tbody className={`divide-y ${darkMode ? 'divide-slate-800' : 'divide-slate-200'}`}>
                              {[
                                { label: 'Demand Addressal & Relevance', key: 'demandAddressal', defaultRating: 'Strong', defaultRemarks: 'Addressed the core directives of the question.' },
                                { label: 'Structure & Bullet Presentation', key: 'structurePresentation', defaultRating: 'Average', defaultRemarks: 'Include shorter paragraphs and cleaner pointwise lists.' },
                                { label: 'Factual Citations & Value-Adds', key: 'factualValueAddition', defaultRating: 'Strong', defaultRemarks: 'Incorporates appropriate legal references and commission advice.' },
                                { label: 'Analytical PESTEL Depth', key: 'analyticalDepth', defaultRating: 'Strong', defaultRemarks: 'Balanced multi-dimensional outline with socio-economic context.' },
                                { label: 'Diagrams & Mindmaps', key: 'diagramsVisualAid', defaultRating: 'Poor', defaultRemarks: 'Include quick hand-drawn ASCII charts to maximize marks.' }
                              ].map((item) => {
                                const rubricVal = evalResult.rubric || {};
                                const detail = rubricVal[item.key as keyof EvaluationRubric] || { rating: item.defaultRating, remarks: item.defaultRemarks };
                                const ratingColors = {
                                  'Topper-Grade': darkMode ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-100 text-emerald-800',
                                  'Strong': darkMode ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-100 text-blue-800',
                                  'Average': darkMode ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-amber-100 text-amber-800',
                                  'Poor': darkMode ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-rose-100 text-rose-800'
                                }[detail.rating || 'Average'];

                                return (
                                  <tr key={item.key} className={darkMode ? 'hover:bg-slate-800/20' : 'hover:bg-slate-50'}>
                                    <td className="p-2 font-medium">{item.label}</td>
                                    <td className="p-2 text-center">
                                      <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-semibold tracking-wide ${ratingColors}`}>
                                        {detail.rating || 'Average'}
                                      </span>
                                    </td>
                                    <td className={`p-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{detail.remarks || item.defaultRemarks}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Strengths */}
                      <div>
                        <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${darkMode ? 'text-white' : 'text-[#0F172A]'}`}>
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Candidate Strengths</span>
                        </h4>
                        <ul className="space-y-1.5">
                          {evalResult.strengths.map((str, idx) => (
                            <li key={idx} className={`text-xs leading-relaxed pl-5 relative before:content-[''] before:absolute before:left-1.5 before:top-2 before:w-1.5 before:h-1.5 before:bg-emerald-600 before:rounded-full ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                              {str}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Weaknesses */}
                      <div>
                        <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${darkMode ? 'text-white' : 'text-[#0F172A]'}`}>
                          <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                          <span>Identified Bottlenecks / Weaknesses</span>
                        </h4>
                        <ul className="space-y-1.5">
                          {evalResult.weaknesses.map((weak, idx) => (
                            <li key={idx} className={`text-xs leading-relaxed pl-5 relative before:content-[''] before:absolute before:left-1.5 before:top-2 before:w-1.5 before:h-1.5 before:bg-rose-500 before:rounded-full ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                              {weak}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Missing Dimensions */}
                      <div>
                        <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${darkMode ? 'text-white' : 'text-[#0F172A]'}`}>
                          <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>Missing Perspectives / Dimensions</span>
                        </h4>
                        <ul className="space-y-1.5">
                          {evalResult.missingDimensions.map((dim, idx) => (
                            <li key={idx} className={`text-xs leading-relaxed pl-5 relative before:content-[''] before:absolute before:left-1.5 before:top-2 before:w-1.5 before:h-1.5 before:bg-amber-500 before:rounded-full font-sans ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                              {dim}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Value Additions */}
                      <div className="border-t border-slate-100 pt-4">
                        <h4 className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>High-Yield Value Additions (Citations)</span>
                        </h4>
                        <div className="space-y-1.5">
                          {evalResult.suggestedValueAdditions.map((val, idx) => (
                            <div key={idx} className={`border rounded p-2 text-xs leading-relaxed flex items-start gap-2 ${darkMode ? 'bg-indigo-950/20 border-indigo-900/60 text-indigo-300' : 'bg-amber-50 border-amber-100 text-slate-700'}`}>
                              <span className="font-bold text-amber-500 shrink-0 font-sans">+{idx+1}</span>
                              <span className="font-medium">{val}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Diagram Suggestion */}
                      <div>
                        <h4 className={`text-xs font-semibold uppercase tracking-wider mb-1 ${darkMode ? 'text-white' : 'text-[#0F172A]'}`}>Recommended Diagram Space</h4>
                        <p className={`text-xs leading-relaxed border rounded-md p-2.5 font-sans italic ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-[#F8FAFC] border-slate-200 text-slate-600'}`}>
                          {evalResult.suggestedDiagram}
                        </p>
                      </div>

                      {/* Actionable Advice */}
                      <div className={`border rounded-lg p-4 ${darkMode ? 'bg-indigo-950/30 border-indigo-900/50' : 'bg-indigo-50 border-indigo-100'}`}>
                        <h4 className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-2">Examiner Action Plan to Gain +1.5 Marks:</h4>
                        <ul className="space-y-1.5">
                          {evalResult.actionableAdvice.map((adv, idx) => (
                            <li key={idx} className={`text-xs leading-relaxed flex gap-2 ${darkMode ? 'text-indigo-200' : 'text-slate-700'}`}>
                              <span className="font-bold text-indigo-900 font-sans">{idx+1}.</span>
                              <span>{adv}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Dynamic Bridge: Generate AI Answer copy */}
                      <div className={`border-t pt-4 flex flex-col gap-2 ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                        <p className={`text-[11px] leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          Ready to see how an elite UPSC topper would structure this exact essay/answer sheet pointwise?
                        </p>
                        <button
                          type="button"
                          onClick={() => handleGenerateModelFromEvaluation(evalQuestion, evalGsPaper, evalMarks)}
                          className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-sans font-semibold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                        >
                          <Award className="w-4.5 h-4.5 text-yellow-300" />
                          <span>Generate Elite Topper Model Answer</span>
                        </button>
                      </div>

                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: MODEL ANSWER GENERATOR */}
          {activeTab === 'generate' && (
            <motion.div 
              key="tab-generate"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Question selector & control box (Left side) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className={`border rounded-xl p-5 shadow-xs transition-colors duration-200 ${darkMode ? 'bg-[#111827] border-slate-800 text-slate-100' : 'bg-white border-[#E2E8F0] text-[#1E293B]'}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <BookMarked className={`w-6 h-6 shrink-0 ${darkMode ? 'text-indigo-400' : 'text-indigo-950'}`} />
                    <div>
                      <h2 className={`font-serif font-bold text-lg ${darkMode ? 'text-white' : 'text-[#0F172A]'}`}>Topper Answer Architect</h2>
                      <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-[#64748B]'}`}>Generate comprehensive copies containing exact articles & diagrams</p>
                    </div>
                  </div>

                  {/* Preset Selector */}
                  <div className="mb-4">
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-slate-400' : 'text-[#475569]'}`}>Select Syllabus Question</label>
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {PRESET_QUESTIONS.map(q => (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => handleSelectPresetForGen(q)}
                          className={`w-full text-left p-2 rounded-lg border text-xs transition-all flex flex-col gap-1 ${genQuestion === q.questionText ? (darkMode ? 'bg-indigo-950/60 border-indigo-500 text-white' : 'bg-indigo-50 border-indigo-300 text-indigo-950') : (darkMode ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700')}`}
                        >
                          <div className="flex justify-between items-center text-[10px] font-mono font-semibold uppercase text-slate-500">
                            <span>{q.gsPaper} • {q.marks} Marks</span>
                            {q.year && <span className="text-indigo-500">CSE {q.year}</span>}
                          </div>
                          <p className="line-clamp-2 leading-relaxed">{q.questionText}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleGenerateAnswer} className="space-y-4">
                    {/* Meta configuration */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${darkMode ? 'text-slate-400' : 'text-[#475569]'}`}>GS Paper</label>
                        <RichSelect
                          label="GS Paper"
                          value={genGsPaper}
                          onChange={(val) => handleGenGsPaperChange(val as GSPaper)}
                          isOpen={isOpenGenPaper}
                          setIsOpen={setIsOpenGenPaper}
                          darkMode={darkMode}
                          options={[
                            { value: 'GS1', label: 'GS 1: History, Geography, Society', icon: 'BookOpen', desc: 'Art & Culture, Freedom Struggle, Physical & Indian Geography, Social Issues' },
                            { value: 'GS2', label: 'GS 2: Polity, Governance, IR', icon: 'Landmark', desc: 'Constitution, Welfare Schemes, Executive-Legislative-Judiciary friction, Treaties' },
                            { value: 'GS3', label: 'GS 3: Economy, S&T, Environment', icon: 'TrendingUp', desc: 'Agriculture, Macroeconomics, Space & Biotech, Security, Disaster Management' },
                            { value: 'GS4', label: 'GS 4: Ethics, Case Studies', icon: 'ShieldAlert', desc: 'Public Service Values, Nolan Principles, Probity, Case Analysis' },
                            { value: 'Essay', label: 'UPSC Essay Paper', icon: 'FileText', desc: 'Philosophical, Abstract & Thematic Essays (1000-1200 words)' },
                          ]}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${darkMode ? 'text-slate-400' : 'text-[#475569]'}`}>Target Marks</label>
                        <RichSelect
                          label="Target Marks"
                          value={genMarks}
                          onChange={(val) => handleGenMarksChange(Number(val) as 10 | 15 | 125)}
                          isOpen={isOpenGenMarks}
                          setIsOpen={setIsOpenGenMarks}
                          darkMode={darkMode}
                          options={[
                            { value: 10, label: '10 Marks', icon: 'Award', desc: '150 Words (Recommended time: 7 minutes)' },
                            { value: 15, label: '15 Marks', icon: 'Award', desc: '250 Words (Recommended time: 11 minutes)' },
                            { value: 125, label: '125 Marks', icon: 'FileText', desc: 'UPSC full-length topper essay copy' },
                          ]}
                        />
                      </div>
                    </div>

                    {/* Question Input */}
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${darkMode ? 'text-slate-400' : 'text-[#475569]'}`}>Enter Custom Question</label>
                      <textarea
                        value={genQuestion}
                        onChange={(e) => setGenQuestion(e.target.value)}
                        placeholder="State any standard or past CSE question here..."
                        rows={4}
                        className={`w-full text-xs rounded-lg p-3 outline-none transition-all resize-none leading-relaxed ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-200 focus:border-indigo-500 font-sans' : 'bg-slate-50 border-slate-200 text-[#1E293B] focus:border-indigo-500 focus:bg-white'}`}
                      />
                    </div>

                    {/* Association Brainstorming Option */}
                    <div className={`p-3.5 rounded-lg border flex items-center justify-between transition-all ${darkMode ? 'bg-indigo-950/20 border-indigo-900/40 text-indigo-200' : 'bg-indigo-50/50 border-indigo-100 text-indigo-950'}`}>
                      <div className="flex items-start gap-2.5 mr-3">
                        <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <div className="text-left">
                          <span className={`text-xs font-semibold block ${darkMode ? 'text-slate-200' : 'text-indigo-950'}`}>Enable Association Mapping Matrix</span>
                          <span className={`text-[10px] leading-normal block ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Generates the interdisciplinary brainstorming matrix before the model answer</span>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input 
                          id="enable-essay-brainstorm-checkbox"
                          type="checkbox" 
                          checked={enableEssayBrainstorm} 
                          onChange={(e) => setEnableEssayBrainstorm(e.target.checked)} 
                          className="sr-only peer" 
                        />
                        <div className="w-9 h-5 bg-slate-300 dark:bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isGenerating}
                      className="w-full bg-indigo-950 text-white rounded-lg py-3 px-4 font-sans font-semibold text-sm hover:bg-indigo-900 transition-all disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                          <span>Generating Topper Answer Sheet...</span>
                        </>
                      ) : (
                        <>
                          <Award className="w-4 h-4 text-amber-400" />
                          <span>Architect Topper Model Answer</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Topper Model Answer View (Right side) */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className={`border rounded-xl p-5 shadow-xs flex-1 flex flex-col min-h-[500px] transition-colors duration-200 ${darkMode ? 'bg-[#111827] border-slate-800 text-slate-100' : 'bg-white border-[#E2E8F0] text-[#1E293B]'}`}>
                  
                  {genError && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs py-3 px-4 rounded-lg flex flex-col gap-2 mb-4 dark:bg-rose-950/20 dark:border-rose-900/60 dark:text-rose-300">
                      <div className="flex items-center gap-2 font-semibold">
                        <AlertCircle className="w-4.5 h-4.5 text-rose-500 shrink-0" />
                        <span>Generation Error</span>
                      </div>
                      <p className="leading-relaxed">{genError}</p>
                    </div>
                  )}

                  {!genAnswer && !isGenerating && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-[#FAF9F6] border border-[#E2E8F0]'}`}>
                        <Award className={`w-8 h-8 ${darkMode ? 'text-slate-500' : 'text-slate-300'}`} />
                      </div>
                      <h3 className={`font-serif font-semibold text-lg ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>Awaiting Answer Synthesis</h3>
                      <p className={`text-xs max-w-sm mt-1 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Input or select a question to synthesise an exact topper-style answer. It compiles an issue-based introduction, PESTEL analysis, expert commissions, and an ASCII visual flowchart.
                      </p>
                    </div>
                  )}

                  {isGenerating && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                      <div className="relative mb-6">
                        <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-950 rounded-full animate-spin"></div>
                        <BookOpen className="w-8 h-8 text-indigo-950 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      </div>
                      <h3 className={`font-serif font-bold text-lg ${darkMode ? 'text-white' : 'text-[#0F172A]'}`}>Synthesizing UPSC Answer copy</h3>
                      <p className={`text-xs max-w-sm mt-2 leading-relaxed animate-pulse ${darkMode ? 'text-slate-400' : 'text-[#64748B]'}`}>
                        Drafting multi-dimensional bullet layers, weaving in relevant landmark precedents, building the 1-minute hand-drawn ASCII diagram concept...
                      </p>
                    </div>
                  )}

                  {genAnswer && !isGenerating && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4 flex-1 flex flex-col"
                    >
                      {/* Synthesized header controls */}
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <div>
                          <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-sm">
                            {genGsPaper} • Model Copy
                          </span>
                          <h3 className={`font-serif font-bold text-base mt-1 line-clamp-1 ${darkMode ? 'text-white' : 'text-[#0F172A]'}`}>{genQuestion}</h3>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleCopy(genAnswer, 'genAnswer')}
                            className={`p-2 rounded-lg transition-all border ${darkMode ? 'text-slate-400 border-slate-800 hover:bg-slate-800' : 'text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                            title="Copy full answer text"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleSaveModelAnswer}
                            className="px-3 py-2 bg-indigo-950 text-white rounded-lg hover:bg-indigo-900 transition-all font-sans text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save to Dashboard</span>
                          </button>
                        </div>
                      </div>

                      {/* Answer Saved alert */}
                      {answerSavedNotification && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs py-2 px-3 rounded-md flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>Saved successfully to your Progress Dashboard!</span>
                        </div>
                      )}

                      {/* Actual synthesized copy - Ruled sheet layout */}
                      <div className={`border rounded-lg p-5 sm:p-6 shadow-xs leading-relaxed max-h-[500px] overflow-y-auto ${darkMode ? 'bg-slate-900/40 border-slate-800 text-slate-100' : 'bg-[#FAF9F6] border-slate-200 text-slate-800'}`}>
                        <div className="markdown-body font-sans">
                          <Markdown>{genAnswer}</Markdown>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: REFERENCE VAULT */}
          {activeTab === 'vault' && (
            <motion.div 
              key="tab-vault"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Header description */}
              <div className="bg-indigo-950 text-white rounded-xl p-5 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="font-serif font-bold text-xl text-amber-400">High-Yield UPSC Reference Vault</h2>
                  <p className="text-xs text-indigo-200 max-w-2xl mt-1 leading-relaxed">
                    A permanent visual repository of gold-standard value additions. These represent the specific Articles, landmark SC cases, and commissions that toppers write to elevate their raw marks by 1-2 per answer.
                  </p>
                </div>
                <div className="flex gap-2 w-full md:w-auto shrink-0">
                  <select
                    value={vaultPaperFilter}
                    onChange={(e) => setVaultPaperFilter(e.target.value)}
                    className="bg-white/10 text-white border border-white/20 text-xs rounded-lg px-3 py-2 outline-none"
                  >
                    <option value="All" className="text-slate-900">All Papers</option>
                    <option value="GS1" className="text-slate-900">GS 1 Reference</option>
                    <option value="GS2" className="text-slate-900">GS 2 Reference</option>
                    <option value="GS3" className="text-slate-900">GS 3 Reference</option>
                    <option value="GS4" className="text-slate-900">GS 4 Reference</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Search vault keywords..."
                    value={vaultSearch}
                    onChange={(e) => setVaultSearch(e.target.value)}
                    className="bg-white/10 text-white placeholder-indigo-200 border border-white/20 text-xs rounded-lg px-3 py-2 outline-none w-full md:w-48 font-sans"
                  />
                </div>
              </div>

              {/* Dynamic Daily Current Affairs Section */}
              <div className={`border rounded-xl p-5 transition-colors duration-200 ${darkMode ? 'bg-indigo-950/20 border-indigo-900/50' : 'bg-indigo-50/50 border-indigo-100'}`}>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse shrink-0"></span>
                    <h3 className={`font-serif font-bold text-base ${darkMode ? 'text-white' : 'text-indigo-950'}`}>Daily High-Yield Current Affairs Feed</h3>
                  </div>
                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded">
                    Auto-Updated Daily
                  </span>
                </div>

                {isLoadingDailyFeed ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`p-4 border rounded-lg animate-pulse space-y-3 ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <div className="h-4 bg-slate-700 rounded w-1/3"></div>
                        <div className="h-5 bg-slate-700 rounded w-3/4"></div>
                        <div className="h-10 bg-slate-700 rounded w-full"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {dailyFeed.map((item: any, idx: number) => (
                      <div key={item.id || idx} className={`p-4 border rounded-lg flex flex-col justify-between transition-all duration-200 hover:shadow-xs ${darkMode ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded font-mono ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                              {item.category}
                            </span>
                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-indigo-100 text-indigo-800 rounded font-mono">
                              {item.paper}
                            </span>
                          </div>
                          <h4 className={`font-serif font-bold text-sm leading-snug ${darkMode ? 'text-slate-100' : 'text-[#0F172A]'}`}>
                            {item.title}
                          </h4>
                          <p className={`text-xs mt-2 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            {item.description}
                          </p>
                        </div>

                        <div className="border-t border-dashed border-slate-200 dark:border-slate-800 mt-3 pt-2 text-left">
                          <span className={`text-[10px] font-bold uppercase block ${darkMode ? 'text-amber-400' : 'text-indigo-600'}`}>UPSC Topper Application:</span>
                          <p className={`text-xs leading-relaxed italic mt-1 p-2.5 rounded border ${darkMode ? 'bg-indigo-950/40 border-indigo-900/30 text-indigo-200' : 'bg-indigo-50/70 border-indigo-100 text-slate-800 font-medium'}`}>
                            {item.significance || item.topperApplication || item.relevance || item.citation_guideline || "Perfect citation guideline for answer writing."}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bento Grid Reference cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVault.map(fact => (
                  <div key={fact.id} className={`border rounded-xl p-5 shadow-xs transition-colors duration-200 flex flex-col justify-between ${darkMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 hover:shadow-sm hover:border-slate-300'}`}>
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm font-mono ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                          {fact.category}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-sm font-mono">
                          {fact.paper}
                        </span>
                      </div>
                      <h3 className={`font-serif font-bold text-base leading-snug ${darkMode ? 'text-white' : 'text-[#0F172A]'}`}>{fact.title}</h3>
                      <p className={`text-xs mt-2 leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{fact.description}</p>
                    </div>

                    <div className="border-t border-slate-100 mt-4 pt-3 space-y-3">
                      <div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider block ${darkMode ? 'text-indigo-400' : 'text-indigo-950'}`}>UPSC Topper Application:</span>
                        <p className={`text-xs leading-relaxed italic p-2 rounded border mt-1 ${darkMode ? 'bg-slate-900/50 border-slate-800/80 text-indigo-200' : 'bg-slate-50 border-slate-100 text-indigo-900/80'}`}>{fact.significance}</p>
                      </div>

                      <button
                        onClick={() => handleCopy(`${fact.title}: ${fact.description}`, fact.id)}
                        className={`w-full text-xs font-sans font-medium flex items-center justify-center gap-1 py-1.5 rounded-md transition-all border cursor-pointer ${darkMode ? 'text-slate-300 border-slate-800 hover:bg-slate-800' : 'text-slate-500 border-slate-200 hover:bg-slate-100'}`}
                      >
                        {copiedId === fact.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-500 font-semibold">Copied to Clipboard</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy for Answer Draft</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}

                {filteredVault.length === 0 && (
                  <div className={`col-span-full rounded-xl border border-dashed p-8 text-center text-sm ${darkMode ? 'bg-slate-900/50 border-slate-800 text-slate-500' : 'bg-slate-50 border-slate-300 text-slate-500'}`}>
                    <p>No high-yield references match your search criteria.</p>
                  </div>
                )}
              </div>

              {/* Standard Reproducible Diagrams section */}
              <div className={`border rounded-xl p-5 transition-colors duration-200 ${darkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-[#FAF9F6] border-slate-200'}`}>
                <h3 className={`font-serif font-bold text-lg mb-2 ${darkMode ? 'text-white' : 'text-indigo-950'}`}>Standard Under-1-Minute Diagram Blueprint</h3>
                <p className={`text-xs mb-4 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  These represent universal visual templates. When time is running out (under 7 minutes per answer), drawing one of these saves writing 50 words of descriptive text.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Diagram 1 */}
                  <div className={`border rounded-lg p-4 font-mono text-xs ${darkMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'}`}>
                    <span className={`font-sans font-semibold text-xs block mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>1. Hub-and-Spoke Governance Matrix</span>
                    <pre className={`p-3 rounded overflow-x-auto leading-snug ${darkMode ? 'bg-slate-950 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
{`       [Civil Society / NGO]
               ^
               |
               v
[Citizen] <---------> [Constitutional State]
               ^
               |
               v
     [Decentralized PRIs]`}
                    </pre>
                    <p className={`font-sans text-[11px] mt-2 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-[#64748B]'}`}>
                      Use in: Citizen charter, civil society audits, accountability, or public policy distribution loop.
                    </p>
                  </div>

                  {/* Diagram 2 */}
                  <div className={`border rounded-lg p-4 font-mono text-xs ${darkMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'}`}>
                    <span className={`font-sans font-semibold text-xs block mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>2. PESTEL Friction Cycle</span>
                    <pre className={`p-3 rounded overflow-x-auto leading-snug ${darkMode ? 'bg-slate-950 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
{`    (Political Will) ----> (Policy Mandate)
           ^                      |
           |                      v
   (Legal Backup)          (Economic Capital)
           ^                      |
           |                      v
(Socio-Environmental) <--- (Technology R&D)`}
                    </pre>
                    <p className={`font-sans text-[11px] mt-2 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-[#64748B]'}`}>
                      Use in: Climate energy transitions (e.g. Green Hydrogen), industrial corridor challenges, or digital public infrastructure (DPI) implementation.
                    </p>
                  </div>

                  {/* Diagram 3 */}
                  <div className={`border rounded-lg p-4 font-mono text-xs ${darkMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'}`}>
                    <span className={`font-sans font-semibold text-xs block mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>3. Tri-Sector PPP Synergy Hub</span>
                    <pre className={`p-3 rounded overflow-x-auto leading-snug ${darkMode ? 'bg-slate-950 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
{`         [PUBLIC SECTOR]
         (Regulator/Land)
              /    \\
             /      \\
            v        v
    [PRIVATE] <----> [COMMUNITY / NGO]
  (Capex/Tech)       (Grassroots Audit)`}
                    </pre>
                    <p className={`font-sans text-[11px] mt-2 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-[#64748B]'}`}>
                      Use in: GS2/GS3 infrastructure, healthcare delivery models, Kelkar committee PPP recommendations, and rural sanitation/housing.
                    </p>
                  </div>

                  {/* Diagram 4 */}
                  <div className={`border rounded-lg p-4 font-mono text-xs ${darkMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'}`}>
                    <span className={`font-sans font-semibold text-xs block mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>4. Second ARC Integrity Shield</span>
                    <pre className={`p-3 rounded overflow-x-auto leading-snug ${darkMode ? 'bg-slate-950 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
{`     _________________________
    /   [Systemic Reforms]    \\  <-- Outer Shield
   /   _____________________   \\
  /   /  [Accountability]   \\   \\ <-- Middle Guard
 /   /   _________________   \\   \\
|   |   | [Core Values]   |   |   | <-- Integrity Core
 \\   \\   \\_______________/   /   /
  \\   \\_____________________/   /
   \\___________________________/`}
                    </pre>
                    <p className={`font-sans text-[11px] mt-2 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-[#64748B]'}`}>
                      Use in: GS4 Ethics, probity in governance, whistleblower protection, corruption, and Nolan Principles of public life.
                    </p>
                  </div>

                  {/* Diagram 5 */}
                  <div className={`border rounded-lg p-4 font-mono text-xs ${darkMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'}`}>
                    <span className={`font-sans font-semibold text-xs block mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>5. Decentralized Local Governance Hub (Art 243)</span>
                    <pre className={`p-3 rounded overflow-x-auto leading-snug ${darkMode ? 'bg-slate-950 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
{`     [Gram Sabha (Citizenry)]
               |  (Deliberation)
               v
     [Gram Panchayat (PRI)] <===> [Urban Local Bodies]
        /      |      \\
       /       v       \\
 [Funds]  [Functions]  [Functionaries]`}
                    </pre>
                    <p className={`font-sans text-[11px] mt-2 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-[#64748B]'}`}>
                      Use in: GS2 rural/urban development, democratic decentralization (73rd/74th Amendments), local planning, and Devolution Index bottlenecks.
                    </p>
                  </div>

                  {/* Diagram 6 */}
                  <div className={`border rounded-lg p-4 font-mono text-xs ${darkMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'}`}>
                    <span className={`font-sans font-semibold text-xs block mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>6. Circular Economy & Resource Flow Loop</span>
                    <pre className={`p-3 rounded overflow-x-auto leading-snug ${darkMode ? 'bg-slate-950 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
{`   [Raw Material] =====> [Eco-Production]
         ^                    ||
         || (Recycle Loop)    || (Distribute)
         ||                   v
   [Refurbish/Reclaim] <== [Sustainable Use]`}
                    </pre>
                    <p className={`font-sans text-[11px] mt-2 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-[#64748B]'}`}>
                      Use in: GS3 climate change mitigation, sustainable waste management (e-waste, plastic), resource efficiency, and LiFE (Lifestyle for Environment) movement.
                    </p>
                  </div>

                  {/* Diagram 7 */}
                  <div className={`border rounded-lg p-4 font-mono text-xs ${darkMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'}`}>
                    <span className={`font-sans font-semibold text-xs block mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>7. Core-Periphery Geopolitical Spheres</span>
                    <pre className={`p-3 rounded overflow-x-auto leading-snug ${darkMode ? 'bg-slate-950 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
{`      ( GLOBAL HEGEMONS: Core Technology )
                    ||
                    vv (Investment / FDI flow)
      ( EMERGING NODES: Production / Hubs )
                    ||
                    vv (Raw Export / Labor)
      ( PERIPHERAL SUPPLY: Resource extraction )`}
                    </pre>
                    <p className={`font-sans text-[11px] mt-2 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-[#64748B]'}`}>
                      Use in: GS2 international relations, global supply chain resilience, India's Indo-Pacific strategy, Global South leadership, and WTO disputes.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}



          {/* TAB 5: MY PROGRESS & HISTORY */}
          {activeTab === 'progress' && (
            <motion.div 
              key="tab-progress"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 text-left"
            >
              {/* Reset Control Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h2 className={`font-serif font-bold text-xl ${darkMode ? 'text-white' : 'text-indigo-950'}`}>Performance Analytics Dashboard</h2>
                  <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Monitor your analytical progression, feedback iterations, and saved gold-standard drafts</p>
                </div>
                {(attempts.length > 0 || savedModelAnswers.length > 0) && (
                  <button
                    onClick={() => {
                      setConfirmDialog({
                        isOpen: true,
                        title: "Delete All Progress & Clear History",
                        message: "CRITICAL WARNING: Are you sure you want to delete ALL evaluation attempts and saved model answers? This will permanently clear your progress and cannot be undone.",
                        onConfirm: () => {
                          setAttempts([]);
                          setSavedModelAnswers([]);
                          localStorage.setItem('upsc_attempts', JSON.stringify([]));
                          localStorage.setItem('upsc_model_answers', JSON.stringify([]));
                        }
                      });
                    }}
                    className={`px-3.5 py-2 rounded-lg text-xs font-sans font-semibold border transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${darkMode ? 'text-rose-400 border-rose-950 bg-rose-950/10 hover:bg-rose-900/20' : 'text-rose-700 border-rose-200 bg-rose-50 hover:bg-rose-100'}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete All Progress & Clear History</span>
                  </button>
                )}
              </div>

              {/* Analytics Bento Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                
                {/* Answers Evaluated */}
                <div className={`border rounded-xl p-5 shadow-xs flex items-center justify-between transition-colors duration-200 ${darkMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Draft copies evaluated</span>
                    <h3 className={`font-serif font-bold text-2xl mt-1 ${darkMode ? 'text-white' : 'text-indigo-950'}`}>{totalAttemptsCount} Attempts</h3>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${darkMode ? 'bg-indigo-950/40 text-indigo-400' : 'bg-indigo-50 text-indigo-800'}`}>
                    <FileText className="w-5 h-5" />
                  </div>
                </div>

                {/* Average Marks */}
                <div className={`border rounded-xl p-5 shadow-xs flex items-center justify-between transition-colors duration-200 ${darkMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Average Topper grade</span>
                    <h3 className="font-serif font-bold text-2xl text-amber-500 mt-1">{averagePercentageScore}% Efficiency</h3>
                    <p className={`text-[10px] mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>UPSC topper threshold: ~45-55%</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${darkMode ? 'bg-amber-950/40 text-amber-500' : 'bg-amber-50 text-amber-800'}`}>
                    <Award className="w-5 h-5" />
                  </div>
                </div>

                {/* Best Score */}
                <div className={`border rounded-xl p-5 shadow-xs flex items-center justify-between transition-colors duration-200 ${darkMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Personal Best copy</span>
                    <h3 className="font-serif font-bold text-xl text-emerald-500 mt-1">
                      {bestScoreAttempt ? `${bestScoreAttempt.evaluation.marksAwarded} / ${bestScoreAttempt.marks}` : 'N/A'}
                    </h3>
                    <p className={`text-[10px] mt-1 line-clamp-1 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>{bestScoreAttempt ? bestScoreAttempt.questionText : 'No data yet'}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${darkMode ? 'bg-emerald-950/40 text-emerald-500' : 'bg-emerald-50 text-emerald-800'}`}>
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </div>

                {/* Saved answers */}
                <div className={`border rounded-xl p-5 shadow-xs flex items-center justify-between transition-colors duration-200 ${darkMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Topper Sheets Saved</span>
                    <h3 className={`font-serif font-bold text-2xl mt-1 ${darkMode ? 'text-white' : 'text-[#0F172A]'}`}>{savedModelAnswers.length} Answers</h3>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${darkMode ? 'bg-purple-950/40 text-purple-400' : 'bg-purple-50 text-purple-800'}`}>
                    <BookmarkCheck className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Progress History List & Saved Notebook */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Historical Evaluated Copies */}
                <div className={`lg:col-span-7 border rounded-xl p-5 shadow-xs transition-colors duration-200 ${darkMode ? 'bg-[#111827] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-[#1E293B]'}`}>
                  <h3 className="font-serif font-bold text-lg mb-3 flex items-center gap-2">
                    <span className={darkMode ? 'text-white' : 'text-indigo-950'}>Mains Answer Evaluation History</span>
                    <span className={`text-xs font-sans font-semibold rounded px-2 py-0.5 ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{attempts.length} Total</span>
                  </h3>

                  <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                    {attempts.map(att => (
                      <div key={att.id} className={`border rounded-lg p-4 relative group transition-all ${darkMode ? 'border-slate-800 bg-slate-900/40 hover:border-slate-700' : 'border-slate-200 bg-[#FDFCFA] hover:border-slate-300'}`}>
                        <div className="flex justify-between items-start gap-4 mb-2">
                          <div>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm font-mono ${darkMode ? 'bg-indigo-950/50 text-indigo-300' : 'bg-indigo-50 text-indigo-800'}`}>
                              {att.gsPaper} • {att.marks} Marks
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 ml-2">{att.evaluatedAt}</span>
                          </div>
                          
                          {/* Top marks display */}
                          <div className="text-right">
                            <span className={`text-base font-serif font-bold ${darkMode ? 'text-white' : 'text-indigo-950'}`}>{att.evaluation.marksAwarded} / {att.marks}</span>
                          </div>
                        </div>

                        <h4 className={`font-serif font-semibold text-sm leading-relaxed mb-2 ${darkMode ? 'text-slate-200' : 'text-[#0F172A]'}`}>{att.questionText}</h4>
                        
                        {/* Expandable/detailed feedback overview */}
                        <div className={`border rounded p-2.5 text-xs leading-relaxed mb-3 ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                          <span className={`font-semibold block mb-0.5 ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>Examiner feedback:</span>
                          {att.evaluation.marksRationale}
                        </div>

                        <div className="flex justify-between items-center text-[11px] border-t border-slate-100 pt-2">
                          <button
                            onClick={() => {
                              setEvalQuestion(att.questionText);
                              setEvalAnswer(att.userAnswer);
                              setEvalGsPaper(att.gsPaper);
                              setEvalMarks(att.marks as any);
                              setEvalResult(att.evaluation);
                              setActiveTab('evaluate');
                            }}
                            className="text-indigo-500 hover:text-indigo-400 font-semibold flex items-center gap-0.5 cursor-pointer"
                          >
                            <span>Open Detailed Diagnostic Report</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>

                          <button
                            onClick={() => handleDeleteAttempt(att.id)}
                            className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${darkMode ? 'text-rose-400 border-rose-900/40 bg-rose-950/10 hover:bg-rose-950/30' : 'text-rose-600 border-rose-200 bg-rose-50 hover:bg-rose-100'}`}
                            title="Delete attempt from progress tracker"
                          >
                            <Trash2 className="w-3.5 h-3.5 shrink-0" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {attempts.length === 0 && (
                      <div className="text-center py-10 text-slate-400">
                        <FileText className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                        <p className="text-sm">You have not submitted any answer copies for review yet.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Saved Model Answers Notebook */}
                <div className={`lg:col-span-5 border rounded-xl p-5 shadow-xs transition-colors duration-200 ${darkMode ? 'bg-[#111827] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-[#1E293B]'}`}>
                  <h3 className="font-serif font-bold text-lg mb-3 flex items-center gap-2">
                    <span className={darkMode ? 'text-white' : 'text-indigo-950'}>Saved Topper Answer Notebook</span>
                    <span className={`text-xs font-sans font-semibold rounded px-2 py-0.5 ${darkMode ? 'bg-purple-950 text-purple-300' : 'bg-purple-50 text-purple-700'}`}>{savedModelAnswers.length}</span>
                  </h3>

                  <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                    {savedModelAnswers.map(ans => (
                      <div key={ans.id} className={`border rounded-lg p-3 relative group transition-all ${darkMode ? 'border-slate-800 bg-slate-900/40 hover:border-slate-700' : 'border-slate-200 bg-[#FAF9F6] hover:border-slate-300'}`}>
                        <div className="flex justify-between items-center mb-1">
                          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded font-mono ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                            {ans.gsPaper} • {ans.marks}M
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{ans.savedAt}</span>
                        </div>
                        <h4 className={`font-serif font-bold text-xs leading-normal line-clamp-2 mb-2 ${darkMode ? 'text-slate-200' : 'text-[#0F172A]'}`}>{ans.questionText}</h4>

                        <div className="flex justify-between items-center text-[10px] border-t border-slate-100 pt-2">
                          <button
                            onClick={() => {
                              setGenQuestion(ans.questionText);
                              setGenGsPaper(ans.gsPaper);
                              setGenMarks(ans.marks as any);
                              setGenAnswer(ans.modelAnswerText);
                              setActiveTab('generate');
                            }}
                            className="text-indigo-500 hover:text-indigo-400 font-semibold flex items-center gap-0.5 cursor-pointer"
                          >
                            <span>Study Model Sheet</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              setConfirmDialog({
                                isOpen: true,
                                title: "Remove Saved Answer",
                                message: "Are you sure you want to remove this saved answer sheet from your notebook?",
                                onConfirm: () => {
                                  setSavedModelAnswers(prev => prev.filter(a => a.id !== ans.id));
                                }
                              });
                            }}
                            className="text-rose-500 hover:text-rose-400 p-1 cursor-pointer"
                            title="Delete model answer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {savedModelAnswers.length === 0 && (
                      <div className="text-center py-10 text-slate-400">
                        <BookmarkCheck className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                        <p className="text-sm">No synthesized topper sheets saved in your notebook yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Simplified, Humble Dark-Mode-Friendly Footer */}
      <footer className={`border-t py-6 px-4 text-center text-xs tracking-wide mt-10 transition-colors duration-200 ${darkMode ? 'border-slate-800 bg-[#0B0F19] text-slate-500' : 'border-[#E2E8F0] bg-white text-[#64748B]'}`}>
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] uppercase font-mono">© 2026 UPSC Mains Elite Mentor • Crafted for Gold-Standard Achievement</p>
        </div>
      </footer>

      {/* Custom Confirmation Dialog Modal */}
      <AnimatePresence>
        {confirmDialog?.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmDialog(null)}
              className="absolute inset-0 bg-slate-950"
            />
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`relative max-w-md w-full rounded-xl border p-5 shadow-2xl z-10 transition-all font-sans ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}
            >
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-serif font-bold text-base leading-snug">{confirmDialog.title}</h3>
                  <p className={`text-xs mt-1.5 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {confirmDialog.message}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex justify-end gap-2 text-xs font-semibold font-sans">
                <button
                  type="button"
                  onClick={() => setConfirmDialog(null)}
                  className={`px-3.5 py-2 rounded-lg border transition-all cursor-pointer ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750' : 'bg-slate-100 border-slate-200 text-slate-750 hover:bg-slate-200'}`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    confirmDialog.onConfirm();
                    setConfirmDialog(null);
                  }}
                  className="px-3.5 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-all cursor-pointer shadow-sm"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
