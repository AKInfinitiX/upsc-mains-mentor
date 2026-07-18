import { SyllabusTopic, PresetQuestion, HighYieldFact } from '../types';

export const SYLLABUS_TOPICS: SyllabusTopic[] = [
  {
    id: 'gs1-urban',
    paper: 'GS1',
    title: 'Urbanization & Social Issues',
    subtopic: 'Effects of urbanization, women issues, poverty, developmental issues',
    coreKeywords: ['Urban Sprawl', 'Feminization of Poverty', 'Slums', 'Social Stratification', 'Smart Cities'],
    topperTips: 'Relate social issues to constitutional provisions (DPSP) and support with latest Census/NFHS-5 data and Oxfam report findings.'
  },
  {
    id: 'gs1-resource',
    paper: 'GS1',
    title: 'Distribution of Key Natural Resources',
    subtopic: 'Global and national natural resource distribution, factors governing industrial location',
    coreKeywords: ['Resource Curse', 'Gondwana Coalfields', 'Critical Minerals', 'Rare Earth Elements'],
    topperTips: 'Draw rough schematic maps of India showing mineral belts or industrial corridors. Practice drawing India maps under 15 seconds.'
  },
  {
    id: 'gs2-governor',
    paper: 'GS2',
    title: 'Constitutional Offices & Federalism',
    subtopic: 'Appointment, powers, and responsibilities of various Constitutional offices',
    coreKeywords: ['Article 156', 'Discretionary Powers', 'Sarkaria Commission', 'Federal Balance'],
    topperTips: 'Always quote relevant Supreme Court Judgments (e.g., S.R. Bommai, Nabam Rebia) and Articles (Article 163, 174, 200, 356).'
  },
  {
    id: 'gs2-ngo',
    paper: 'GS2',
    title: 'Governance & Civil Society',
    subtopic: 'Role of NGOs, SHGs, institutional and other stakeholders in development',
    coreKeywords: ['Social Audit', 'Citizen Charter', 'Participatory Democracy', 'FCRA Regulations'],
    topperTips: 'Highlight case studies of successful NGO partnerships (e.g., SEWA, Kudumbashree, Mazdoor Kisan Shakti Sangathan).'
  },
  {
    id: 'gs3-energy',
    paper: 'GS3',
    title: 'S&T, Energy & Climate Change',
    subtopic: 'Infrastructural energy sectors, green technologies, environmental conservation',
    coreKeywords: ['Net Zero 2070', 'Green Hydrogen', 'Panchamrit Targets', 'Grid Integration'],
    topperTips: 'In S&T, focus on three aspects: Core Technology (how it works), Indian Initiatives (schemes), and Challenges (R&D funding, infrastructure).'
  },
  {
    id: 'gs3-disaster',
    paper: 'GS3',
    title: 'Disaster Management & Security',
    subtopic: 'Disaster and disaster management, preparedness, mitigation, institutional frameworks',
    coreKeywords: ['Sendai Framework', 'NDMA Guidelines', 'Community Resilience', 'Proactive Risk Reduction'],
    topperTips: 'Use a cause-and-effect timeline diagram and highlight the 4 stages of disaster management: Prevention, Mitigation, Response, Recovery.'
  },
  {
    id: 'gs4-values',
    paper: 'GS4',
    title: 'Ethics & Human Interface',
    subtopic: 'Essence, determinants, and consequences of ethics in public administration',
    coreKeywords: ['Nolan Principles', 'Public Trust', 'Ethical Governance', 'Code of Conduct'],
    topperTips: 'Define every term precisely (e.g., integrity vs honesty). Create a 2x2 matrix for Law vs Conscience or Code of Ethics vs Code of Conduct.'
  },
  {
    id: 'gs4-conscience',
    paper: 'GS4',
    title: 'Conscience as a Source of Ethical Guidance',
    subtopic: 'Resolving ethical dilemmas in public administration, moral attitudes',
    coreKeywords: ['Voice of Conscience', 'Ethical Dilemma', 'Conflict of Interest', 'Crisis of Conscience'],
    topperTips: 'Use real-life or standard administrative case studies. End on a philosophical quote, but ground the body in practical bureaucratic steps.'
  }
];

export const PRESET_QUESTIONS: PresetQuestion[] = [
  {
    id: 'q1',
    gsPaper: 'GS1',
    marks: 15,
    questionText: 'Evaluate the impact of rapid urbanization on the status of women in urban India, highlighting key challenges and opportunities.',
    year: '2023',
    subtopic: 'Urbanization & Social Issues'
  },
  {
    id: 'q2',
    gsPaper: 'GS1',
    marks: 15,
    questionText: 'The geographical distribution of resource-rich regions in India does not align with its industrial development hubs. Critically analyze the socio-economic impacts of this resource-industry misalignment.',
    year: '2022',
    subtopic: 'Distribution of Key Natural Resources'
  },
  {
    id: 'q3',
    gsPaper: 'GS2',
    marks: 15,
    questionText: 'The office of the Governor in India has often become a battleground between the Center and the States. Discuss the constitutional position of the Governor, quoting relevant Supreme Court judgments and expert committee recommendations.',
    year: '2023',
    subtopic: 'Constitutional Offices & Federalism'
  },
  {
    id: 'q4',
    gsPaper: 'GS2',
    marks: 10,
    questionText: 'Critically examine the role of civil society organizations (CSOs) in enhancing citizen-centric governance and transparency in India. What challenges do they face under current regulatory environments?',
    year: '2024',
    subtopic: 'Governance & Civil Society'
  },
  {
    id: 'q5',
    gsPaper: 'GS3',
    marks: 15,
    questionText: 'What is Green Hydrogen? Examine its potential in achieving India\'s Panchamrit targets of Net-Zero emissions by 2070, while highlighting the key technological and financial bottlenecks.',
    year: '2023',
    subtopic: 'S&T, Energy & Climate Change'
  },
  {
    id: 'q6',
    gsPaper: 'GS3',
    marks: 10,
    questionText: 'Disaster management in India is transitioning from a relief-centric approach to a proactive, risk-reduction framework. In light of this, evaluate the role of the National Disaster Management Authority (NDMA) in handling climate-induced extreme weather events.',
    year: '2022',
    subtopic: 'Disaster Management & Security'
  },
  {
    id: 'q7',
    gsPaper: 'GS4',
    marks: 10,
    questionText: 'What does ethical governance mean to you? State the core values essential for a civil servant to uphold public trust in administrative decisions, referencing Nolan Committee principles.',
    year: '2023',
    subtopic: 'Ethics & Human Interface'
  },
  {
    id: 'q8',
    gsPaper: 'GS4',
    marks: 15,
    questionText: 'Explain the difference between "laws" and "rules" in guiding ethical conduct. How can a public servant resolve a "crisis of conscience" when a legal mandate directly conflicts with their deeply held moral compass?',
    year: '2024',
    subtopic: 'Conscience as a Source of Ethical Guidance'
  },
  {
    id: 'q9',
    gsPaper: 'Essay',
    marks: 125,
    questionText: '"Technology is a double-edged sword; it connects us globally while isolating us individually." Elaborate on this statement in the context of modern social cohesion and psychological well-being.',
    year: '2023',
    subtopic: 'Technological & Social Philosophy'
  },
  {
    id: 'q10',
    gsPaper: 'Essay',
    marks: 125,
    questionText: '"The true measure of a nation\'s progress is how it treats its most vulnerable sections." In light of India\'s developmental journey, analyze this philosophical quote.',
    year: '2022',
    subtopic: 'Developmental Philosophy & Social Justice'
  }
];

export const HIGH_YIELD_VAULT: HighYieldFact[] = [
  // GS2 - Articles, Judgments, ARC, NITI Aayog, CA
  {
    id: 'arc-ethics',
    category: '2nd ARC Report',
    title: '4th ARC Report: Ethics in Governance',
    description: 'Recommends mandatory declarations of assets/liabilities by civil servants, a clear Code of Ethics separate from the Code of Conduct, and strengthening whistle-blower protection.',
    significance: 'Critical baseline for any GS4 answer on administrative integrity, anti-corruption, or civil services values.',
    paper: 'GS4'
  },
  {
    id: 'arc-citizen',
    category: '2nd ARC Report',
    title: '12th ARC Report: Citizen-Centric Administration',
    description: 'Proposes a 7-step model for public service delivery (Sevottam Model), formulation of reliable Citizen\'s Charters with independent audits, and active citizen feedback loops.',
    significance: 'Gold-standard citation for GS2 answers regarding public service reforms, administrative transparency, or e-governance.',
    paper: 'GS2'
  },
  {
    id: 'niti-multidimensional',
    category: 'NITI Aayog Report',
    title: 'National Multidimensional Poverty Index (MPI)',
    description: 'NITI Aayog\'s index assessing deprivations across health, education, and standard of living. It shows a significant decrease in multidimensional poverty in India.',
    significance: 'Perfect citation to support points on socio-economic growth, poverty reduction, welfare distribution, or social justice in GS1, GS2, and GS3.',
    paper: 'GS3'
  },
  {
    id: 'niti-sdg-index',
    category: 'NITI Aayog Report',
    title: 'NITI Aayog SDG India Index',
    description: 'Tracks the progress of all States and UTs on 17 Sustainable Development Goal targets. Encourages competitive and cooperative federalism.',
    significance: 'Excellent for linking state-level performance, cooperative federalism, and developmental indices in GS2 or GS3.',
    paper: 'GS2'
  },
  {
    id: 'ca-dpdp',
    category: 'Current Legislation',
    title: 'Digital Personal Data Protection (DPDP) Act, 2023',
    description: 'Establishes obligations for data fiduciaries, rights of data principals (including right to correction/erasure), and creates the Data Protection Board of India.',
    significance: 'Cite in GS2 and GS3 for privacy rights, cyber security, digital economy, e-governance, and tech regulation.',
    paper: 'GS2'
  },
  {
    id: 'ca-women-reservation',
    category: 'Current Legislation',
    title: 'Nari Shakti Vandan Adhiniyam, 2023 (106th Amendment)',
    description: 'Amends the Constitution to reserve one-third (33%) of all seats for women in the Lok Sabha and State Legislative Assemblies for 15 years.',
    significance: 'Crucial for GS1 (women empowerment) and GS2 (electoral reforms, political participation, and local-to-national governance).',
    paper: 'GS2'
  },
  {
    id: 'ca-one-nation',
    category: 'Current Affairs / Panels',
    title: 'Kovind Committee on One Nation One Election',
    description: 'Recommended implementing simultaneous elections for Lok Sabha and State Assemblies, followed by local body elections within 100 days.',
    significance: 'Extremely high-yield current reference for electoral reforms, federalism, financial savings, and administrative efficiency answers in GS2.',
    paper: 'GS2'
  },
  {
    id: 'fc-sixteenth',
    category: 'Finance Commission',
    title: '16th Finance Commission Terms of Reference',
    description: 'Chaired by Dr. Arvind Panagariya. Tasked with recommending the formula for vertical and horizontal devolution of central taxes between 2026 and 2031.',
    significance: 'Essential for answers discussing fiscal federalism, state financial autonomy, local body grants, or resource sharing in GS2 and GS3.',
    paper: 'GS2'
  },
  {
    id: 'fc-fifteenth-sharing',
    category: 'Finance Commission',
    title: '15th Finance Commission Devolution Formula',
    description: 'Maintained vertical devolution to states at 41%. For horizontal sharing, criteria included: Income Distance (45%), Population 2011 (15%), Forest & Ecology (10%), Tax Effort (2.5%).',
    significance: 'Use to detail federal tax-sharing friction points, cooperative fiscal frameworks, or regional disparities in GS2 or GS3.',
    paper: 'GS3'
  },
  {
    id: 'art-142',
    category: 'Constitutional Articles',
    title: 'Article 142 (Complete Justice)',
    description: 'Empowers the Supreme Court to pass any decree or order necessary for doing complete justice in any cause or matter pending before it.',
    significance: 'Can be used in answers discussing judicial activism, separation of powers, and the protective role of the judiciary.',
    paper: 'GS2'
  },
  {
    id: 'art-50',
    category: 'Constitutional Articles',
    title: 'Article 50 (Separation of Powers)',
    description: 'Directive Principle of State Policy (DPSP) instructing the State to separate the judiciary from the executive in the public services.',
    significance: 'Critical baseline for any answer on Judicial Independence or administrative overreach.',
    paper: 'GS2'
  },
  {
    id: 'art-356',
    category: 'Constitutional Articles',
    title: 'Article 356 (President\'s Rule)',
    description: 'Allows the Central Government to suspend state governance in case of failure of constitutional machinery.',
    significance: 'Key federalism battleground. Must cite alongside Sarkaria Commission recommendations to prevent misuse.',
    paper: 'GS2'
  },
  {
    id: 'jud-kesavananda',
    category: 'Landmark Judgments',
    title: 'Kesavananda Bharati v. State of Kerala (1973)',
    description: 'Introduced the historic "Basic Structure Doctrine", stating that Parliament cannot amend the fundamental features of the Constitution.',
    significance: 'The ultimate shield of Indian democracy; essential in any answer on Constitutional Amendments or Judicial Review.',
    paper: 'GS2'
  },
  {
    id: 'jud-puttaswamy',
    category: 'Landmark Judgments',
    title: 'K.S. Puttaswamy v. Union of India (2017)',
    description: 'Unanimously declared the Right to Privacy as an intrinsic part of the Right to Life and Personal Liberty under Article 21.',
    significance: 'Vital for answers discussing Aadhaar, surveillance, personal freedom, digital data protection (DPDP Act), or LGBTQ+ rights.',
    paper: 'GS2'
  },
  {
    id: 'jud-bommai',
    category: 'Landmark Judgments',
    title: 'S.R. Bommai v. Union of India (1994)',
    description: 'Set strict guidelines on the misuse of Article 356. Held that federalism is a basic feature and state assemblies must not be dismissed arbitrarily.',
    significance: 'Critical to check unilateral Central executive power over State Cabinets.',
    paper: 'GS2'
  },
  {
    id: 'com-sarkaria',
    category: 'Key Committees',
    title: 'Sarkaria Commission (1983)',
    description: 'Examined Center-State relations. Recommended that the Governor should be an eminent person from outside the state, not active in local politics.',
    significance: 'Gold-standard recommendation for constitutional and federal harmony answers.',
    paper: 'GS2'
  },
  {
    id: 'com-punchhi',
    category: 'Key Committees',
    title: 'Punchhi Commission (2007)',
    description: 'Advocated for fixed five-year terms for Governors and recommended providing states a say in their appointment.',
    significance: 'Modern blueprint for federalism reforms and state autonomy concerns.',
    paper: 'GS2'
  },
  {
    id: 'data-urban-nfhs',
    category: 'Key Statistics',
    title: 'NFHS-5 Data on Women & Health',
    description: 'National Family Health Survey indicating substantial rise in bank account ownership for women (approx. 78.6%) but slow gains in employment.',
    significance: 'Add depth to GS1 and GS3 answers regarding gender empowerment, rural shift, and social indicators.',
    paper: 'GS1'
  },
  {
    id: 'data-gdp-rd',
    category: 'Key Statistics',
    title: 'India\'s R&D Expenditure (0.64% of GDP)',
    description: 'India spend on Research & Development stands at around 0.64% of GDP, compared to 2-3% in advanced nations.',
    significance: 'Crucial statistic for S&T, innovation, industrialization, and high-tech manufacturing bottleneck discussions.',
    paper: 'GS3'
  },
  {
    id: 'com-swaminathan',
    category: 'Key Committees',
    title: 'Swaminathan Committee on Agriculture (2006)',
    description: 'Recommended setting Minimum Support Price (MSP) at at least 50% more than the weighted average cost of production (C2 + 50%).',
    significance: 'The cornerstone of any agricultural distress, MSP legal guarantee, or rural economy answer in GS3.',
    paper: 'GS3'
  },
  {
    id: 'eth-nolan',
    category: 'Ethics Concepts',
    title: 'Nolan Committee Principles',
    description: 'The 7 principles of public life: Selflessness, Integrity, Objectivity, Accountability, Openness, Honesty, and Leadership.',
    significance: 'Must-quote blueprint in GS4 answers describing administrative ethics and values in civil services.',
    paper: 'GS4'
  },
  {
    id: 'eth-gandhi-sins',
    category: 'Ethics Concepts',
    title: 'Mahatma Gandhi\'s Seven Social Sins',
    description: '1. Politics without principles. 2. Wealth without work. 3. Pleasure without conscience. 4. Knowledge without character. 5. Commerce without morality. 6. Science without humanity. 7. Worship without sacrifice.',
    significance: 'Extremely powerful value-add for GS4 Part A questions or philosophical essays to provide structural moral depth.',
    paper: 'GS4'
  }
];
