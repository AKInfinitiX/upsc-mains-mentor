export type GSPaper = 'GS1' | 'GS2' | 'GS3' | 'GS4' | 'Essay';

export interface SyllabusTopic {
  id: string;
  paper: GSPaper;
  title: string;
  subtopic: string;
  coreKeywords: string[];
  topperTips: string;
}

export interface PresetQuestion {
  id: string;
  gsPaper: GSPaper;
  marks: 10 | 15 | 125;
  questionText: string;
  year?: string;
  subtopic: string;
}

export interface RubricDetail {
  rating: 'Topper-Grade' | 'Strong' | 'Average' | 'Poor';
  remarks: string;
}

export interface EvaluationRubric {
  demandAddressal: RubricDetail;
  structurePresentation: RubricDetail;
  factualValueAddition: RubricDetail;
  analyticalDepth: RubricDetail;
  diagramsVisualAid: RubricDetail;
}

export interface EvaluationResult {
  marksAwarded: number;
  marksRationale: string;
  strengths: string[];
  weaknesses: string[];
  missingDimensions: string[];
  suggestedValueAdditions: string[];
  suggestedDiagram: string;
  actionableAdvice: string[];
  rubric?: EvaluationRubric;
}

export interface AnswerAttempt {
  id: string;
  questionText: string;
  gsPaper: GSPaper;
  marks: number;
  userAnswer: string;
  evaluatedAt: string;
  evaluation: EvaluationResult;
}

export interface SavedModelAnswer {
  id: string;
  questionText: string;
  gsPaper: GSPaper;
  marks: number;
  modelAnswerText: string;
  savedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface HighYieldFact {
  id: string;
  category: string; // e.g., 'Articles', 'Judgments', 'Committees', 'Data'
  title: string;
  description: string;
  significance: string;
  paper: GSPaper;
}
