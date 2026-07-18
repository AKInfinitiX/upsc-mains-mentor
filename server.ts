import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

const PORT = 3000;

// Helper to simulate top-tier UPSC and current affairs content when using internal service account tokens
const mockGenerateContent = async (params: any) => {
  const contents = params.contents;
  const config = params.config;
  const prompt = typeof contents === 'string' ? contents : JSON.stringify(contents);
  
  // 1. Check if it's the daily current affairs endpoint
  if (prompt.includes("Generate exactly 3 high-yield") || (config?.systemInstruction && config.systemInstruction.includes("research analyst"))) {
    const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    return {
      text: JSON.stringify([
        {
          id: 'ca-daily-1',
          category: 'Daily Policy Shift',
          title: 'Exhaustion of Local Remedies (ELR) in Bilateral Investment Treaties',
          description: 'India is actively incorporating a strict ELR clause in newer BIT negotiations, requiring foreign investors to pursue dispute resolution in domestic judicial forums for at least five years before moving to international arbitration tribunals.',
          significance: 'Perfect citation in GS2 (International Treaties) and GS3 (Investment models, Ease of Doing Business) answers concerning commercial dispute resolution and sovereign immunity.',
          paper: 'GS2',
          date: today
        },
        {
          id: 'ca-daily-2',
          category: 'Daily Legislation',
          title: 'Disaster Management (Amendment) Bill, 2024: Focus on Urban Resiliency',
          description: 'Introduces a dedicated statutory Urban Disaster Management Authority for megacities (headed by commissioners/mayors) to coordinate state-wide storm drainage grids and heat-wave protocols.',
          significance: 'Highly relevant for GS3 Disaster Management answers on climate-adaptive cities, urban floods (e.g. Chennai/Mumbai), and institutional decentralization.',
          paper: 'GS3',
          date: today
        },
        {
          id: 'ca-daily-3',
          category: 'Daily Landmark Report',
          title: 'NITI Aayog\'s Agricultural Resource & Water Security Index 2026',
          description: 'Details a 40% depletion of groundwater tables in critical rice-wheat zones, recommending the mandatory shift of crop electricity subsidies toward micro-irrigation systems.',
          significance: 'Gold-standard citation for GS3 Agriculture and Environment answers addressing depleting water tables, sustainable farming, or reform of state crop procurement subventions.',
          paper: 'GS3',
          date: today
        }
      ])
    };
  }

  // 2. Check if it's the evaluation endpoint
  if (prompt.includes("Evaluate the following UPSC Mains answer copy") || (config?.systemInstruction && config.systemInstruction.includes("evaluation expert"))) {
    let questionText = "UPSC Answer Copy";
    let maxMarks = 10;
    let userText = "";
    let hasImages = false;
    let gsPaper = "";

    // Parse the input contents to extract the user's answer, images, question, and marks
    if (Array.isArray(contents)) {
      for (const item of contents) {
        if (item && typeof item === 'object') {
          if (item.text) {
            const textContent = item.text;
            const qMatch = textContent.match(/Question:\s*["']([^"']+)["']/i);
            if (qMatch && qMatch[1]) questionText = qMatch[1];
            
            const mMatch = textContent.match(/Maximum Marks:\s*(\d+)/i);
            if (mMatch && mMatch[1]) maxMarks = parseInt(mMatch[1]);
            
            const pMatch = textContent.match(/GS Paper\/Subject:\s*([^\n\r]+)/i);
            if (pMatch && pMatch[1]) gsPaper = pMatch[1].trim();
            
            const ansMatch = textContent.match(/Candidate's Written Text Answer Copy:[\s\r\n]*"""[\s\r\n]*([\s\S]*?)[\s\r\n]*"""/i)
                             || textContent.match(/"""([\s\S]*?)"""/);
            if (ansMatch && ansMatch[1]) userText = ansMatch[1].trim();
          } else if (item.inlineData) {
            hasImages = true;
          }
        }
      }
    } else if (typeof contents === 'string') {
      const qMatch = contents.match(/Question:\s*["']([^"']+)["']/i);
      if (qMatch && qMatch[1]) questionText = qMatch[1];
      
      const mMatch = contents.match(/Maximum Marks:\s*(\d+)/i);
      if (mMatch && mMatch[1]) maxMarks = parseInt(mMatch[1]);
      
      const pMatch = contents.match(/GS Paper\/Subject:\s*([^\n\r]+)/i);
      if (pMatch && pMatch[1]) gsPaper = pMatch[1].trim();
      
      const ansMatch = contents.match(/Candidate's Written Text Answer Copy:[\s\r\n]*"""[\s\r\n]*([\s\S]*?)[\s\r\n]*"""/i)
                       || contents.match(/"""([\s\S]*?)"""/);
      if (ansMatch && ansMatch[1]) userText = ansMatch[1].trim();
    }

    // Heuristics for Gibberish & Jumbled Words
    const cleaned = userText.toLowerCase().replace(/[^a-z\s]/g, "");
    const words = cleaned.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;

    const commonWords = new Set([
      "the", "and", "is", "of", "in", "to", "a", "for", "with", "as", "on", "by", "at", "an", "this", "that", "it", 
      "are", "be", "from", "or", "have", "not", "but", "by", "if", "they", "we", "can", "will", "would", "their", "there",
      "water", "india", "constitution", "government", "policy", "law", "river", "court", "state", "federal", "development",
      "developmental", "resource", "dispute", "system", "management", "social", "economic", "political", "national"
    ]);

    let matchedCount = 0;
    for (const word of words) {
      if (commonWords.has(word)) {
        matchedCount++;
      }
    }

    const isVeryShort = wordCount < 5 && !hasImages;
    const hasLongGibberishWords = words.some(w => w.length > 25);
    const lowCommonWordRatio = wordCount >= 5 && (matchedCount / wordCount) < 0.12;
    const isGibberish = isVeryShort || hasLongGibberishWords || lowCommonWordRatio;

    let result;

    if (isGibberish && !hasImages) {
      // Return a very realistic "gibberish" / bad attempt JSON evaluation
      const score = Math.max(1.0, Math.round((maxMarks * 0.12) * 10) / 10); // 12% score
      result = {
        marksAwarded: score,
        marksRationale: "The submitted copy contains unreadable text, gibberish characters, or random words, failing to address the core subject matter.",
        strengths: ["Submission: Attempted to submit text in the input box."],
        weaknesses: [
          "Gibberish/Meaningless Input: The text appears to be randomly typed or jumbled characters.",
          "Completely Out of Context: Does not present any coherent sentences or ideas addressing the question."
        ],
        missingDimensions: [
          "Core Demand Addressal: Needs a complete, cohesive answer addressing the main themes of the question.",
          "Structure & Bullet Points: Must transition to structured subheadings and readable bullet points.",
          "UPSC Key Value-Additions: Completely missing constitutional articles, committees, or report citations."
        ],
        suggestedValueAdditions: [
          "Review the standard UPSC syllabus for this subject.",
          "Ensure you type a coherent answer or upload clear, readable photo copies of your written answer sheet."
        ],
        suggestedDiagram: "Introduce a basic flowchart outlining the primary stakeholders of the topic once a legible answer is provided.",
        actionableAdvice: [
          "Type a legible, continuous answer or clear photo of your handwriting to receive a professional evaluation.",
          "Ensure you structure your points clearly with headings."
        ],
        rubric: {
          demandAddressal: {
            rating: "Poor",
            remarks: "No legible content addressing the question."
          },
          structurePresentation: {
            rating: "Poor",
            remarks: "Input is unreadable or jumbled text blocks."
          },
          factualValueAddition: {
            rating: "Poor",
            remarks: "No factual assertions or references were provided."
          },
          dark_mode_visibility: {
            rating: "Average",
            remarks: "Contrast is fine, but the content itself lacks readability."
          },
          diagramsVisualAid: {
            rating: "Poor",
            remarks: "No diagrams present."
          }
        }
      };
    } else {
      const isEssay = prompt.toLowerCase().includes("essay") || gsPaper.toLowerCase().includes("essay") || maxMarks === 125;

      if (isEssay) {
        // Evaluate UPSC Essay Paper
        // Base score percentage depending on word count
        let basePct = 40; // Default starting point for very short essay
        if (hasImages && wordCount < 10) {
          basePct = 52;
        } else if (wordCount < 100) {
          basePct = 20;
        } else if (wordCount < 300) {
          basePct = 35;
        } else if (wordCount < 600) {
          basePct = 45;
        } else if (wordCount < 1000) {
          basePct = 53;
        } else {
          basePct = 58; // Ideal essay length (1000+ words)
        }

        // Check structure (philosophical essays should be written in beautiful cohesive paragraphs, with a few headers, and very light on raw bullets)
        let headingCount = 0;
        let bulletCount = 0;
        for (const line of userText.split("\n")) {
          const trimmed = line.trim();
          if (trimmed.startsWith("#") || trimmed.startsWith("**") || (trimmed.length > 3 && trimmed.length < 50 && trimmed === trimmed.toUpperCase() && !trimmed.startsWith("-"))) {
            headingCount++;
          }
          if (trimmed.startsWith("-") || trimmed.startsWith("*") || /^\d+\./.test(trimmed)) {
            bulletCount++;
          }
        }

        let essayStructureBonus = 0;
        // In Essays, too many raw bullet points and not enough prose is penalized!
        if (headingCount >= 3 && headingCount <= 10) {
          essayStructureBonus += 5; // Good structure with sections
        }
        if (bulletCount > 0 && bulletCount < 10) {
          essayStructureBonus += 3; // Light, appropriate use of bullet points for specific lists
        } else if (bulletCount >= 15) {
          essayStructureBonus -= 5; // Penalize "bullet-point-itis" in essays (should be primarily in paragraphs)
        }

        // Check for philosophical/thematic depth and multi-dimensional PESTEL/temporal coverage
        const hasHistorical = /histor|past|ancient|century|era|legacy|gandhi|nehru|bose|tagore/i.test(userText);
        const hasSocial = /soci|cultur|gender|women|poverty|equality|caste|education|health/i.test(userText);
        const hasEconomic = /econ|finance|gdp|resource|trade|industr|market|growth/i.test(userText);
        const hasPolitical = /polit|govern|democra|state|constitut|policy|rights|citizen/i.test(userText);
        const hasEnvironmental = /environ|climat|ecolog|natur|sustainab|warm|green/i.test(userText);
        const hasTechnological = /technolog|digital|ai|science|comput|internet|tech/i.test(userText);
        const hasEthical = /ethic|moral|justice|virtue|value|duty|right|wrong/i.test(userText);

        let dimensionCount = 0;
        if (hasHistorical) dimensionCount++;
        if (hasSocial) dimensionCount++;
        if (hasEconomic) dimensionCount++;
        if (hasPolitical) dimensionCount++;
        if (hasEnvironmental) dimensionCount++;
        if (hasTechnological) dimensionCount++;
        if (hasEthical) dimensionCount++;

        // We add a bonus for multi-dimensional coverage
        const dimensionBonus = Math.min(10, dimensionCount * 1.5);

        // Check for introduction hook, story, or quote
        const hasQuote = /quote|quotation|said|proverb|"|“|”|'|‘|’/i.test(userText);
        const hasHook = /story|anecdote|imagine|once\s+upon|historian|philosopher/i.test(userText);
        let hookBonus = 0;
        if (hasQuote) hookBonus += 2.5;
        if (hasHook) hookBonus += 2.5;

        // Final percentage score
        let scorePct = basePct + essayStructureBonus + dimensionBonus + hookBonus;
        // Essay scores in UPSC are strict (toppers score around 130-145 out of 250, which is 65-72.5 marks out of 125).
        scorePct = Math.max(20, Math.min(72, scorePct));

        const marksAwarded = Math.round((maxMarks * scorePct / 100) * 10) / 10;

        // Strengths, weaknesses, etc. tailored specifically for Essay
        const strengthsList: string[] = [];
        const weaknessesList: string[] = [];
        const missingDims: string[] = [];
        const valAdditions: string[] = [];
        const advice: string[] = [];

        // Populating Essay feedback
        if (wordCount >= 1000) {
          strengthsList.push(`Excellent Word Count: Solid essay length of ${wordCount} words, meeting the standard UPSC benchmark of 1000-1200 words.`);
        } else if (wordCount > 0) {
          weaknessesList.push(`Insufficient Length: Word count is only ${wordCount} words. UPSC essays demand high analytical volume (1000-1200 words) to fully explore the depth of the topic.`);
        }

        if (dimensionCount >= 5 && wordCount >= 300) {
          strengthsList.push(`Multi-dimensional (PESTEL) Coverage: Highly comprehensive analysis exploring ${dimensionCount} different facets (Historical, Social, Economic, Political, Environmental, Tech, Ethical).`);
        } else if (wordCount > 100) {
          weaknessesList.push(`Uni-dimensional Focus: The essay leans heavily on a single perspective. It needs to encompass wider temporal and sectoral dimensions.`);
          missingDims.push("PESTEL/Temporal Framework: Broaden the essay by exploring historical context, ethical dilemmas, and scientific-technological implications.");
        }

        if ((hasQuote || hasHook) && wordCount >= 300) {
          strengthsList.push("Engaging Opening Hook: Excellent usage of a quote, philosophical anecdote, or storytelling device to establish the essay's core thesis.");
        } else if (wordCount > 100) {
          weaknessesList.push("Abrupt Introduction: Starts directly with definitions or factual statements. Lacks a classic philosophical narrative or quote hook.");
          valAdditions.push("Begin the essay with an engaging historical narrative, a striking paradox, or a quote from an eminent philosopher (e.g., Mahatma Gandhi, Swami Vivekananda, or Socrates).");
        }

        if (bulletCount >= 15) {
          weaknessesList.push("Excessive Bulleting: The copy reads more like a GS answer sheet than a cohesive essay. Essays must prioritize cohesive paragraphs and fluid prose.");
          advice.push("Convert long bullet lists into well-articulated paragraph blocks with smooth semantic transitions.");
        } else if (bulletCount === 0 && headingCount === 0 && wordCount > 200) {
          weaknessesList.push("Lack of Structural Markers: The essay is a continuous block of text without clear thematic subheadings. This can strain the examiner.");
          advice.push("Divide the essay body using 3-5 high-impact, creative subheadings representing different thematic dimensions.");
        } else if (wordCount > 200) {
          strengthsList.push("Cohesive Paragraph Transitions: Maintains a fluid narrative flow with structural subheadings.");
        }

        // Add default fallbacks if empty
        if (strengthsList.length === 0) strengthsList.push("Clear Thesis Statement: Defined the central essay premise in the introductory paragraph.");
        if (weaknessesList.length === 0) weaknessesList.push("Lack of Global Context: Could incorporate more international case studies or global paradigm shifts.");
        if (missingDims.length === 0) missingDims.push("Ethical and Moral Imperatives: Explored the underlying human values and systemic virtues of the subject.");
        if (valAdditions.length === 0) valAdditions.push("Quote relevant SDG goals (Sustainable Development Goals) or the Preamble of the Constitution to ground abstract philosophical ideas in policy.");
        if (advice.length === 0) advice.push("End with a visionary, highly optimistic 'Way Forward' conclusion matching the core thesis.");

        result = {
          marksAwarded,
          marksRationale: wordCount < 300 
            ? "The essay is too short to be competitive, and fails to develop a coherent structural flow or multi-dimensional perspective."
            : `This is a ${scorePct >= 55 ? "topper-grade" : "highly promising"} essay attempt displaying ${dimensionCount >= 4 ? "excellent multi-dimensional" : "satisfactory thematic"} range. Incorporating a stronger quote hook in the opening will elevate it further.`,
          strengths: strengthsList.slice(0, 3),
          weaknesses: weaknessesList.slice(0, 3),
          missingDimensions: missingDims.slice(0, 3),
          suggestedValueAdditions: valAdditions.slice(0, 3),
          suggestedDiagram: "Create a simple mental map or Venn diagram representing the intersecting dimensions (Self, Society, State, Global) of the essay theme. Place this right after your introductory hook.",
          actionableAdvice: advice.slice(0, 3),
          rubric: {
            demandAddressal: {
              rating: wordCount < 300 ? "Poor" : (scorePct >= 55 ? "Topper-Grade" : "Average"),
              remarks: wordCount < 300 ? "Fails to meet the basic depth expected of a UPSC essay." : "Explored the underlying philosophical and thematic core elegantly."
            },
            structurePresentation: {
              rating: wordCount < 300 ? "Poor" : (bulletCount >= 15 ? "Average" : (headingCount >= 3 ? "Topper-Grade" : "Strong")),
              remarks: wordCount < 300 ? "The attempt is too short to show proper essay structural flow or transitions." : (bulletCount >= 15 ? "Too many bullet points, lacks essay-style prose flow." : "Beautiful paragraph transitions and clever subheading placement.")
            },
            factualValueAddition: {
              rating: wordCount < 300 ? "Poor" : (dimensionCount >= 5 ? "Topper-Grade" : (dimensionCount >= 3 ? "Strong" : "Average")),
              remarks: wordCount < 300 ? "At this extremely short word count, no meaningful multi-dimensional content is developed." : `Excellent multi-faceted PESTEL representation exploring ${dimensionCount} distinct angles.`
            },
            dark_mode_visibility: {
              rating: "Topper-Grade",
              remarks: "Exquisite visual contrast and spacious line height."
            },
            diagramsVisualAid: {
              rating: "Average",
              remarks: "Adding a quick conceptual schematic would help visually ground abstract thoughts."
            }
          }
        };
      } else {
        // Evaluate actual written GS text or uploaded GS images
        // Base score percentage depending on word count
        let basePct = 42; // default starting point
        if (hasImages && wordCount < 10) {
          // If only image is uploaded, we assume it's a good handwritten page!
          basePct = 52; 
        } else if (wordCount < 30) {
          basePct = 25;
        } else if (wordCount < 70) {
          basePct = 38;
        } else if (wordCount < 150) {
          basePct = 46;
        } else if (wordCount < 300) {
          basePct = 52;
        } else {
          basePct = 54; // detailed text
        }

        // Check structure (bullets and headings)
        let headingCount = 0;
        let bulletCount = 0;
        for (const line of userText.split("\n")) {
          const trimmed = line.trim();
          if (trimmed.startsWith("#") || trimmed.startsWith("**") || (trimmed.length > 3 && trimmed.length < 50 && trimmed === trimmed.toUpperCase() && !trimmed.startsWith("-"))) {
            headingCount++;
          }
          if (trimmed.startsWith("-") || trimmed.startsWith("*") || /^\d+\./.test(trimmed)) {
            bulletCount++;
          }
        }

        let structureBonus = 0;
        if (bulletCount >= 3) structureBonus += 4;
        if (headingCount >= 2) structureBonus += 3;

        // Check specific UPSC value additions
        const hasArticles = /article\s*\d+|art\.\s*\d+|part\s+[ivx]+/i.test(userText);
        const hasJudgments = /judgment|sc\s*case|supreme\s*court|case\s*law|vs\.|precedent|landmark/i.test(userText);
        const hasCommittees = /committee|commission|arc|sarkaria|punchhi|niti\s*aayog|recommendation/i.test(userText);
        const hasActs = /act,\s*\d+|bill\s*\d+|amendment|legislation/i.test(userText);

        let valueAddBonus = 0;
        if (hasArticles) valueAddBonus += 3;
        if (hasJudgments) valueAddBonus += 3;
        if (hasCommittees) valueAddBonus += 3;
        if (hasActs) valueAddBonus += 2;

        // Check question relevance
        const questionWords = questionText.toLowerCase()
          .replace(/[^a-z\s]/g, "")
          .split(/\s+/)
          .filter(w => w.length > 3 && !commonWords.has(w));
        
        let relevantMatches = 0;
        const answerLower = userText.toLowerCase();
        for (const qWord of questionWords) {
          if (answerLower.includes(qWord)) {
            relevantMatches++;
          }
        }

        let relevancePenalty = 0;
        const relevanceRatio = questionWords.length > 0 ? relevantMatches / questionWords.length : 1;
        if (!hasImages && relevanceRatio < 0.25 && wordCount > 20) {
          relevancePenalty = 15; // penalize irrelevant answer
        }

        // Final score percentage
        let scorePct = basePct + structureBonus + valueAddBonus - relevancePenalty;
        scorePct = Math.max(15, Math.min(85, scorePct));

        // UPSC marks are strict (typically topper gets ~50% - 55%)
        const marksAwarded = Math.round((maxMarks * scorePct / 100) * 10) / 10;

        // Dynamically generate strengths, weaknesses, advice based on characteristics
        const strengthsList: string[] = [];
        const weaknessesList: string[] = [];
        const missingDims: string[] = [];
        const valAdditions: string[] = [];
        const advice: string[] = [];

        // Populating dynamic list items
        if (hasImages) {
          strengthsList.push("Handwritten Copy Upload: Successfully processed handwriting visual structure.");
        }
        if (wordCount >= 100) {
          strengthsList.push(`Analytical Coverage: Solid answer volume (${wordCount} words) with comprehensive thematic exploration.`);
        } else if (wordCount > 0) {
          weaknessesList.push(`Short Length: Only ${wordCount} words provided. UPSC answers require 150-250 words of dense, value-added content.`);
        }

        if (bulletCount >= 3) {
          strengthsList.push("Structured Presentation: Clear usage of pointwise lists and/or bullets to structure key arguments.");
          advice.push("Maintain this bulleted format; it drastically improves scannability for examiners.");
        } else if (wordCount > 30) {
          weaknessesList.push("Prose-Heavy Layout: The answer is written primarily in dense prose paragraphs. UPSC examiners prefer telegraphic pointwise structures.");
          advice.push("Transition from verbose paragraphs to crisp, pointwise lists with bolded keyword tags.");
        }

        if (hasArticles) {
          strengthsList.push("Constitutional Grounding: Excellent integration of specific Articles / Constitutional clauses.");
        } else {
          weaknessesList.push("Statutory/Constitutional Void: Lacks specific Article references or constitutional anchors.");
          valAdditions.push("Incorporate specific Articles (e.g. Article 21, 142, 356) matching the topic to boost credibility.");
          missingDims.push("Constitutional Provisions: Anchor your arguments with explicit Articles or fundamental rights.");
        }

        if (hasJudgments) {
          strengthsList.push("Judicial Awareness: Relevant Supreme Court precedents and landmark cases cited.");
        } else if (questionText.toLowerCase().includes("federal") || questionText.toLowerCase().includes("water") || questionText.toLowerCase().includes("judiciary") || questionText.toLowerCase().includes("governor")) {
          weaknessesList.push("Judicial Citations Missing: No landmark Supreme Court cases cited to support the legal arguments.");
          valAdditions.push("Cite landmark Supreme Court judgments (e.g., S.R. Bommai case for federalism, Kesavananda Bharati for basic structure).");
          missingDims.push("Judicial Jurisprudence: Bring in Supreme Court rulings to solidify the legal standing.");
        }

        if (hasCommittees) {
          strengthsList.push("Committee References: Grounded in standard expert body recommendations (ARC, Sarkaria/Punchhi).");
        } else {
          valAdditions.push("Reference observations from the 2nd Administrative Reforms Commission (ARC) or NITI Aayog Strategy reports.");
          missingDims.push("Expert Recommendations: Citing committees demonstrates mature, policy-oriented thinking.");
        }

        if (relevancePenalty > 0) {
          weaknessesList.push("Divergent Focus: The answer does not appear to sufficiently address the core terminology and keywords of the question.");
          advice.push("Make sure you read the directive word (Examine, Critically Analyze, Discuss) and align your headings directly with them.");
        }

        // Default fallback lists to ensure structure
        if (strengthsList.length === 0) strengthsList.push("Opening Hook: Direct and clear introduction mapping the main topic.");
        if (weaknessesList.length === 0) weaknessesList.push("Subheading Density: Could use more granular structural headings to divide PESTEL dimensions.");
        if (missingDims.length === 0) missingDims.push("International parallels or global best practices relative to the subject matter.");
        if (valAdditions.length === 0) valAdditions.push("Quote specific SDG goals (e.g., SDG 6 for clean water, SDG 16 for peace & justice) to add a modern policy dimension.");
        if (advice.length === 0) advice.push("Underline or bold key legal/constitutional keywords to ensure they instantly stand out.");

        result = {
          marksAwarded,
          marksRationale: relevancePenalty > 0 
            ? "The answer is moderately written but lacks tight relevance to the specific question asked, resulting in a lower score."
            : `This is a ${scorePct >= 50 ? "very competitive" : "decent"} attempt showing ${wordCount > 100 ? "solid" : "satisfactory"} analytical ability. Adding more structured subheadings and constitutional citations will elevate it to topper levels.`,
          strengths: strengthsList.slice(0, 3),
          weaknesses: weaknessesList.slice(0, 3),
          missingDimensions: missingDims.slice(0, 3),
          suggestedValueAdditions: valAdditions.slice(0, 3),
          suggestedDiagram: questionText.toLowerCase().includes("water") || questionText.toLowerCase().includes("federal")
            ? "Draw a simple flowchart representing the multi-tier dispute resolution flow (ULBs -> State Governments -> Inter-State Tribunals -> Supreme Court under Article 136)."
            : "Create a Hub-and-Spoke diagram mapping out the 4 primary pillars/stakeholders of this governance issue. Place this right below the opening introduction.",
          actionableAdvice: advice.slice(0, 3),
          rubric: {
            demandAddressal: {
              rating: relevancePenalty > 0 ? "Poor" : (scorePct >= 52 ? "Strong" : "Average"),
              remarks: relevancePenalty > 0 ? "Fails to hit the specific analytical sub-parts of the question." : "The core conceptual demand is met successfully."
            },
            structurePresentation: {
              rating: bulletCount >= 3 ? "Topper-Grade" : (wordCount > 80 ? "Strong" : "Average"),
              remarks: bulletCount >= 3 ? "Excellent point-wise formulation with high scannability." : "Consider breaking down paragraphs into bullet lists."
            },
            factualValueAddition: {
              rating: (hasArticles && hasCommittees) ? "Topper-Grade" : (hasArticles || hasCommittees ? "Strong" : "Poor"),
              remarks: (hasArticles || hasCommittees) ? "Good references to standard resources, keep it up." : "Needs explicit Articles, judgments, or committee recommendations."
            },
            dark_mode_visibility: {
              rating: "Topper-Grade",
              remarks: "Very clean contrast and high typographic legibility."
            },
            diagramsVisualAid: {
              rating: "Poor",
              remarks: "No flowchart or diagram drawn. Adding an ASCII model would greatly enhance presentation."
            }
          }
        };
      }
    }

    return { text: JSON.stringify(result) };
  }

  // 3. Model Answer Generator (/api/mentor/generate)
  // Extract question from prompt
  let question = "UPSC Mains Question";
  const qMatch = prompt.match(/"([^"]+)"/);
  if (qMatch && qMatch[1]) {
    question = qMatch[1];
  }

  const isEssay = prompt.includes("outstanding UPSC topper. Write a comprehensive, full-length, masterfully drafted UPSC Essay") || prompt.includes("Model Essay");

  let modelText = "";
  
  if (prompt.includes("TOPPER PRE-WRITING BRAINSTORMING MAP")) {
    modelText += `### TOPPER PRE-WRITING BRAINSTORMING MAP

Intro Hook: Socrates and the Republic - The pursuit of justice through public deliberation.

Body Dimensions:
- History:
  - Magna Carta 1215: Genesis of modern accountability.
  - Kautilya Saptanga: Focus on Treasury and Amatya (Cabinet) security.
- Philosophy & Thinkers:
  - Gandhi: Trusteeship and Sarvodaya (welfare of all).
  - Rawls: Justice as fairness and the Veil of Ignorance.
  - Ambedkar: Constitutional morality over public sentiments.
- Constitution & Legal:
  - Article 14: Equality before law.
  - Article 21: Expanding horizon of life & liberty.
  - SR Bommai Case: Federalism as a basic structure.
- Tech & Science:
  - DPI / India Stack: Decentralized governance.
  - AI Ethics: Machine bias vs digital inclusion.
- Economics:
  - Inclusive growth models.
  - NITI Aayog: Cooperative federalism blueprint.
- Society & Culture:
  - Vasudhaiva Kutumbakam: Global brotherhood.

\n\n`;
  }

  if (isEssay) {
    modelText += `### TOPPER MODEL ESSAY

#### 1. Introduction: The Tapestry of Philosophical Deliberation

The grand journey of civilization has always been anchored by the delicate balance between systemic structures and individual aspirations. To understand "${question}", we must step back into the rich historical record. Since the era of the ancient republics of Greece and India's Mahajanapadas, the progress of humanity has not been measured by economic output alone, but by the depth of its moral and constitutional foundations. As Dr. B.R. Ambedkar masterfully articulated, constitutional morality is not a natural sentiment but must be actively cultivated.

In deconstructing this thesis, we see that "${question}" is a multi-layered call to action. It urges us to look beyond immediate, surface-level solutions and instead examine the systemic root causes of socio-economic and political challenges. By analyzing this through several distinct thematic spheres, we can appreciate the profound wisdom embedded in this statement.

#### 2. The Historical and Philosophical Imperatives

Historically, civilizations that prioritized material accumulation without a corresponding evolution in ethical governance inevitably collapsed under their own weight. The Roman Republic, Kautilya's Arthashastra-era empires, and the European industrial powers all demonstrate that raw growth, in the absence of distributive justice, fosters intense internal friction. John Rawls, in his landmark work 'A Theory of Justice', proposed the 'veil of ignorance' as a cognitive framework to design fair systems—reminding us that true justice must be designed from the perspective of the most vulnerable.

Furthermore, Mahatma Gandhi’s concept of 'Trusteeship' serves as a beacon. Gandhi argued that the wealthy and powerful must view their resources not as personal possessions, but as a trust held on behalf of society. This matches perfectly with the ethos of sustainable development, where the current generation acts as a trustee for future generations.

#### 3. Constitutional and Institutional Guardrails

In the Indian context, the Constitution provides the ultimate architecture to achieve this balance. The Preamble itself commits to securing Social, Economic, and Political Justice for all citizens. This is further elaborated through the Directive Principles of State Policy (Part IV), which serve as non-justiciable yet fundamental guidelines for governance. 

- **Article 38**: Directs the State to promote the welfare of the people by securing a social order permeated by justice.
- **Article 39(b) and (c)**: Mandates that ownership and control of material resources are distributed to serve the common good, and that the economic system does not result in the concentration of wealth.

When these principles are compromised, judicial interventions, such as the *Puttaswamy* (Right to Privacy) and *Kesavananda Bharati* (Basic Structure) judgements, step in to restore the constitutional equilibrium.

#### 4. Socio-Economic Dimensions & The Tech-Driven Frontier

In the modern era, the rise of Digital Public Infrastructure (DPI), commonly referred to as the 'India Stack' (Aadhaar, UPI, DigiLocker), represents a monumental shift. DPI has democratized access to financial and public services, bridging the deep-seated divide between the rural core and urban centers. 

However, technology also introduces new fault lines. The rise of Artificial Intelligence (AI) and algorithmic decision-making can easily perpetuate existing societal biases if left unregulated. Therefore, we must pioneer an ethical framework that treats digital inclusion as a fundamental extension of human rights under Article 21.

#### 5. Conclusion: Towards a Resilient Future

In the final analysis, "${question}" is not merely a philosophical abstraction, but a highly practical blueprint for modern nation-building. By weaving together the historical wisdom of Trusteeship, the constitutional directives of social justice, and the modern tools of digital empowerment, we can transition from a state of mere survival to one of thriving, inclusive prosperity. It is only then that we can truly realize the vision of *Vasudhaiva Kutumbakam*—the world as one cohesive, harmonious family.`;
  } else {
    modelText += `### TOPPER MODEL ANSWER

**Introduction:**
The core demand of the question on "${question}" centers around the critical evaluation of institutional accountability, administrative efficiency, and the modern constitutional frameworks required to resolve socio-economic disparities. Topper answer writing demands a highly structured, pointwise approach with rich value additions to secure maximum marks.

**1. Historical & Constitutional Architecture:**
- **Article 14 & 15**: Establishes the bedrock of equality and prohibits systemic discrimination, forming the basis of all developmental policies.
- **2nd Administrative Reforms Commission (ARC)**: Emphasized that clean, citizen-centric administration is a prerequisite to successful welfare state execution.
- **Kautilya's Saptanga Theory**: Argues that the 'Swami' (Sovereign) and 'Amatya' (Administration) must act in unison to protect the 'Janapada' (People and territory) from internal decay.

**2. Key Challenges & Systemic Bottlenecks:**
- **Asymmetric Information**: Regulatory frameworks often lack transparent, real-time data flow, leading to policy lag and implementation gaps.
- **Fiscal Devolution Deficits**: Although the 73rd and 74th Amendments mandated local governance, municipal bodies suffer from chronic lack of financial autonomy (Article 243G/W).
- **Technological Exclusion**: The digital divide hampers the equitable distribution of benefits, disproportionately affecting marginal communities in rural districts.

**3. Strategic Recommendations & Topper Value Additions:**
- **Mandatory Social Audits**: Institutionalize community-led monitoring, as successfully demonstrated in the MGNREGA model, to enforce grassroots transparency.
- **Leverage NITI Aayog Blueprints**: Implement the cooperative and competitive federalism guidelines from the 'Strategy for New India @ 75' to optimize state-level performance.
- **DPI Expansion**: Use the India Stack framework to bypass intermediate leakages via Direct Benefit Transfers (DBT), guaranteeing direct citizen empowerment.

**Conclusion:**
Ultimately, achieving the core objective requires transitioning from traditional, top-down governance to a decentralized, citizen-centric paradigm. By harmonizing constitutional mandates with technological tools and administrative reforms, we can establish an inclusive, transparent, and resilient nation.`;
  }

  return { text: modelText };
};

// Initialize Gemini Client Lazily/Conditionally to prevent server crashes on missing/invalid keys
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_api_key_here") {
    return null;
  }

  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

// Helper to format/translate errors into friendly and actionable messages
const formatApiError = (error: any, defaultMsg: string): string => {
  const errMsg = error?.message || String(error);
  if (
    errMsg.includes("UNAUTHENTICATED") ||
    errMsg.includes("401") ||
    errMsg.includes("API_KEY") ||
    errMsg.includes("invalid key") ||
    errMsg.includes("access token")
  ) {
    return "Authentication failure: Your GEMINI_API_KEY is missing, invalid, or expired. Please configure a valid Gemini API Key (typically starting with AIzaSy) in the AI Studio Settings -> Secrets panel (the gear icon on the top-right of your screen or sidebar) under the secret name GEMINI_API_KEY to start using the mentor!";
  }
  return errMsg || defaultMsg;
};

// API routes first
app.get("/api/health", (req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY;
  res.json({ status: "ok", apiKeyConfigured: hasKey });
});

// Endpoint to generate Topper Model Answer
app.post("/api/mentor/generate", async (req, res) => {
  const { question, gsPaper, marks, brainstorm } = req.body;
  if (!question) {
    return res.status(400).json({ error: "Question is required." });
  }

  const ai = getGeminiClient();
  if (!ai) {
    return res.status(500).json({ 
      error: "Gemini API key is missing. Please configure it in the Secrets panel in AI Studio." 
    });
  }

  try {
    const isEssay = gsPaper === "Essay" || marks === 125 || marks === "125" || (question && question.toLowerCase().includes("essay"));
    const paperInfo = gsPaper ? `GS Paper: ${gsPaper}` : (isEssay ? "UPSC Essay" : "General Studies");
    const marksInfo = marks ? `Marks: ${marks}` : (isEssay ? "125 Marks" : "10 Marks (150 words)");
    
    let brainstormPrompt = "";
    if (brainstorm) {
      brainstormPrompt = `
CRITICAL REQUIREMENT: Since the candidate requested to brainstorm associations, you MUST output a raw, topper-style association mapping draft under the header "### TOPPER PRE-WRITING BRAINSTORMING MAP" before starting the actual answer/essay.

Follow these strict visual and formatting rules for the Brainstorming Map:
1. Do NOT use horizontal separator lines (such as "=========", "---------", or long decorative dashes). Use simple, clean headers and line breaks.
2. The map must be written in extremely short, crisp bullet points of 1-3 words (no full sentences, no explanations, no filler text, no wordy prose).
3. Ensure every single line in this brainstorming section is very short so it easily fits within a standard card display without forcing horizontal scroll or overflow. Use a narrow, clean list structure.
4. Structure it EXACTLY like this (use this format, but dynamically tailor the contents to be high-yield UPSC topper-grade value additions relevant to the specific question/topic):

### TOPPER PRE-WRITING BRAINSTORMING MAP

Intro Hook: [E.g., "Ramanujan story", "Socrates Pharmakon", "Ship of Theseus" - just 1-2 words referencing the hook]

Body Dimensions:
- History:
  - [Topper-grade historical references, e.g. "Aryabhatta: 0 invention", "Pythagoras", "Kautilya Saptanga", "Ashokan Edicts"]
- Philosophy & Thinkers:
  - [E.g., "Gandhi: Trusteeship", "Rawls: Veil of Ignorance", "Ambedkar: Constitutional Morality"]
- Constitution & Legal:
  - [E.g., "Article 21", "Article 38", "Puttaswamy judgment"]
- Tech & Science:
  - [E.g., "Quantum Qubits", "DPI / India Stack", "AI ethics"]
- Economics:
  - [E.g., "Trading models", "NITI Aayog blueprint", "Inclusive growth"]
- Society & Culture:
  - [E.g., "Sanskritization", "Demographic dividend", "Vasudhaiva Kutumbakam"]

After finishing the "TOPPER PRE-WRITING BRAINSTORMING MAP", add exactly two empty line breaks (newlines), and then output the header:
"### TOPPER MODEL ANSWER" (or "### TOPPER MODEL ESSAY" if it is an Essay)
without any horizontal separator lines or symbols of any kind. Then directly write the finalized, outstanding model answer/essay under that header.
`;
    }

    let prompt = "";
    if (isEssay) {
      prompt = `
You are an outstanding UPSC topper. Write a comprehensive, full-length, masterfully drafted UPSC Essay for the following topic:
"${question}"

Details:
- Paper: ${paperInfo}
- Target Marks: ${marksInfo}
- Length: Full-length (approximately 1000 - 1200 words)

${brainstormPrompt}

CRITICAL ESSAY FORMATTING MANDATE: 
- UPSC Essays are evaluated for continuous philosophical, logical, and argumentative flow. Therefore, you are STRICTLY FORBIDDEN from writing the essay itself in bullet points, numbered lists, or simple pointwise formats. 
- You MUST write the actual, full-text essay in complete, beautifully flowing, interconnected prose paragraphs with clear intellectual headings. 
- Do NOT use bullet points or numbered lists anywhere in the essay content. Use transitional sentences to link thoughts seamlessly.

Follow this elite topper structure for the essay:
1. **Philosophical/Historical Opening (Anecdote/Quote)**: Start with a powerful anecdote, story, historical event, or philosophical quote that introduces the core thesis.
2. **Deconstruction of the Thesis**: Define the key terms in flowing paragraphs, elaborate on the hidden meanings, and establish the scope.
3. **Multi-dimensional Thematic Spheres**: Deeply explore the topic across 8-10 dimensions in paragraph form:
   - Historical roots
   - Political-administrative framework
   - Economic paradigms & constraints
   - Social & Cultural stratification
   - Scientific, Technological, & Digital trends
   - Environmental sustainability
   - Ethical & Philosophical foundations
   - International Relations & Geopolitics
4. **Integration of Citations**: Seamlessly weave in relevant constitutional articles (e.g., Article 21, 38, 51A), landmark SC judgments, and quotes from thinkers (Socrates, Gandhi, Ambedkar, Nehru, etc.) within the body paragraphs.
5. **Counter-Perspectives & Challenges**: Provide critical alternative perspectives to showcase intellectual balance in paragraph style.
6. **Way Forward & Visionary Solutions**: Present structured, action-oriented reforms referencing 2nd ARC or NITI Aayog blueprints using rich prose.
7. **Under-1-Minute Diagram Concept**: Provide a simple visual ASCII blueprint or flow diagram demonstrating how you would summarize the essay structure visually on paper under exam conditions.
8. **Elegance & Philosophical Synthesis**: End with a powerful, forward-looking conclusion that links back to your opening anecdote and outlines a holistic vision for India and the world (e.g. Sabka Saath Sabka Vikas, Vasudhaiva Kutumbakam).

Begin directly with the output. Do not output conversational preamble.
`;
    } else {
      prompt = `
Generate an outstanding, topper-quality model UPSC Mains answer for the following question:
"${question}"

Details:
- GS Paper: ${paperInfo}
- Marks / Word limit: ${marksInfo}

${brainstormPrompt}

Follow these strict structural guidelines to resemble a high-scoring topper's written sheet:
1. **Telegraphic & Point-Wise Style**: DO NOT write in full, wordy sentences or long paragraphs. Toppers write in a highly structured, point-wise, bulleted format using concise, short, telegraphic phrases. Underline/bold key terminologies, Articles, and Supreme Court judgments.
2. **Introduction**: A direct, crisp introduction (25-35 words) defining the core theme or establishing a high-yield current affairs/constitutional background.
3. **Multi-dimensional Analytical Body**: Divided into clear subheadings addressing all sub-parts of the question. Write each point under a subheading as a brief bullet starting with a bolded keyword. Incorporate PESTEL (Political, Economic, Social, Technological, Environmental, Legal) or relevant stakeholder dimensions.
4. **High-Yield Value Additions**: Actively weave in relevant gold-standard value additions. Include specific Constitutional Articles (e.g., Article 142, 50, 356), landmark Supreme Court judgments (e.g., Kesavananda, Bommai, Puttaswamy), expert committee reports (e.g., Punchhi Commission, Sarkaria Commission, 2nd ARC reports), or official reports (e.g., NITI Aayog Strategy, Economic Survey stats).
5. **Key Challenges/Bottlenecks**: Highlight 3-4 specific issues/bottlenecks using bolded keywords and very brief bullet explanations.
6. **Practical Way Forward**: Provide 3-4 action-oriented solutions citing expert recommendations (like 2nd ARC or NITI Aayog blueprints).
7. **Reproducible Diagram**: Design a simple visual flowchart, hub-and-spoke diagram, or conceptual model using simple text-based ASCII characters (using brackets, arrows, and dashes) that is quick to reproduce on paper in less than 1 minute under exam pressure.
8. **Conclusion**: End with a crisp 1-2 sentence forward-looking conclusion linking the subject to national/SDG goals or constitutional vision.

Avoid generic introductory or concluding transition statements (e.g. "Sure, here is the answer"). Begin directly with the answer content.
`;
    }

    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: isEssay 
            ? "You are an elite UPSC Civil Services Examination mentor. You write masterfully crafted, multi-dimensional, philosophical and analytical full-length essays that secure top marks."
            : "You are an elite UPSC Civil Services Examination mentor. You generate topper-grade, highly structured, point-wise model answers in a concise, high-density, telegraphic style with specific constitutional and report-based citations."
        }
      });
    } catch (primaryError: any) {
      console.warn("Primary model gemini-3.5-flash failed, attempting fallback to gemini-3.1-flash-lite. Error:", primaryError);
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite",
          contents: prompt,
          config: {
            systemInstruction: isEssay 
              ? "You are an elite UPSC Civil Services Examination mentor. You write masterfully crafted, multi-dimensional, philosophical and analytical full-length essays that secure top marks."
              : "You are an elite UPSC Civil Services Examination mentor. You generate topper-grade, highly structured, point-wise model answers in a concise, high-density, telegraphic style with specific constitutional and report-based citations."
          }
        });
      } catch (fallbackError: any) {
        console.error("Fallback model gemini-3.1-flash-lite also failed:", fallbackError);
        throw new Error(primaryError.message || "Model generation failed.");
      }
    }

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in generate answer:", error);
    res.status(500).json({ error: formatApiError(error, "Failed to generate answer.") });
  }
});

// Endpoint to evaluate User Answer
app.post("/api/mentor/evaluate", async (req, res) => {
  const { question, userAnswer, gsPaper, marks, images } = req.body;
  
  if (!question) {
    return res.status(400).json({ error: "Question is required." });
  }
  
  if (!userAnswer && (!images || !Array.isArray(images) || images.length === 0)) {
    return res.status(400).json({ error: "Please write an answer or upload at least one photo page for evaluation." });
  }

  const ai = getGeminiClient();
  if (!ai) {
    return res.status(500).json({ 
      error: "Gemini API key is missing. Please configure it in the Secrets panel in AI Studio." 
    });
  }

  try {
    const paperInfo = gsPaper ? `GS Paper: ${gsPaper}` : "General Studies";
    const totalMarks = marks ? parseInt(marks) : 10;
    const isEssay = gsPaper === "Essay" || totalMarks === 125 || (question && question.toLowerCase().includes("essay"));
    
    let prompt = `
Evaluate the following UPSC Mains answer copy against strict UPSC evaluation standards:

Question: "${question}"
GS Paper/Subject: ${paperInfo}
Maximum Marks: ${totalMarks}
`;

    if (userAnswer) {
      prompt += `\nCandidate's Written Text Answer Copy:\n"""\n${userAnswer}\n"""\n`;
    }

    if (images && images.length > 0) {
      prompt += `\nCandidate has uploaded ${images.length} handwritten/photo page(s) of their answer. Please transcribe, read, and thoroughly evaluate the text from these images as part of your assessment. If they contradict or differ from the text answer, rely primarily on what is written in the photos.\n`;
    }

    let evaluationCriteria = "";
    if (isEssay) {
      evaluationCriteria = `Evaluate this copy strictly according to UPSC Essay Paper evaluation standards:
1. UPSC Essays must be written in a continuous, flowing narrative format using beautiful prose paragraphs with creative, clear headings. Long lists of raw bullet points or brief telegraphic GS-style phrases are HIGHLY discouraged in essays; if the candidate has written primarily in bullet points, penalize their "structurePresentation" and advise them to transition to cohesive prose paragraphs.
2. The essay should show multi-dimensional depth, exploring the topic across various spheres (PESTEL framework: Political, Economic, Social, Technological, Environmental, Legal, plus Historical, Philosophical, and Ethical dimensions).
3. Look for a powerful introduction hook (such as an anecdote, quote, historical story, or striking paradox) and a visionary, cohesive, optimistic conclusion.
4. Assess the clarity and consistency of their central thesis statement throughout the entire copy.
5. Value Additions: Check for citations of famous philosophers, thinkers, landmark historical events, constitutional tenets, relevant SDG goals, or quotes.
6. Diagrams in essays are optional but can be highly valuable if they represent simple conceptual mental maps or venn diagrams rather than complex technical engineering-style flowcharts.
7. Be strict and objective, mirroring actual Civil Services examination standards. UPSC toppers score around 45% - 65% of maximum marks (i.e. 55-82 out of 125).`;
    } else {
      evaluationCriteria = `Evaluate this copy strictly according to UPSC General Studies (GS) evaluation standards:
1. UPSC GS toppers write in brief bullet points, with short telegraphic phrases, high-density keyword bolding, and active citation of Articles, Judgements, and Reports (2nd ARC, NITI Aayog). If the candidate wrote in long-winded, full-fledged prose sentences, penalize their structure and advise them to transition to short point-wise lists.
2. Structure: Crisp introduction, multi-dimensional analytical body under clear headings, and a forward-looking conclusion.
3. High-Yield Value Additions: Actively look for specific Constitutional Articles, landmark Supreme Court cases, expert committee/commission reports (2nd ARC, Punchhi, Sarkaria), or official index data.
4. Diagrams: Flowcharts, hub-and-spoke models, or ASCII diagrams are highly encouraged to save time and add clarity.
5. Be strict and objective, mirroring actual Civil Services examination standards. UPSC toppers score around 45% - 58% of maximum marks (i.e. 4.5-5.5 out of 10 or 7-8.5 out of 15).`;
    }

    if (false) {
    }

    prompt += `
${evaluationCriteria}

Format your response in JSON with the following schema:
{
  "marksAwarded": number,
  "marksRationale": "A 1-2 sentence explanation of why this score was awarded.",
  "strengths": [
    "strength 1 with details",
    "strength 2 with details"
  ],
  "weaknesses": [
    "weakness 1 with details",
    "weakness 2 with details"
  ],
  "missingDimensions": [
    "specific dimension/fact/perspective that the candidate missed"
  ],
  "suggestedValueAdditions": [
    "Specific Articles, Judgments, Committees, Reports, or Statistics that they should have included to boost their score."
  ],
  "suggestedDiagram": "Describe a simple, reproducible flowchart or diagram that would elevate this answer's presentation, and explain where to place it.",
  "actionableAdvice": [
    "Actionable step 1 to improve this answer.",
    "Actionable step 2 to improve this answer."
  ],
  "rubric": {
    "demandAddressal": {
      "rating": "Topper-Grade" | "Strong" | "Average" | "Poor",
      "remarks": "Brief assessment of how well the candidate addressed the core and hidden demands of the question."
    },
    "structurePresentation": {
      "rating": "Topper-Grade" | "Strong" | "Average" | "Poor",
      "remarks": "Evaluation of headings, bullet point density, and concise telegraphic styling vs. wordy prose."
    },
    "factualValueAddition": {
      "rating": "Topper-Grade" | "Strong" | "Average" | "Poor",
      "remarks": "Assessment of Constitutional Articles, Supreme Court cases, committees (Sarkaria, Punchhi, ARC), and NITI Aayog references."
    },
    "dark_mode_visibility": {
      "rating": "Topper-Grade" | "Strong" | "Average" | "Poor",
      "remarks": "Evaluates how visible the candidate's answer formatting is."
    },
    "diagramsVisualAid": {
      "rating": "Topper-Grade" | "Strong" | "Average" | "Poor",
      "remarks": "Evaluation of whether diagrams were drawn or if visual aids are missing."
    }
  }
}

Be strict and objective, mirroring actual Civil Services examination standards. UPSC toppers score around 45% - 58% of maximum marks (i.e. 4.5-5.5 out of 10, 7-8.5 out of 15, or 55-70 out of 125). Ensure the returned output is strictly valid JSON conforming exactly to this structure.
`;

    const parts: any[] = [{ text: prompt }];

    if (images && Array.isArray(images)) {
      for (const img of images) {
        let base64Data = img.data || img.base64 || "";
        if (typeof base64Data === "string" && base64Data.includes("base64,")) {
          base64Data = base64Data.split("base64,")[1];
        }
        if (base64Data) {
          parts.push({
            inlineData: {
              mimeType: img.mimeType || "image/jpeg",
              data: base64Data
            }
          });
        }
      }
    }

    const contents = { parts: parts };

    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          responseMimeType: "application/json",
          systemInstruction: isEssay ? "You are a senior UPSC examiner and essay evaluation expert. You assess essays strictly against UPSC Essay Paper criteria: continuous prose narrative (no excessive bulleting), multi-dimensional PESTEL/temporal depth, clear thesis statement, engaging introduction hook, and philosophical/empirical maturity." : "You are a senior UPSC examiner and evaluation expert. You assess answers strictly against UPSC mains criteria: relevance to core demand, structural clarity, analytical depth, multi-dimensional perspectives, factual accuracy, and high-yield value additions (articles, judgments, reports, diagrams)."
        }
      });
    } catch (primaryError: any) {
      console.warn("Primary evaluation model gemini-3.5-flash failed, attempting fallback to gemini-3.1-flash-lite. Error:", primaryError);
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite",
          contents: contents,
          config: {
            responseMimeType: "application/json",
            systemInstruction: isEssay ? "You are a senior UPSC examiner and essay evaluation expert. You assess essays strictly against UPSC Essay Paper criteria: continuous prose narrative (no excessive bulleting), multi-dimensional PESTEL/temporal depth, clear thesis statement, engaging introduction hook, and philosophical/empirical maturity." : "You are a senior UPSC examiner and evaluation expert. You assess answers strictly against UPSC mains criteria: relevance to core demand, structural clarity, analytical depth, multi-dimensional perspectives, factual accuracy, and high-yield value additions (articles, judgments, reports, diagrams)."
          }
        });
      } catch (fallbackError: any) {
        console.error("Fallback evaluation model gemini-3.1-flash-lite also failed:", fallbackError);
        throw new Error(primaryError.message || "Model evaluation failed.");
      }
    }

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Error in evaluate answer:", error);
    res.status(500).json({ error: formatApiError(error, "Failed to evaluate answer.") });
  }
});

// Endpoint to fetch automated Daily Current Affairs for Vault
app.get("/api/vault/daily", async (req, res) => {
  const ai = getGeminiClient();
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  
  if (!ai) {
    // Return offline mock CA when no API key is set
    return res.json([
      {
        id: 'ca-daily-1',
        category: 'Daily Policy Shift',
        title: 'Exhaustion of Local Remedies (ELR) in Bilateral Investment Treaties',
        description: 'India is actively incorporating a strict ELR clause in newer BIT negotiations, requiring foreign investors to pursue dispute resolution in domestic judicial forums for at least five years before moving to international arbitration tribunals.',
        significance: 'Perfect citation in GS2 (International Treaties) and GS3 (Investment models, Ease of Doing Business) answers concerning commercial dispute resolution and sovereign immunity.',
        paper: 'GS2',
        date: today
      },
      {
        id: 'ca-daily-2',
        category: 'Daily Legislation',
        title: 'Disaster Management (Amendment) Bill, 2024: Focus on Urban Resiliency',
        description: 'Introduces a dedicated statutory Urban Disaster Management Authority for megacities (headed by commissioners/mayors) to coordinate state-wide storm drainage grids and heat-wave protocols.',
        significance: 'Highly relevant for GS3 Disaster Management answers on climate-adaptive cities, urban floods (e.g. Chennai/Mumbai), and institutional decentralization.',
        paper: 'GS3',
        date: today
      },
      {
        id: 'ca-daily-3',
        category: 'Daily Landmark Report',
        title: 'NITI Aayog\'s Agricultural Resource & Water Security Index 2026',
        description: 'Details a 40% depletion of groundwater tables in critical rice-wheat zones, recommending the mandatory shift of crop electricity subsidies toward micro-irrigation systems.',
        significance: 'Gold-standard citation for GS3 Agriculture and Environment answers addressing depleting water tables, sustainable farming, or reform of state crop procurement subventions.',
        paper: 'GS3',
        date: today
      }
    ]);
  }

  try {
    const prompt = `
Generate exactly 3 high-yield, premium, highly analytical UPSC Mains-oriented current affairs items for today: ${today}.
Focus on real or highly authentic current affairs subjects regarding national policies, bills, supreme court judgements, international affairs, or developmental indices.

Format your response in JSON with the exact schema:
[
  {
    "id": "string",
    "category": "string (e.g. Daily Policy Shift, Daily Legislation, Daily Editorial Analysis)",
    "title": "string (Professional UPSC-oriented title)",
    "description": "string (High-yield analytical description, 70-100 words)",
    "significance": "string (UPSC Topper Application: Specific instructions on how to cite this in GS answers)",
    "paper": "GS1" | "GS2" | "GS3" | "GS4",
    "date": "${today}"
  }
]
`;

    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "You are a senior UPSC Mains research analyst. You extract and formulate high-yield, high-density current affairs facts for civil services answer writing."
        }
      });
    } catch (primaryError: any) {
      console.warn("Primary daily CA model gemini-3.5-flash failed, attempting fallback to gemini-3.1-flash-lite. Error:", primaryError);
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            systemInstruction: "You are a senior UPSC Mains research analyst. You extract and formulate high-yield, high-density current affairs facts for civil services answer writing."
          }
        });
      } catch (fallbackError: any) {
        console.error("Fallback daily CA model gemini-3.1-flash-lite also failed:", fallbackError);
        throw fallbackError;
      }
    }

    const items = JSON.parse(response.text || "[]");
    res.json(items);
  } catch (error: any) {
    console.error("Error in fetching daily CA:", error);
    // Return safe defaults in case of parsing/API error
    res.json([
      {
        id: 'ca-daily-1',
        category: 'Daily Policy Shift',
        title: 'Exhaustion of Local Remedies (ELR) in Bilateral Investment Treaties',
        description: 'India is actively incorporating a strict ELR clause in newer BIT negotiations, requiring foreign investors to pursue dispute resolution in domestic judicial forums for at least five years before moving to international arbitration tribunals.',
        significance: 'Perfect citation in GS2 (International Treaties) and GS3 (Investment models, Ease of Doing Business) answers concerning commercial dispute resolution and sovereign immunity.',
        paper: 'GS2',
        date: today
      },
      {
        id: 'ca-daily-2',
        category: 'Daily Legislation',
        title: 'Disaster Management (Amendment) Bill, 2024: Focus on Urban Resiliency',
        description: 'Introduces a dedicated statutory Urban Disaster Management Authority for megacities (headed by commissioners/mayors) to coordinate state-wide storm drainage grids and heat-wave protocols.',
        significance: 'Highly relevant for GS3 Disaster Management answers on climate-adaptive cities, urban floods (e.g. Chennai/Mumbai), and institutional decentralization.',
        paper: 'GS3',
        date: today
      }
    ]);
  }
});

// Serve frontend static assets or mount Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
