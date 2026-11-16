import { useDeferredValue, useEffect, useRef, useState } from 'react'
import profile from './assets/profile.jpg'
import kiitCampus from './assets/kiit-campus.jpg'
import etHackathon from './assets/et-hackathon.jpg'
import ieeePaper from './assets/ieee-paper.jpg'
import ScrollCursor from './components/ScrollCursor'
import LiveSignals from './components/LiveSignals'
import Project3D from './components/Project3D'
import CaseStudy, { CASE_STUDIES } from './components/CaseStudy'
import ContactForm from './components/ContactForm'
import { BRAND_ICONS } from './components/brandIcons'
import {
  CountUp,
  Line,
  Magnetic,
  ScrollProgress,
  useActiveSection,
  useParallax,
  useReveal,
  useSpotlight,
} from './components/motion'

/* ---------------- data ---------------- */
const NAV = [
  ['About', 'about'],
  ['Education', 'education'],
  ['Stack', 'tech'],
  ['Work', 'work'],
  ['Research', 'research'],
  ['Experience', 'experience'],
  ['Contact', 'contact'],
]
const SECTION_IDS = ['top', 'about', 'education', 'tech', 'work', 'research', 'experience', 'contact']

const GREETINGS = [
  { text: 'नमस्ते', lang: 'Hindi', cls: 'script-hi' },
  { text: 'Hello', lang: 'English', cls: '' },
  { text: 'ନମସ୍କାର', lang: 'Odia', cls: 'script-or' },
  { text: '안녕하세요', lang: 'Korean', cls: 'script-ko' },
  { text: 'こんにちは', lang: 'Japanese', cls: 'script-ja' },
]

const STATS = [
  ['02', 'Published papers', 'IEEE + Springer'],
  ['400+', 'DSA problems', 'Verified live below'],
  ['1,700+', 'Automated tests', 'StudyPilot CI'],
  ['61%', 'Violation rate cut', 'LLM red-teaming'],
]

const ICON = (name) => `${import.meta.env.BASE_URL}icons/${name}.svg`
const LANGS = [
  ['Java', ICON('java')], ['Python', ICON('python')], ['JavaScript', ICON('javascript')],
  ['TypeScript', ICON('typescript')], ['C++', ICON('cplusplus')], ['C', ICON('c')],
  ['Kotlin', ICON('kotlin')], ['SQL', ICON('sql')], ['HTML5', ICON('html5')], ['CSS3', ICON('css3')], ['Bash', ICON('bash')],
]
const TOOLS = [
  ['React', ICON('react')], ['Node.js', ICON('nodejs')], ['FastAPI', ICON('fastapi')], ['Jetpack Compose', ICON('jetpackcompose')],
  ['PostgreSQL', ICON('postgresql')], ['MongoDB', ICON('mongodb')], ['Redis', ICON('redis')], ['Docker', ICON('docker')],
  ['AWS', ICON('aws')], ['Azure', ICON('azure')], ['Linux', ICON('linux')], ['Git', ICON('git')],
  ['SQLite', ICON('sqlite')], ['Firebase', ICON('firebase')], ['GitHub Actions', ICON('githubactions')],
  ['pytest', ICON('pytest')], ['Playwright', ICON('playwright')],
  ['TensorFlow', ICON('tensorflow')], ['NumPy', ICON('numpy')], ['Pandas', ICON('pandas')],
]

/* Every claim below comes from the master profile. Links are only the ones it lists. */
const GH = 'https://github.com/Rishicreates20'
const PROJECTS = [
  { id: 'studypilot', title: 'StudyPilot', tag: 'AI learning platform', isNew: true, featured: true,
    cats: ['fullstack', 'ai'],
    icon: { variant: 'stack', shape: 'square', glyph: 'book', hue: 36 },
    desc: 'Set a learning goal with a level, category, minutes per day and a target date. StudyPilot generates notes, quizzes, a roadmap and resource links for each topic, and tracks progress, study time and goal status.',
    points: [
      'Python back end with explicit SQL on PostgreSQL and a documented REST API (OpenAPI).',
      'Durable job queue with leases, retries, idempotency keys and crash recovery.',
      'Every request runs as the signed-in user under Row Level Security; retrieval-augmented answers use pgvector.',
      '1,700+ automated tests (pytest, Vitest, Playwright) run in GitHub Actions on every change.',
    ],
    metrics: [['1,700+', 'automated tests'], ['3', 'topics tested end to end']],
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'pgvector', 'OpenAPI', 'GitHub Actions'],
    note: 'The live demo uses Firebase Google sign-in, with study goals synced to Firestore.',
    links: [['Live demo', 'https://studypilotpatch122.vercel.app'], ['Source', `${GH}/StudyPilot`]] },

  { id: 'waves', title: 'Waves QA', tag: 'API test harness for a text-to-speech API', isNew: true, featured: true,
    cats: ['qa'],
    icon: { variant: 'bars', glyph: 'wave', hue: 186, tilt: -14 },
    desc: 'Built for the smallest.ai hiring trial: a Python harness (requests + websockets, about 1,400 lines) that sends ~170 requests per run across the sync REST, SSE and WebSocket endpoints of the Waves TTS API, with a repro script for every finding.',
    points: [
      'Measured latency p50/p95: WebSocket first audio 160/195 ms, SSE 187/205 ms. Zero 5xx; a 10-request concurrent burst all succeeded.',
      'Every request tagged with session and request IDs, logged to JSONL with the server X-Request-Id; the API key is redacted in logs.',
      'Reported 6 findings (3 Medium, 3 Low), such as a WebSocket idle timeout that drops TCP without a Close frame and an official SDK quickstart that fails with 410 MODEL_DEPRECATED. A second run reproduced four of them exactly.',
    ],
    metrics: [['6', 'findings reported'], ['160 ms', 'p50 first audio (WS)']],
    stack: ['Python', 'requests', 'websockets', 'SSE', 'Node SDK'],
    links: [['Source', `${GH}/Waves_QA`]] },

  { id: 'nooki', title: 'Nooki', tag: 'Android reminder app with a 3D pet', isNew: true,
    cats: ['mobile'],
    icon: { variant: 'phone', glyph: 'bell', hue: 150, tilt: -10 },
    desc: 'A Kotlin reminder app on Jetpack Compose and Material 3, with Room + Flow for storage and a real-time 3D pet whose mood follows your reminders.',
    points: [
      'Exact alarms through AlarmManager.setAlarmClock wake through Doze, with a fallback if the exact-alarm permission is revoked. Alarms are restored after reboot, app update and time-zone changes.',
      'Notification actions (Complete for XP, Snooze 5m, Dismiss) through BroadcastReceivers, with XP and levels.',
      '3D pet (SceneView/Filament, glTF) with 4 moods from a pure PetMoodResolver covered by 7 unit tests.',
      'GitHub Actions runs unit tests and lint and builds debug and release APKs with R8 shrinking.',
    ],
    metrics: [['4', 'pet moods'], ['7', 'unit tests on mood logic']],
    stack: ['Kotlin 2.2', 'Jetpack Compose', 'Material 3', 'Room', 'AlarmManager', 'Filament'],
    links: [['Source', `${GH}/Nooki`]] },

  { id: 'veilo', title: 'Veilo', tag: 'Hybrid search engine',
    cats: ['systems', 'ai'],
    icon: { variant: 'orbit', glyph: 'search', hue: 265 },
    desc: 'BM25 keyword search (SQLite FTS5) plus dense vector search, merged through a custom Reciprocal Rank Fusion layer behind FastAPI.',
    stack: ['Python', 'FastAPI', 'SQLite FTS5', 'Dense vectors', 'RRF'],
    links: [['Live demo', 'https://private-search-buddy.vercel.app'], ['Source', `${GH}/private-search-buddy`]] },

  { id: 'redis', title: 'Redis Server for the JVM', tag: 'Java · built from scratch',
    cats: ['systems'],
    icon: { variant: 'cube', glyph: 'bolt', hue: 2 },
    desc: 'A Redis server written from scratch, with command handling, TTL-based key expiry and a browser terminal.',
    points: ['Lock-free, multi-threaded core on java.util.concurrent with a non-blocking network layer.'],
    stack: ['Java', 'java.util.concurrent', 'Non-blocking I/O', 'TTL expiry'],
    links: [['Source', `${GH}/Own-redis-java`]] },

  { id: 'db', title: 'Relational Database Engine', tag: 'Java · built from scratch',
    cats: ['systems'],
    icon: { variant: 'stack', shape: 'disc', glyph: 'db', hue: 210 },
    desc: 'A relational database from the ground up: storage engine, B-tree indexing, a SQL query parser and an execution layer.',
    stack: ['Java', 'Storage engine', 'B-tree', 'SQL parser', 'Query execution'],
    links: [['GitHub', GH]] },

  { id: 'safesteel', title: 'SafeSteel AI', tag: 'LLM evaluation and red-teaming',
    cats: ['ai', 'qa'],
    icon: { variant: 'pyramid', glyph: 'shield', hue: 22, tilt: -14 },
    desc: '500+ adversarial prompts across 6 failure categories, scored with DeepEval and tracked in LangSmith. The measured violation rate fell 61%.',
    metrics: [['61%', 'violation rate cut'], ['500+', 'adversarial prompts']],
    stack: ['Python', 'DeepEval', 'LangSmith', 'Red-teaming'],
    links: [['GitHub', GH]] },

  { id: 'path4u', title: 'Path4U', tag: 'Multi-agent career tool',
    cats: ['ai', 'fullstack'],
    icon: { variant: 'orbit', glyph: 'compass', hue: 320 },
    desc: 'Parses a resume against a job description and returns a personalised skill-gap roadmap in about 30 seconds, using RAG, vector search and SSE streaming.',
    stack: ['RAG', 'Vector search', 'SSE', 'Multi-agent'],
    links: [['Live demo', 'https://skill-compass-ai-07-three.vercel.app']] },

  { id: 'apb3', title: 'AMBA 3 APB Slave Verification', tag: 'SystemVerilog · hardware verification',
    cats: ['hardware'],
    icon: { variant: 'chip', glyph: 'chip', hue: 95, tilt: -52 },
    desc: 'A synthesizable APB3 slave register file with PREADY wait states and PSLVERR error responses, verified with a layered, class-based testbench. Run on Synopsys VCS.',
    points: [
      '6 concurrent SVA properties and 3 cover properties for APB protocol checks; interface with clocking blocks.',
      'Transaction, driver, monitor, scoreboard and env classes with mailboxes; weighted constrained-random stimulus; covergroups with 4 coverpoints and 3 crosses; shadow-register scoreboard.',
      'README documents 6 bugs found and fixed across RTL timing, driver protocol, stimulus weighting, coverage bins and FSM recovery.',
    ],
    stack: ['SystemVerilog', 'SVA', 'Covergroups', 'Synopsys VCS'],
    links: [['Source', `${GH}/apb3-slave-sv-verification`]] },

  { id: 'bloodcell', title: 'Blood Cell Classifier', tag: 'Deep learning · vision',
    cats: ['ai'],
    icon: { variant: 'sphere', glyph: 'cell', hue: 340, tilt: -18 },
    desc: 'An 8-class EfficientNetB3 image classifier with 98.77% validation accuracy and sub-100 ms inference.',
    metrics: [['98.77%', 'validation accuracy']],
    stack: ['EfficientNetB3', 'TensorFlow/Keras'],
    links: [['GitHub', GH]] },
]

const PROJECT_FILTERS = [
  ['all', 'All'],
  ['systems', 'Systems'],
  ['ai', 'AI & data'],
  ['fullstack', 'Full-stack'],
  ['mobile', 'Android'],
  ['qa', 'QA & testing'],
  ['hardware', 'Hardware'],
]

const MORE_WORK = [
  { title: 'AI Visibility Audit for a D2C food brand', meta: 'Brand engineering assignment · July 2026',
    desc: 'Ran 6 buyer-intent prompts across Claude, Gemini, ChatGPT and Perplexity (24 checks); the brand was missing or misrepresented in 20 of 24. Traced 3 root causes and proposed 5 fixes with a 90-day roadmap in a 10-slide deck.' },
  { title: 'A/B Test Campaign Analysis', meta: 'Python · Pandas · Plotly',
    desc: 'Compared a control and a test ad campaign over 30 days each, from spend and reach down the funnel to purchases, with Plotly funnel and trendline charts and a recommendation for when to use each.' },
  { title: 'ALU in Verilog', meta: 'Digital Logic course',
    desc: 'Designed an ALU in Verilog with testbenches, simulated on EDA Playground, and built digital logic circuits on a PCB in the lab.' },
]

const RESEARCH = [
  { n: '01', title: 'A Robust Framework for Stress Testing and Reconstruction in Medical Imaging Systems',
    venue: 'IEEE CCICT 2025', meta: 'Co-author · April 2025 · KIIT University',
    desc: 'A framework for stress-testing medical imaging models with image reconstruction techniques, measuring how much model performance degrades when the input is reconstructed or distorted.',
    mark: 'IEEE Xplore', hue: 210, img: ieeePaper, alt: 'IEEE Xplore record listing the paper and its six authors',
    link: 'https://ieeexplore.ieee.org/search/searchresult.jsp?queryText=A%20Robust%20Framework%20for%20Stress%20Testing%20and%20Reconstruction%20in%20Medical%20Imaging%20Systems',
    linkLabel: 'Read on IEEE Xplore' },
  { n: '02', title: 'Machine Intelligence Propelled Chatbot for College Inquiries Control',
    venue: 'ComSIA 2025 · Springer Nature Singapore', meta: 'Co-author · Published January 2026',
    desc: 'A book chapter on applying machine intelligence to a chatbot that answers college inquiries for a real institution.',
    mark: 'Springer Nature', hue: 352,
    link: 'https://link.springer.com/search?query=Machine+Intelligence+Propelled+Chatbot+for+College+Inquiries+Control',
    linkLabel: 'Find on SpringerLink' },
]

// Soft skills, each backed by a fact on this page (STRONG entries in the master profile only).
const SOFT_SKILLS = [
  ['Presenting insights', 'Turned 24 AI-engine checks into 3 root causes, 5 fixes and a 90-day plan in a 10-slide deck for a brand team.', '#/work/twt', 78],
  ['Written communication', 'Co-authored 2 peer-reviewed papers (IEEE CCICT 2025, Springer ComSIA 2025) and wrote a repro script for every API finding.', '#/work/waves', 186],
  ['Problem-solving', 'Traced a CI failure that local setup hid to a missing pgvector extension, and fixed a Gemini 400 by bisecting the request.', '#/work/studypilot', 36],
  ['Attention to detail', '1,700+ tests on every change, 500+ adversarial prompts, 24 structured checks.', '#/work/safesteel', 22],
  ['Teamwork', 'Shipped features in an Agile team of 20 alongside senior developers; co-author on both papers.', '#experience', 270],
]

const EDUCATION = [
  ['Degree', 'B.Tech, Computer Science & Engineering'],
  ['Institution', 'Kalinga Institute of Industrial Technology'],
  ['Duration', '2022 — 2026'],
  ['CGPA', '7.34'],
  ['Focus', 'Backend systems, databases, applied ML'],
]

const COURSEWORK = [
  'Data Structures & Algorithms', 'Operating Systems', 'DBMS / RDBMS', 'Computer Networks',
  'System Design', 'Compiler Design', 'Machine Learning', 'Software Engineering', 'Cloud Computing',
]

const AI_STACK = [
  { icon: 'claude', name: 'Claude', kind: 'Opus · Sonnet',
    note: 'Agentic coding across real repositories — multi-file refactors, architecture review, and test authoring.' },
  { icon: 'gpt', name: 'GPT', kind: 'OpenAI',
    note: 'Spec drafting, edge-case generation, and pressure-testing system designs before I commit to them.' },
  { icon: 'gemini', name: 'Gemini', kind: 'Google',
    note: 'Long-context passes over papers and whole codebases when the window matters more than the reasoning depth.' },
  { icon: 'cursor', name: 'Claude Code · Codex · Cursor', kind: 'Coding agents',
    note: 'Development and refactoring. On StudyPilot, an agent helped wire the API key integration and chase down deployment and sign-in bugs.' },
  { icon: 'langchain', name: 'DeepEval · LangSmith', kind: 'Evaluation',
    note: 'Adversarial harnesses and trace inspection — how SafeSteel AI measured a 61% drop in violations.' },
  { icon: 'prompt', name: 'Prompt & context engineering', kind: 'Practice',
    note: 'Structured prompting, tool schemas, and the retrieval design underneath Veilo.' },
]

const SKILLS = [
  ['Languages', ['Java', 'Python', 'JavaScript', 'TypeScript', 'C++', 'SQL']],
  ['Backend & Full-Stack', ['FastAPI', 'Node.js', 'React.js', 'REST APIs', 'OpenAPI', 'WebSocket', 'SSE']],
  ['Databases & Search', ['PostgreSQL', 'pgvector', 'MongoDB', 'SQLite (FTS5)', 'Redis', 'BM25', 'RRF']],
  ['Cloud & DevOps', ['AWS', 'Azure', 'Docker', 'CI/CD', 'Linux', 'Git']],
  ['Core CS', ['DSA', 'Operating Systems', 'DBMS / RDBMS', 'Networks', 'System Design']],
  ['Data & Testing', ['Pandas', 'NumPy', 'pytest', 'Vitest', 'Playwright', 'DeepEval', 'LangSmith']],
  ['Android', ['Kotlin', 'Jetpack Compose', 'Material 3', 'Room', 'AlarmManager']],
  ['Hardware', ['SystemVerilog', 'Verilog', 'SVA', 'Synopsys VCS']],
]

const CERTS = [
  ['Linux Foundation Certified System Administrator', 'LFCS'],
  ['Microsoft Azure Essentials', 'Microsoft'],
  ['SAP Analytics Cloud — Data Analyst', 'SAP'],
  ['Sales & CRM Overview · Lead Management · Opportunity Management', 'Salesforce'],
]

const SOCIALS = [
  ['GitHub', 'https://github.com/Rishicreates20', 'M12 .5C5.7.5.5 5.7.5 12a11.5 11.5 0 0 0 7.9 10.9c.6.1.8-.2.8-.5v-1.8c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.8 18.3 5.1 18.3 5.1c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5A11.5 11.5 0 0 0 23.5 12C23.5 5.7 18.3.5 12 .5z'],
  ['LinkedIn', 'https://linkedin.com/in/rishikeshsarangi', 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z'],
  ['LeetCode', 'https://leetcode.com/u/rishicreates26/', 'M13.48 0a1.37 1.37 0 0 0-.98.42L2.31 10.9a4.9 4.9 0 0 0 0 6.9l5.1 5.24a4.9 4.9 0 0 0 6.94.04l3.15-3.24a1.37 1.37 0 0 0-1.97-1.9l-3.15 3.23a2.16 2.16 0 0 1-3.06-.02l-5.1-5.24a2.16 2.16 0 0 1 0-3.06l10.19-10.48A1.37 1.37 0 0 0 13.48 0zM16.6 6.5a1.37 1.37 0 0 0 0 2.74h5.03a1.37 1.37 0 0 0 0-2.74H16.6z'],
]

/* ---------------- primitives ---------------- */
function Mark({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path d="M70 28 H42 a8 8 0 0 0 -8 8 v6 a8 8 0 0 0 8 8 H58 a8 8 0 0 1 8 8 v6 a8 8 0 0 1 -8 8 H30"
        fill="none" stroke="#e9a23b" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="70" cy="28" r="6" fill="#e9a23b" />
      <circle cx="30" cy="72" r="6" fill="#e9a23b" />
    </svg>
  )
}

function Logo() {
  return (
    <a href="#top" className="group flex items-center gap-3" aria-label="Rishikesh Sarangi — home">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-raise border border-line group-hover:border-accent/50 transition-colors duration-300">
        <Mark />
      </span>
      <span className="font-medium tracking-tight text-[0.98rem]">Rishikesh&nbsp;Sarangi</span>
    </a>
  )
}

function Arrow({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* GPT and the practice-based rows have no official mark to license — a
   consistent monogram tile keeps the row from going logo / no-logo. */
const MONOGRAMS = {
  gpt: 'GPT',
  prompt: '{ }',
}

function BrandIcon({ id, className = 'h-6 w-6' }) {
  const brand = BRAND_ICONS[id]
  if (brand) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" role="img" aria-label={brand.title}>
        <path d={brand.path} />
      </svg>
    )
  }
  return (
    <span className={`grid place-items-center font-mono font-semibold text-[0.6rem] tracking-tight ${className}`} aria-hidden="true">
      {MONOGRAMS[id] ?? '•'}
    </span>
  )
}

function Kicker({ index, children }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="font-mono text-xs text-accent">{index}</span>
      <span className="kicker-rule h-px w-10 bg-line2" />
      <span className="font-mono text-xs uppercase tracking-[0.22em] text-dim">{children}</span>
    </div>
  )
}

/* click-to-load YouTube facade — no third-party request until the viewer opts in */
function LittleRoomEmbed() {
  const [playing, setPlaying] = useState(false)
  const videoId = 'Eh63BLNgDYQ'
  const title = 'Great Things Start in Little Rooms — André 3000, via GoodScrolls'
  return (
    <div className="spot relative mx-auto aspect-[9/16] w-full max-w-[240px] overflow-hidden rounded-[1.5rem] border border-line2 bg-raise">
      {playing ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play — ${title}`}
          className="press group absolute inset-0 h-full w-full"
        >
          <img
            src={`https://i.ytimg.com/vi/${videoId}/hq2.jpg`}
            alt=""
            loading="lazy"
            width="480" height="360"
            className="h-full w-full object-cover"
          />
          <span className="absolute inset-0 bg-black/35 transition-colors duration-300 group-hover:bg-black/15" />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-accent text-base shadow-lg transition-transform duration-300 group-hover:scale-110">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
            </span>
          </span>
        </button>
      )}
    </div>
  )
}

/* ---------------- preloader ---------------- */
function Preloader({ onDone }) {
  const [i, setI] = useState(0)
  const [done, setDone] = useState(false)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setDone(true); onDone(); return }
    const t = setInterval(() => {
      setI((v) => {
        if (v + 1 >= GREETINGS.length) {
          clearInterval(t)
          setTimeout(() => { setDone(true); setTimeout(onDone, 650) }, 560)
          return v
        }
        return v + 1
      })
    }, 520)
    return () => clearInterval(t)
  }, [onDone])
  const g = GREETINGS[i]
  return (
    <div id="preloader" className={done ? 'done' : ''} role="status" aria-live="polite" aria-label="Loading">
      <div className="text-center px-6">
        <div key={i} className={`greet-word font-medium text-fg text-5xl sm:text-7xl leading-none ${g.cls}`}>{g.text}</div>
        <div className="mt-4 font-mono text-[0.7rem] uppercase tracking-[0.28em] text-faint">{g.lang}</div>
        <div className="mt-10 mx-auto h-px w-44 bg-line overflow-hidden">
          <div className="loader-bar h-full w-full bg-accent" />
        </div>
      </div>
    </div>
  )
}

/* ---------------- nav ---------------- */
function NavRail({ active }) {
  const wrapRef = useRef(null)
  const [pill, setPill] = useState(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const measure = () => {
      const el = wrap.querySelector(`[data-sec="${active}"]`)
      setPill(el ? { left: el.offsetLeft, width: el.offsetWidth } : null)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [active])

  return (
    <nav ref={wrapRef} className="relative hidden md:flex items-center gap-1" aria-label="Primary">
      <span
        className="nav-pill"
        style={{ left: pill?.left ?? 0, width: pill?.width ?? 0, opacity: pill ? 1 : 0 }}
        aria-hidden="true"
      />
      {NAV.map(([label, id]) => (
        <a
          key={id}
          data-sec={id}
          href={`#${id}`}
          aria-current={active === id ? 'true' : undefined}
          className={`relative px-3.5 py-2 text-sm rounded-lg transition-colors duration-300 ${active === id ? 'text-fg' : 'text-dim hover:text-fg'}`}
        >
          {label}
        </a>
      ))}
      <Magnetic strength={0.24} className="ml-2">
        <a href="#contact" className="press inline-flex items-center gap-2 rounded-full bg-accent text-base px-4 py-2 text-sm font-semibold hover:bg-accent2">
          Hire me <Arrow />
        </a>
      </Magnetic>
    </nav>
  )
}

function TechTile({ label, icon, index = 0 }) {
  return (
    <div
      className="tech-tile tile spot reveal group flex flex-col items-center gap-3 rounded-xl border border-line bg-surface p-5 hover:border-line2"
      style={{ '--i': index }}
    >
      <img src={icon} alt={`${label} logo`} width="40" height="40" loading="lazy" className="h-9 w-9 object-contain" />
      <span className="text-xs text-dim group-hover:text-fg transition-colors duration-300">{label}</span>
    </div>
  )
}

/* ---------------- projects ---------------- */
function ProjectLinks({ links, title }) {
  return (
    <div className="flex flex-wrap gap-2">
      {links.map(([label, href], i) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${title}: ${label} (opens in a new tab)`}
          className={`press inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold ${
            i === 0 && label === 'Live demo'
              ? 'bg-accent text-base hover:bg-accent2'
              : 'border border-line2 text-dim hover:text-fg hover:bg-surface'
          }`}
        >
          {label === 'Live demo' && <span className="h-1.5 w-1.5 rounded-full bg-base/70" />}
          {label} <Arrow />
        </a>
      ))}
    </div>
  )
}

function ProjectCard({ p, index }) {
  const [open, setOpen] = useState(false)
  const hasMore = p.points?.length > 0
  return (
    <article
      data-tilt
      style={{ '--h': p.icon.hue, '--i': index % 4 }}
      className={`proj-card spot group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface hover:border-line2 ${
        p.featured ? 'md:col-span-2 md:flex-row' : ''
      }`}
    >
      <div className={`proj-stage relative shrink-0 border-line ${p.featured ? 'h-56 md:h-auto md:w-[42%] border-b md:border-b-0 md:border-r' : 'h-48 border-b'}`}>
        <Project3D {...p.icon} size={p.featured ? 'lg' : 'md'} />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          {p.isNew && <span className="rounded-full bg-accent/15 border border-accent/40 px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-accent">New</span>}
        </div>
        {p.metrics && (
          <div className="absolute inset-x-4 bottom-3 flex flex-wrap gap-x-5 gap-y-1">
            {p.metrics.map(([v, l]) => (
              <div key={l} className="flex items-baseline gap-1.5">
                <span className="font-display text-xl proj-hue leading-none">{v}</span>
                <span className="text-[0.7rem] text-faint">{l}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-7">
        <div className="flex items-center gap-2.5">
          <span className="proj-dot h-2 w-2 rounded-full" />
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-faint">{p.tag}</span>
        </div>
        <h3 className="mt-3 font-display text-3xl md:text-[2.1rem] leading-none text-fg">{p.title}</h3>
        <p className="mt-3 text-dim leading-relaxed">{p.desc}</p>

        {hasMore && (
          <>
            <ul
              id={`pts-${p.id}`}
              className={`mt-4 space-y-2 text-sm text-dim ${open ? '' : p.featured ? 'hidden md:block' : 'hidden'}`}
            >
              {p.points.map((pt) => (
                <li key={pt} className="flex gap-2.5"><span className="proj-dot mt-[0.45rem] h-1 w-1 shrink-0 rounded-full" /><span>{pt}</span></li>
              ))}
            </ul>
            {(
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls={`pts-${p.id}`}
                className={`mt-3 self-start text-xs font-medium text-faint hover:text-accent transition-colors duration-300 ${p.featured ? 'md:hidden' : ''}`}
              >
                {open ? 'Show less' : `How it works (${p.points.length})`}
              </button>
            )}
          </>
        )}
        {p.note && <p className="mt-3 text-xs text-faint">{p.note}</p>}

        <div className="mt-auto pt-5">
          <div className="flex flex-wrap gap-1.5">
            {p.stack.map((s) => (<span key={s} className="font-mono text-[0.68rem] rounded-md border border-line px-2 py-0.5 text-faint">{s}</span>))}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {CASE_STUDIES[p.id] && (
              <a href={`#/work/${p.id}`} className="press inline-flex items-center gap-1.5 rounded-full border border-accent/40 px-3.5 py-2 text-xs font-semibold text-accent hover:bg-accent/10">
                Read case study <span aria-hidden="true">→</span>
              </a>
            )}
            <ProjectLinks links={p.links} title={p.title} />
          </div>
        </div>
      </div>
    </article>
  )
}

function ProjectGrid() {
  const [filter, setFilter] = useState('all')
  // The chip highlights at once; the heavier grid re-render follows without blocking input.
  const deferred = useDeferredValue(filter)
  const shown = PROJECTS.filter((p) => deferred === 'all' || p.cats.includes(deferred))
  const counts = Object.fromEntries(PROJECT_FILTERS.map(([id]) => [id, id === 'all' ? PROJECTS.length : PROJECTS.filter((p) => p.cats.includes(id)).length]))
  return (
    <>
      <div className="reveal mb-8 -mx-1 flex flex-wrap gap-2" role="group" aria-label="Filter projects">
        {PROJECT_FILTERS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={filter === id}
            onClick={() => setFilter(id)}
            className="proj-chip press rounded-full border border-line px-3.5 py-1.5 text-sm text-dim hover:text-fg hover:border-line2"
          >
            {label} <span className="ml-1 font-mono text-[0.7rem] opacity-60">{counts[id]}</span>
          </button>
        ))}
      </div>
      <div className="reveal grid md:grid-cols-2 gap-4 md:gap-5">
        {shown.map((p, i) => (
          <ProjectCard key={p.id} p={deferred === 'all' ? p : { ...p, featured: false }} index={i} />
        ))}
      </div>
    </>
  )
}

function MoreWork() {
  return (
    <div className="mt-16">
      <div className="reveal mb-5 font-mono text-xs uppercase tracking-[0.16em] text-faint">Also worked on</div>
      <div className="grid md:grid-cols-3 gap-4">
        {MORE_WORK.map((w, i) => (
          <div key={w.title} style={{ '--i': i }} className="spot tile reveal rounded-2xl border border-line p-5 hover:border-line2">
            <h3 className="text-fg font-medium leading-snug">{w.title}</h3>
            <div className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-faint">{w.meta}</div>
            <p className="mt-3 text-sm text-dim leading-relaxed">{w.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const RESUME_URL = `${import.meta.env.BASE_URL}Rishikesh-Sarangi-Resume.pdf`

/* Hash routes: #/work/<id> opens a case study; any other hash is a section on the home page. */
const caseFromHash = () => {
  const m = window.location.hash.match(/^#\/work\/([\w-]+)/)
  return m ? m[1] : null
}
function useCaseRoute() {
  const [route, setRoute] = useState(caseFromHash)
  useEffect(() => {
    const onHash = () => {
      const next = caseFromHash()
      setRoute(next)
      if (!next) {
        const id = window.location.hash.slice(1)
        // Scroll again once lazy content above has settled, so the section lands at the top.
        const go = () => document.getElementById(id)?.scrollIntoView()
        requestAnimationFrame(go)
        setTimeout(go, 400)
      }
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return route
}

/* ---------------- app ---------------- */
export default function App() {
  useReveal()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [imgOk, setImgOk] = useState(true)
  const [loaded, setLoaded] = useState(false)
  const active = useActiveSection(SECTION_IDS)
  const route = useCaseRoute()

  const portraitRef = useRef(null)
  const gridRef = useRef(null)
  useParallax(portraitRef, 40)
  useSpotlight(gridRef)

  useEffect(() => { document.body.style.overflow = loaded ? '' : 'hidden' }, [loaded])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const year = new Date().getFullYear()

  return (
    <div ref={gridRef} className={`stage grain vignette min-h-[100dvh] ${loaded ? 'ready' : ''}`}>
      <Preloader onDone={() => setLoaded(true)} />
      <ScrollCursor />
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-[70] focus:left-4 focus:top-4 focus:bg-accent focus:text-base focus:px-4 focus:py-2 focus:rounded-lg">Skip to content</a>

      {/* NAV */}
      <header className={`sticky top-0 z-40 backdrop-blur-md transition-colors duration-500 ${scrolled ? 'bg-base/80 border-b border-line' : 'bg-transparent border-b border-transparent'}`}>
        <div className="mx-auto max-w-5xl px-6 h-16 flex items-center justify-between">
          <Logo />
          <NavRail active={active} />
          <button className="md:hidden grid h-10 w-10 place-items-center rounded-lg border border-line hover:bg-surface press" aria-label="Toggle menu" aria-expanded={menuOpen} aria-controls="mnav" onClick={() => setMenuOpen((v) => !v)}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">{menuOpen ? <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /> : <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />}</svg>
          </button>
        </div>
        <ScrollProgress />
        {menuOpen && (
          <nav id="mnav" className="md:hidden border-t border-line bg-raise px-6 py-3 flex flex-col" aria-label="Mobile">
            {NAV.map(([label, id]) => (<a key={id} href={`#${id}`} className="py-2.5 text-dim hover:text-fg" onClick={() => setMenuOpen(false)}>{label}</a>))}
          </nav>
        )}
      </header>

      <main id="main" className="relative z-10">
        {route && <CaseStudy id={route} />}
        <div hidden={!!route}>
        {/* HERO */}
        <section id="top" className="mx-auto max-w-5xl px-6 pt-16 pb-14 md:pt-24 md:pb-20">
          <div className="grid md:grid-cols-[1.1fr_.9fr] gap-12 md:gap-16 items-center">
            <div className="stage-in">
              <span className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-medium text-dim">
                <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-accent" /></span>
                Open to work · SDE · Fresher
              </span>
              <h1 className="mt-7 font-display text-6xl sm:text-7xl md:text-[5.6rem] leading-[0.92] tracking-tight">
                <Line delay={140}>Rishikesh</Line>
                <Line delay={240} className="text-dim">Sarangi</Line>
              </h1>
              <p className="mt-7 text-lg text-dim max-w-md leading-relaxed">
                <span className="text-fg font-medium">Software Development Engineer.</span> I build backend systems from first principles — a database engine, a Redis clone, a search engine, all from scratch.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-faint">
                <span className="inline-flex items-center gap-1.5"><span className="text-accent">◈</span> Bengaluru, India</span>
                <span className="inline-flex items-center gap-1.5"><span className="text-accent">◈</span> B.Tech CSE, KIIT ’26</span>
              </div>
              <div className="mt-9 flex flex-wrap gap-3">
                <Magnetic>
                  <a href="#work" className="press inline-flex items-center gap-2 rounded-full bg-accent text-base px-5 py-3 text-sm font-semibold hover:bg-accent2">See my work <Arrow /></a>
                </Magnetic>
                <Magnetic>
                  <a href={RESUME_URL} download className="press inline-flex items-center gap-2 rounded-full border border-line2 px-5 py-3 text-sm font-medium hover:bg-surface">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    Download resume
                  </a>
                </Magnetic>
              </div>
              <div className="mt-9 flex items-center gap-3">
                {SOCIALS.map(([label, href, path]) => (
                  <Magnetic key={label} strength={0.4}>
                    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="press grid h-11 w-11 place-items-center rounded-xl border border-line text-dim hover:text-accent hover:border-accent/40 hover:bg-surface">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d={path} /></svg>
                    </a>
                  </Magnetic>
                ))}
              </div>
            </div>

            {/* portrait */}
            <div className="relative justify-self-center">
              <div className="pointer-events-none absolute -inset-6 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
              <div ref={portraitRef} className="relative rounded-[1.6rem] overflow-hidden border border-line2 w-[260px] sm:w-[300px] md:w-[330px] aspect-[4/5] bg-raise shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]">
                {imgOk ? (
                  <img src={profile} alt="Portrait of Rishikesh Sarangi" width="330" height="412" className="h-full w-full object-cover object-top" onError={() => setImgOk(false)} />
                ) : (<div className="grid h-full w-full place-items-center font-display text-7xl text-faint">RS</div>)}
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5" />
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-line2 bg-raise px-4 py-2 text-xs font-medium whitespace-nowrap">
                <span className="font-mono text-accent">02</span> papers · <span className="font-mono text-accent">CGPA</span> 7.34
              </div>
            </div>
          </div>
        </section>

        {/* CREDENTIAL STRIP */}
        <div className="border-y border-line">
          <div className="mx-auto max-w-5xl px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-line">
            {STATS.map(([num, label, sub], i) => (
              <div key={label} className="reveal px-5 py-7 first:pl-0" style={{ '--i': i }}>
                <div className="font-display text-4xl md:text-5xl leading-none text-fg tabular-nums">
                  <CountUp value={num} />
                </div>
                <div className="mt-2.5 text-sm text-fg">{label}</div>
                <div className="text-xs text-faint mt-0.5">{sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ABOUT */}
        <section id="about" className="mx-auto max-w-5xl px-6 py-20 md:py-28">
          <div className="grid md:grid-cols-[.75fr_1.25fr] gap-10">
            <div className="reveal">
              <Kicker index="01">About</Kicker>
              <h2 className="font-display text-4xl md:text-5xl leading-[1.05]">
                <Line delay={60}>Depth over</Line>
                <Line delay={150}>surface area.</Line>
              </h2>
            </div>
            <div className="reveal space-y-5 text-lg text-dim leading-relaxed" style={{ '--i': 1 }}>
              <p>I’m a backend and systems-focused engineer graduating from <strong className="text-fg font-medium">KIIT University</strong> in 2026. Most early-career engineers in the AI hiring pool have shipped LLM wrappers — I’ve built the layer underneath them: a relational database engine, a Redis clone, and a hybrid search engine, all from scratch.</p>
              <p>That systems depth pairs with a real research track. I’ve co-authored <strong className="text-fg font-medium">two published papers</strong> on stress-testing and evaluating models, and I carry the same robustness-and-evaluation lens into engineering work like SafeSteel&nbsp;AI, an LLM red-teaming framework.</p>
              <p>I care about the parts of a system most people treat as magic — how bytes hit disk, how a query planner decides, how a model quietly degrades under distortion. As a fresher I’m after <strong className="text-fg font-medium">SDE, Applied&nbsp;AI, and apprenticeship</strong> roles where that curiosity is an asset.</p>
            </div>
          </div>
        </section>

        {/* EDUCATION */}
        <section id="education" className="mx-auto max-w-5xl px-6 py-20 md:py-28 border-t border-line">
          <div className="reveal mb-12 max-w-2xl">
            <Kicker index="02">Education</Kicker>
            <h2 className="font-display text-4xl md:text-6xl leading-[1.02]">
              <Line delay={60}>Four years</Line>
              <Line delay={150}>at KIIT.</Line>
            </h2>
          </div>

          <figure className="reveal photo-fade relative overflow-hidden rounded-[1.75rem] border border-line">
            <img
              src={kiitCampus}
              alt="The KISS &amp; KIIT Convention Centre on the KIIT University campus at dusk"
              width="2018" height="700" loading="lazy"
              className="w-full h-[200px] sm:h-[280px] md:h-[360px] object-cover"
            />
            <figcaption className="absolute inset-x-0 bottom-0 p-6 md:p-9">
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Bhubaneswar, Odisha</div>
              <div className="mt-2 font-display text-3xl md:text-4xl leading-none">KIIT University</div>
            </figcaption>
          </figure>

          <div className="mt-12 grid md:grid-cols-[1.05fr_1fr] gap-10 md:gap-16">
            <dl className="reveal divide-y divide-line border-y border-line">
              {EDUCATION.map(([term, value]) => (
                <div key={term} className="grid grid-cols-[7.5rem_1fr] gap-4 py-4">
                  <dt className="font-mono text-xs uppercase tracking-[0.14em] text-faint pt-1">{term}</dt>
                  <dd className="text-fg">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="reveal" style={{ '--i': 1 }}>
              <div className="mb-4 font-mono text-xs uppercase tracking-[0.16em] text-faint">Coursework that stuck</div>
              <div className="flex flex-wrap gap-2">
                {COURSEWORK.map((c) => (
                  <span key={c} className="text-sm rounded-lg bg-surface border border-line px-2.5 py-1.5 text-dim">{c}</span>
                ))}
              </div>
            </div>
          </div>

          {/* RECOGNITION */}
          <div className="mt-16 md:mt-24">
            <div className="reveal mb-6 font-mono text-xs uppercase tracking-[0.16em] text-faint">Recognition</div>
            <div className="grid md:grid-cols-[1.15fr_1fr] gap-8 md:gap-12 items-start">
              <div className="spot reveal overflow-hidden rounded-2xl border border-line bg-raise">
                <img
                  src={etHackathon}
                  alt="The Economic Times AI Hackathon 2026 — Think AI. Build with GenAI."
                  width="638" height="480" loading="lazy"
                  className="w-full aspect-[16/10] object-cover"
                />
                <div className="p-6 md:p-7 border-t border-line">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-accent/40 text-accent text-xs font-medium px-2.5 py-1">Semi-finalist</span>
                    <span className="font-mono text-xs text-faint">2026</span>
                  </div>
                  <h3 className="mt-3 font-display text-2xl md:text-3xl leading-tight">ET AI Hackathon</h3>
                  <p className="mt-2 text-dim leading-relaxed">
                    Reached the semi-final round of The Economic Times’ national GenAI hackathon, placing among the leading teams from a field of 500+.
                  </p>
                </div>
              </div>
              <dl className="reveal divide-y divide-line border-y border-line" style={{ '--i': 1 }}>
                {CERTS.map(([title, issuer]) => (
                  <div key={title} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4">
                    <dt className="text-fg">{title}</dt>
                    <dd className="font-mono text-xs text-faint whitespace-nowrap">{issuer}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* TECH */}
        <section id="tech" className="mx-auto max-w-5xl px-6 py-20 md:py-24 border-t border-line">
          <div className="reveal mb-12 max-w-2xl">
            <Kicker index="03">Tech stack</Kicker>
            <h2 className="font-display text-4xl md:text-6xl leading-[1.02]"><Line delay={60}>Languages &amp; tools.</Line></h2>
            <p className="mt-4 text-dim text-lg">The stack I reach for — from low-level languages to the infra I build on.</p>
          </div>
          <div className="mb-4 font-mono text-xs uppercase tracking-[0.16em] text-faint">Languages</div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">{LANGS.map(([label, icon], i) => (<TechTile key={label} label={label} icon={icon} index={i} />))}</div>
          <div className="mt-10 mb-4 font-mono text-xs uppercase tracking-[0.16em] text-faint">Frameworks, data &amp; infra</div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">{TOOLS.map(([label, icon], i) => (<TechTile key={label} label={label} icon={icon} index={i} />))}</div>

          <div className="mt-16">
            <div className="reveal mb-2 font-mono text-xs uppercase tracking-[0.16em] text-faint">AI &amp; GenAI workflow</div>
            <p className="reveal mb-7 text-dim max-w-2xl leading-relaxed">
              I work AI-first, but I keep the judgement. These are the tools in rotation and what each one actually earns its place doing.
            </p>
            <div className="divide-y divide-line border-y border-line">
              {AI_STACK.map(({ icon, name, kind, note }, i) => (
                <div key={name} style={{ '--i': i }} className="reveal grid sm:grid-cols-[14rem_1fr] gap-x-5 gap-y-2 py-5">
                  <div className="flex items-center gap-3.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line bg-surface text-dim">
                      <BrandIcon id={icon} className="h-[18px] w-[18px]" />
                    </span>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="text-fg font-medium">{name}</span>
                      <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-faint">{kind}</span>
                    </div>
                  </div>
                  <p className="text-dim leading-relaxed sm:pl-0">{note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WORK */}
        <section id="work" className="mx-auto max-w-5xl px-6 py-20 md:py-28 border-t border-line">
          <div className="reveal mb-10 max-w-2xl">
            <Kicker index="04">Selected work</Kicker>
            <h2 className="font-display text-4xl md:text-6xl leading-[1.02]">
              <Line delay={60}>Things I’ve built</Line>
              <Line delay={150}>and shipped.</Line>
            </h2>
            <p className="mt-4 text-dim text-lg">Systems from scratch, full-stack AI products, an Android app, API testing and hardware verification. Each one links to its code or a live demo.</p>
          </div>
          <ProjectGrid />
          <MoreWork />

          <div className="reveal mt-20">
            <LiveSignals />
          </div>
        </section>

        {/* RESEARCH */}
        <section id="research" className="res-section relative mx-auto max-w-5xl px-6 py-20 md:py-28 border-t border-line">
          <div aria-hidden="true" className="res-deco pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="res-glow res-glow-a" />
            <div className="res-glow res-glow-b" />
            <div className="res-grid" />
            <div className="res-ghost font-display">R&amp;D</div>
          </div>

          <div className="reveal mb-12 grid md:grid-cols-[1fr_auto] gap-8 items-end">
            <div className="max-w-2xl">
              <Kicker index="05">Research &amp; case studies</Kicker>
              <h2 className="font-display text-4xl md:text-6xl leading-[1.02]">
                <Line delay={60}>Find the cause,</Line>
                <Line delay={150}><span className="text-accent italic">then explain it.</span></Line>
              </h2>
              <p className="mt-4 text-dim text-lg">Two published papers and four written case studies. Each one starts with a measurement and ends with something another person can read and act on.</p>
            </div>
            <div className="grid grid-cols-2 gap-2 md:w-[260px]">
              {[['02', 'papers'], ['04', 'case studies'], ['24', 'AI checks'], ['1,700+', 'tests in CI']].map(([v, l]) => (
                <div key={l} className="res-glass rounded-xl px-3.5 py-3">
                  <div className="font-display text-2xl text-fg leading-none">{v}</div>
                  <div className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-faint">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* papers */}
          <div className="reveal flex items-center gap-3 mb-5">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-faint">Published</span>
            <span className="h-px flex-1 bg-gradient-to-r from-line2 to-transparent" />
          </div>
          <div className="reveal grid md:grid-cols-2 gap-4">
            {RESEARCH.map((r, i) => (
              <article key={r.n} data-tilt style={{ '--h': r.hue, '--i': i }}
                className="proj-card spot group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface hover:border-line2">
                <div className="proj-stage relative h-52 shrink-0 border-b border-line overflow-hidden">
                  {r.img ? (
                    <a href={r.link} target="_blank" rel="noopener noreferrer" aria-label={`${r.linkLabel}: ${r.title}`} className="res-paper absolute left-1/2 top-1/2">
                      <img src={r.img} alt={r.alt} width="790" height="800" loading="lazy" className="h-full w-full object-cover object-top" />
                    </a>
                  ) : (
                    <Project3D variant="stack" shape="square" glyph="book" hue={r.hue} tilt={-16} />
                  )}
                  <div className="res-shine" aria-hidden="true" />
                  <div className="absolute left-4 top-4 flex items-center gap-2">
                    <span className="res-glass rounded-full px-2.5 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] proj-hue">Peer-reviewed</span>
                  </div>
                  <div className="absolute right-4 bottom-3 font-display text-5xl leading-none text-fg/10">{r.n}</div>
                </div>
                <div className="flex flex-1 flex-col p-6 md:p-7">
                  <div className="flex items-center gap-2.5">
                    <span className="proj-dot h-2 w-2 rounded-full" />
                    <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-faint">{r.venue}</span>
                  </div>
                  <h3 className="mt-3 font-display text-2xl md:text-[1.7rem] leading-[1.1] text-fg">{r.title}</h3>
                  <div className="mt-2 text-sm text-faint">{r.meta}</div>
                  <p className="mt-3 text-dim leading-relaxed">{r.desc}</p>
                  <a href={r.link} target="_blank" rel="noopener noreferrer"
                    className="press mt-auto pt-5 inline-flex items-center gap-1.5 self-start text-sm font-semibold proj-hue hover:text-fg transition-colors duration-300">
                    {r.linkLabel} <Arrow />
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* case studies */}
          <div className="reveal mt-16 flex items-center gap-3 mb-5">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-faint">Case studies</span>
            <span className="h-px flex-1 bg-gradient-to-r from-line2 to-transparent" />
          </div>
          {(() => {
            const f = CASE_STUDIES.twt
            return (
              <article data-tilt style={{ '--h': f.icon.hue }}
                className="reveal proj-card spot group flex flex-col md:flex-row overflow-hidden rounded-2xl border border-line bg-surface hover:border-line2">
                <a href="#/work/twt" className="res-cover relative block aspect-video md:aspect-auto md:w-[52%] shrink-0 overflow-hidden border-b md:border-b-0 md:border-r border-line" aria-label="Read the AI Visibility Audit case study">
                  <img src={f.cover.src} alt={f.cover.alt} width="1200" height="675" loading="lazy" className="h-full w-full object-contain bg-[#0b0b0d]" />
                  <div className="res-cover-fade" aria-hidden="true" />
                  <div className="absolute left-4 top-4 flex items-center gap-2">
                    <span className="rounded-full bg-accent/15 border border-accent/40 px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-accent backdrop-blur">New</span>
                  </div>
                  <div className="absolute inset-x-4 bottom-4 hidden md:flex flex-wrap gap-2">
                    {f.metrics.map(([v, l]) => (
                      <div key={l} className="res-glass rounded-xl px-3 py-2 flex items-baseline gap-1.5">
                        <span className="font-display text-2xl proj-hue leading-none">{v}</span>
                        <span className="text-[0.7rem] text-dim">{l}</span>
                      </div>
                    ))}
                  </div>
                  <span className="res-reveal" aria-hidden="true">Read the case study <span>→</span></span>
                </a>
                <div className="flex flex-1 flex-col p-6 md:p-8">
                  <div className="flex items-center gap-2.5">
                    <span className="proj-dot h-2 w-2 rounded-full" />
                    <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-faint">Brand audit · July 2026</span>
                  </div>
                  <h3 className="mt-3 font-display text-3xl md:text-[2.3rem] leading-[1.02] text-fg">The Whole Truth: AI Visibility Audit</h3>
                  <p className="mt-3 text-dim leading-relaxed">{f.lede}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {f.skills.map((sk) => <span key={sk} className="res-skill rounded-full px-2.5 py-1 text-[0.7rem]">{sk}</span>)}
                  </div>
                  <div className="mt-auto pt-6 flex flex-wrap items-center gap-2">
                    <a href="#/work/twt" className="press inline-flex items-center gap-1.5 rounded-full bg-accent text-base px-4 py-2 text-xs font-semibold hover:bg-accent2">Read case study <span aria-hidden="true">→</span></a>
                    <a href={f.links[0][1]} download className="press inline-flex items-center gap-1.5 rounded-full border border-line2 px-4 py-2 text-xs font-semibold text-dim hover:text-fg hover:bg-surface">Deck (PDF) <Arrow /></a>
                  </div>
                </div>
              </article>
            )
          })()}
          <div className="reveal mt-4 grid md:grid-cols-3 gap-4">
            {['studypilot', 'waves', 'safesteel'].map((k, i) => {
              const c = CASE_STUDIES[k]
              return (
                <a key={k} href={`#/work/${k}`} data-tilt style={{ '--h': c.icon.hue, '--i': i }}
                  className="proj-card spot group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface hover:border-line2">
                  <div className="proj-stage relative h-44 shrink-0 border-b border-line">
                    <Project3D {...c.icon} />
                    <div className="absolute inset-x-4 bottom-3 flex flex-wrap gap-x-4 gap-y-1">
                      {c.metrics.map(([v, l]) => (
                        <div key={l} className="flex items-baseline gap-1.5">
                          <span className="font-display text-xl proj-hue leading-none">{v}</span>
                          <span className="text-[0.68rem] text-faint">{l}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-2.5">
                      <span className="proj-dot h-2 w-2 rounded-full" />
                      <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-faint">{c.kicker.replace('Case study · ', '')}</span>
                    </div>
                    <div className="mt-3 font-display text-[1.75rem] leading-none text-fg">{c.title}</div>
                    <p className="mt-3 text-sm text-dim leading-relaxed line-clamp-3">{c.lede}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {c.skills.map((sk) => <span key={sk} className="res-skill rounded-full px-2.5 py-1 text-[0.68rem]">{sk}</span>)}
                    </div>
                    <span className="mt-auto pt-5 inline-flex items-center gap-1.5 text-sm font-semibold proj-hue">Read case study <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span></span>
                  </div>
                </a>
              )
            })}
          </div>

          {/* soft skills */}
          <div className="reveal mt-20 res-glass res-skills relative overflow-hidden rounded-3xl p-6 md:p-10">
            <div className="res-skills-glow" aria-hidden="true" />
            <div className="relative flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="font-mono text-xs uppercase tracking-[0.18em] text-faint">Soft skills</div>
                <h3 className="mt-2 font-display text-3xl md:text-5xl leading-[1.02]">Every one comes <span className="italic text-accent">with receipts.</span></h3>
              </div>
              <p className="max-w-xs text-sm text-dim">No adjectives without proof. Each skill links to the work that shows it.</p>
            </div>
            <div className="relative mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {SOFT_SKILLS.map(([k, v, href, hue], i) => (
                <a key={k} href={href} style={{ '--h': hue }}
                  className={`res-proof spot tile group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-base/70 p-5 hover:border-line2 ${i === 0 ? 'lg:row-span-2' : ''}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[0.65rem] proj-hue">{String(i + 1).padStart(2, '0')}</span>
                    <span className="proj-dot h-1.5 w-1.5 rounded-full" />
                  </div>
                  <div className={`mt-3 text-fg font-medium ${i === 0 ? 'font-display text-3xl leading-none' : ''}`}>{k}</div>
                  <p className="mt-2 text-sm text-dim leading-relaxed">{v}</p>
                  <span className="mt-auto pt-4 text-xs font-semibold proj-hue opacity-70 group-hover:opacity-100 transition-opacity duration-300">See the proof <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span></span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* EXPERIENCE + SKILLS */}
        <section id="experience" className="mx-auto max-w-5xl px-6 py-20 md:py-28 border-t border-line">
          <div className="reveal mb-12">
            <Kicker index="06">Experience</Kicker>
            <h2 className="font-display text-4xl md:text-6xl leading-[1.02]"><Line delay={60}>Where I’ve shipped.</Line></h2>
          </div>
          <div className="spot reveal rounded-2xl border border-line p-7 md:p-9 hover:border-line2 transition-colors duration-300">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-2xl md:text-3xl">Web Development Intern</h3>
              <span className="font-mono text-sm text-faint">May 2024 – June 2024</span>
            </div>
            <div className="mt-1 text-accent font-medium">Teachnook × Rhyno EV</div>
            <ul className="mt-6 space-y-3 text-dim">
              {['Traced data-pipeline defects to their root cause through log analysis; the fixes cut end-to-end latency by 25%.', 'Refactored React rendering and data-flow logic on critical user paths for a 30% performance improvement.', 'Standardised handling of structured and semi-structured data, reducing runtime inconsistencies.', 'Shipped features in an Agile team of 20 alongside senior developers, keeping cross-browser compatibility.'].map((li, i) => (
                <li key={i} className="flex gap-3"><span className="mt-2.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" /><span>{li}</span></li>
              ))}
            </ul>
          </div>

          {/* INTERLUDE — a personal aside, not a numbered section */}
          <div className="reveal mt-20 md:mt-28 grid md:grid-cols-[1fr_240px] gap-10 md:gap-16 items-center">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.22em] text-faint">What aspires me to keep going</div>
              <blockquote className="mt-4 font-display text-3xl md:text-5xl leading-[1.08] text-fg">
                “Great things start in a little room.”
              </blockquote>
              <p className="mt-5 text-dim leading-relaxed max-w-md">
                André 3000, on staying small and starting anyway. It’s the closest thing I have to a personal motto — most of what’s on this page started in one.
              </p>
              <p className="mt-4 font-mono text-xs text-faint">
                Source: André 3000 · via{' '}
                <a href="https://www.youtube.com/@Good_Scrolls" target="_blank" rel="noopener noreferrer" className="text-dim hover:text-accent transition-colors duration-300">GoodScrolls</a>
                {' '}on YouTube ·{' '}
                <a href="https://www.youtube.com/shorts/Eh63BLNgDYQ" target="_blank" rel="noopener noreferrer" className="text-dim hover:text-accent transition-colors duration-300">watch the clip</a>
              </p>
            </div>
            <LittleRoomEmbed />
          </div>

          <div className="reveal mt-16 mb-8">
            <Kicker index="07">Toolkit</Kicker>
            <h2 className="font-display text-3xl md:text-5xl leading-[1.05]"><Line delay={60}>What I work with.</Line></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SKILLS.map(([group, items], i) => (
              <div key={group} style={{ '--i': i }} className="spot tile reveal rounded-2xl border border-line p-5 hover:border-line2">
                <h3 className="text-sm font-semibold mb-3 text-fg">{group}</h3>
                <div className="flex flex-wrap gap-2">{items.map((s) => (<span key={s} className="text-sm rounded-lg bg-surface border border-line px-2.5 py-1 text-dim">{s}</span>))}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="mx-auto max-w-5xl px-6 pb-28 pt-4">
          <div className="reveal relative overflow-hidden rounded-[2rem] border border-accent/30 px-8 py-16 md:px-16 md:py-24 text-center">
            <div className="absolute inset-0 -z-10" style={{ background: 'radial-gradient(120% 120% at 50% 0%, rgba(233,162,59,0.16), transparent 60%)' }} aria-hidden="true" />
            <Mark className="h-9 w-9 mx-auto mb-6" />
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-accent">Contact</span>
            <h2 className="mt-4 font-display text-5xl md:text-7xl leading-[1.0]">
              <Line delay={80}>Let’s build</Line>
              <Line delay={180}>something solid.</Line>
            </h2>
            <p className="mt-6 text-dim text-lg max-w-xl mx-auto">I’m open to SDE, Applied&nbsp;AI, and apprenticeship roles. If you’re hiring for depth, I’d love to talk.</p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Magnetic>
                <a href="mailto:rishikeshsarangi56@gmail.com" className="press inline-flex items-center gap-2 rounded-full bg-accent text-base px-6 py-3.5 text-sm font-semibold hover:bg-accent2">
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  rishikeshsarangi56@gmail.com
                </a>
              </Magnetic>
              <Magnetic>
                <a href={RESUME_URL} download className="press inline-flex items-center gap-2 rounded-full border border-line2 px-6 py-3.5 text-sm font-medium hover:bg-surface">Resume (PDF)</a>
              </Magnetic>
              <Magnetic>
                <a href="https://github.com/Rishicreates20" target="_blank" rel="noopener noreferrer" className="press inline-flex items-center gap-2 rounded-full border border-line2 px-6 py-3.5 text-sm font-medium hover:bg-surface">GitHub <Arrow /></a>
              </Magnetic>
              <Magnetic>
                <a href="https://linkedin.com/in/rishikeshsarangi" target="_blank" rel="noopener noreferrer" className="press inline-flex items-center gap-2 rounded-full border border-line2 px-6 py-3.5 text-sm font-medium hover:bg-surface">LinkedIn <Arrow /></a>
              </Magnetic>
            </div>
          </div>
          <div className="reveal mx-auto mt-10 max-w-2xl rounded-[1.5rem] border border-line bg-raise/70 p-6 md:p-8">
            <div className="mb-5 text-left">
              <div className="font-mono text-xs uppercase tracking-[0.18em] text-faint">Or leave a message</div>
            </div>
            <ContactForm />
          </div>
        </section>
        </div>
      </main>

      <footer className="border-t border-line relative z-10">
        <div className="mx-auto max-w-5xl px-6 py-8 flex flex-wrap items-center justify-between gap-4 text-sm text-faint">
          <div className="flex items-center gap-3"><Mark className="h-4 w-4" /> © {year} Rishikesh Sarangi · Bengaluru, India</div>
          <div className="flex gap-5">
            <a className="hover:text-fg transition-colors duration-300" href="https://github.com/Rishicreates20" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a className="hover:text-fg transition-colors duration-300" href="https://linkedin.com/in/rishikeshsarangi" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a className="hover:text-fg transition-colors duration-300" href="https://leetcode.com/u/rishicreates26/" target="_blank" rel="noopener noreferrer">LeetCode</a>
            <a className="hover:text-fg transition-colors duration-300" href="mailto:rishikeshsarangi56@gmail.com">Email</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
