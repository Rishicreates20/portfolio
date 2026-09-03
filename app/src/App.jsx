import { useEffect, useRef, useState } from 'react'
import profile from './assets/profile.jpg'
import ScrollCursor from './components/ScrollCursor'
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
  ['Stack', 'tech'],
  ['Work', 'work'],
  ['Research', 'research'],
  ['Experience', 'experience'],
  ['Contact', 'contact'],
]
const SECTION_IDS = ['top', 'about', 'tech', 'work', 'research', 'experience', 'contact']

const GREETINGS = [
  { text: 'नमस्ते', lang: 'Hindi', cls: 'script-hi' },
  { text: 'Hello', lang: 'English', cls: '' },
  { text: 'ନମସ୍କାର', lang: 'Odia', cls: 'script-or' },
  { text: '안녕하세요', lang: 'Korean', cls: 'script-ko' },
  { text: 'こんにちは', lang: 'Japanese', cls: 'script-ja' },
]

const STATS = [
  ['02', 'Published papers', 'IEEE + Springer'],
  ['250+', 'DSA problems', '89.7% acceptance'],
  ['03', 'Systems from scratch', 'DB · Redis · Search'],
  ['61%', 'Violation rate cut', 'LLM red-teaming'],
]

const ICON = (name) => `${import.meta.env.BASE_URL}icons/${name}.svg`
const LANGS = [
  ['Java', ICON('java')], ['Python', ICON('python')], ['JavaScript', ICON('javascript')],
  ['TypeScript', ICON('typescript')], ['C++', ICON('cplusplus')], ['C', ICON('c')],
  ['SQL', ICON('sql')], ['HTML5', ICON('html5')], ['CSS3', ICON('css3')], ['Bash', ICON('bash')],
]
const TOOLS = [
  ['React', ICON('react')], ['Node.js', ICON('nodejs')], ['FastAPI', ICON('fastapi')], ['Next.js', ICON('nextjs')],
  ['PostgreSQL', ICON('postgresql')], ['MongoDB', ICON('mongodb')], ['Redis', ICON('redis')], ['Docker', ICON('docker')],
  ['AWS', ICON('aws')], ['Azure', ICON('azure')], ['Linux', ICON('linux')], ['Git', ICON('git')],
  ['TensorFlow', ICON('tensorflow')], ['NumPy', ICON('numpy')], ['Pandas', ICON('pandas')],
]

const PROJECTS = [
  { n: '01', title: 'Veilo', tag: 'Privacy-first hybrid search engine', anchor: true,
    desc: 'A real retrieval engine — not an LLM wrapper. Fuses BM25 keyword retrieval (SQLite FTS5) with dense semantic search (Sentence Transformers) through a custom Reciprocal Rank Fusion layer, behind an async crawler and a FastAPI backend. Deployed and publicly accessible.',
    stack: ['Python', 'FastAPI', 'SQLite FTS5', 'Sentence Transformers', 'RRF'],
    link: 'https://github.com/Rishicreates20/private-search-buddy', linkLabel: 'Source' },
  { n: '02', title: 'Relational Database Engine', tag: 'Built end-to-end',
    desc: 'A relational database from the ground up: on-disk storage engine, B-tree indexing, a SQL query parser, and an execution layer. My strongest asset for system-design and storage/infra conversations.',
    stack: ['Storage engine', 'B-tree', 'SQL parser', 'Query execution'],
    link: 'https://github.com/Rishicreates20', linkLabel: 'GitHub' },
  { n: '03', title: 'Redis Clone', tag: 'Java · in-memory store',
    desc: 'An in-memory key–value store modelled on Redis: core data structures, a command protocol handler, and TTL-based key expiry. A study in concurrency, memory layout, and protocol design.',
    stack: ['Java', 'In-memory store', 'Protocol design', 'TTL expiry'],
    link: 'https://github.com/Rishicreates20', linkLabel: 'GitHub' },
  { n: '04', title: 'SafeSteel AI', tag: 'LLM evaluation & red-teaming',
    desc: 'Automated adversarial testing across 500+ prompts spanning 6 failure categories, cutting the measured violation rate by 61%. Built on DeepEval and LangSmith — the engineering companion to my robustness research.',
    stack: ['DeepEval', 'LangSmith', 'Red-teaming', 'Python'],
    link: 'https://github.com/Rishicreates20', linkLabel: 'GitHub' },
  { n: '05', title: 'Blood Cell Classifier', tag: 'Deep learning · vision',
    desc: 'An EfficientNetB3 classifier spanning 8 blood-cell categories on a medical-imaging dataset, tuned to a clean 98.77% validation accuracy.',
    stack: ['EfficientNetB3', 'TensorFlow/Keras', 'Image classification'],
    link: 'https://github.com/Rishicreates20', linkLabel: 'GitHub' },
]

const RESEARCH = [
  { n: '01', title: 'A Robust Framework for Stress Testing and Reconstruction in Medical Imaging Systems',
    venue: 'IEEE CCICT 2025', meta: 'Co-author — led implementation & ML research · April 2025 · KIIT University',
    desc: 'Led the framework implementation: built the reconstruction and perturbation pipeline used to stress-test medical imaging systems, and designed the evaluation methodology quantifying model degradation under reconstruction-based distortion.' },
  { n: '02', title: 'Machine Intelligence Propelled Chatbot for College Inquiries Control',
    venue: 'ComSIA 2025 · Springer Nature Singapore', meta: 'Co-author · Published January 2026 · Intl. Conference on Computing Systems & Intelligent Applications',
    desc: 'A book-chapter contribution on applying machine intelligence to a college-inquiry chatbot — designing the intent handling and response system for a real institutional use case.' },
]

const SKILLS = [
  ['Languages', ['Java', 'Python', 'JavaScript', 'TypeScript', 'C++', 'SQL']],
  ['Backend & Full-Stack', ['FastAPI', 'Node.js', 'React.js', 'Next.js', 'REST APIs', 'WebSocket', 'SSE']],
  ['Databases & Search', ['PostgreSQL', 'MongoDB', 'SQLite (FTS5)', 'Redis', 'BM25', 'Dense vectors', 'RRF']],
  ['Cloud & DevOps', ['AWS', 'Azure', 'Docker', 'CI/CD', 'Linux', 'Git']],
  ['Core CS', ['DSA', 'Operating Systems', 'DBMS / RDBMS', 'Networks', 'System Design']],
  ['Data & Testing', ['ETL pipelines', 'Pandas', 'NumPy', 'DeepEval', 'LangSmith']],
]

const CERTS = [
  ['Linux Foundation Certified System Administrator', 'LFCS'],
  ['Microsoft Azure Essentials', 'Microsoft'],
  ['SAP Analytics Cloud — Data Analyst', 'SAP'],
  ['Semi-finalist — ET-AI Hackathon 2026', 'Top teams / 500+'],
]

const SOCIALS = [
  ['GitHub', 'https://github.com/Rishicreates20', 'M12 .5C5.7.5.5 5.7.5 12a11.5 11.5 0 0 0 7.9 10.9c.6.1.8-.2.8-.5v-1.8c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.8 18.3 5.1 18.3 5.1c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5A11.5 11.5 0 0 0 23.5 12C23.5 5.7 18.3.5 12 .5z'],
  ['LinkedIn', 'https://linkedin.com/in/rishikeshsarangi', 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z'],
  ['LeetCode', 'https://leetcode.com/rishicreates26', 'M13.48 0a1.37 1.37 0 0 0-.98.42L2.31 10.9a4.9 4.9 0 0 0 0 6.9l5.1 5.24a4.9 4.9 0 0 0 6.94.04l3.15-3.24a1.37 1.37 0 0 0-1.97-1.9l-3.15 3.23a2.16 2.16 0 0 1-3.06-.02l-5.1-5.24a2.16 2.16 0 0 1 0-3.06l10.19-10.48A1.37 1.37 0 0 0 13.48 0zM16.6 6.5a1.37 1.37 0 0 0 0 2.74h5.03a1.37 1.37 0 0 0 0-2.74H16.6z'],
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

function Kicker({ index, children }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="font-mono text-xs text-accent">{index}</span>
      <span className="kicker-rule h-px w-10 bg-line2" />
      <span className="font-mono text-xs uppercase tracking-[0.22em] text-dim">{children}</span>
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

/* ---------------- app ---------------- */
export default function App() {
  useReveal()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [imgOk, setImgOk] = useState(true)
  const [loaded, setLoaded] = useState(false)
  const active = useActiveSection(SECTION_IDS)

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
                  <a href="mailto:rishikeshsarangi56@gmail.com" className="press inline-flex items-center gap-2 rounded-full border border-line2 px-5 py-3 text-sm font-medium hover:bg-surface">Get in touch</a>
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
              <div className="pt-3 flex flex-wrap gap-2">
                {CERTS.map(([t]) => (<span key={t} className="press inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm text-dim hover:border-accent/40 hover:text-fg"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> {t}</span>))}
              </div>
            </div>
          </div>
        </section>

        {/* TECH */}
        <section id="tech" className="mx-auto max-w-5xl px-6 py-20 md:py-24 border-t border-line">
          <div className="reveal mb-12 max-w-2xl">
            <Kicker index="02">Tech stack</Kicker>
            <h2 className="font-display text-4xl md:text-6xl leading-[1.02]"><Line delay={60}>Languages &amp; tools.</Line></h2>
            <p className="mt-4 text-dim text-lg">The stack I reach for — from low-level languages to the infra I build on.</p>
          </div>
          <div className="mb-4 font-mono text-xs uppercase tracking-[0.16em] text-faint">Languages</div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">{LANGS.map(([label, icon], i) => (<TechTile key={label} label={label} icon={icon} index={i} />))}</div>
          <div className="mt-10 mb-4 font-mono text-xs uppercase tracking-[0.16em] text-faint">Frameworks, data &amp; infra</div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">{TOOLS.map(([label, icon], i) => (<TechTile key={label} label={label} icon={icon} index={i} />))}</div>
        </section>

        {/* WORK */}
        <section id="work" className="mx-auto max-w-5xl px-6 py-20 md:py-28 border-t border-line">
          <div className="reveal mb-14 max-w-2xl">
            <Kicker index="03">Selected work</Kicker>
            <h2 className="font-display text-4xl md:text-6xl leading-[1.02]">
              <Line delay={60}>Things I built</Line>
              <Line delay={150}>from scratch.</Line>
            </h2>
            <p className="mt-4 text-dim text-lg">Infrastructure, not wrappers — a database engine, an in-memory store, a search engine, and an LLM evaluation harness.</p>
          </div>
          <div className="border-t border-line">
            {PROJECTS.map((p, i) => (
              <a key={p.n} href={p.link} target="_blank" rel="noopener noreferrer" style={{ '--i': i }} className="row-link spot reveal group grid md:grid-cols-[3rem_1fr_auto] gap-x-8 gap-y-3 py-9 border-b border-line items-start hover:bg-surface/70 transition-colors duration-300 -mx-4 px-4 rounded-xl">
                <div className="font-mono text-sm text-faint pt-2">{p.n}</div>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-3xl md:text-4xl leading-none group-hover:text-accent transition-colors duration-300">{p.title}</h3>
                    {p.anchor && <span className="rounded-full border border-accent/40 text-accent text-xs font-medium px-2.5 py-1">Anchor project</span>}
                  </div>
                  <div className="mt-2 text-sm text-dim">{p.tag}</div>
                  <p className="mt-4 text-dim max-w-2xl leading-relaxed">{p.desc}</p>
                  <div className="mt-5 flex flex-wrap gap-2">{p.stack.map((s) => (<span key={s} className="font-mono text-xs rounded-md border border-line px-2.5 py-1 text-faint">{s}</span>))}</div>
                </div>
                <div className="hidden md:flex items-center gap-1.5 text-sm text-faint group-hover:text-accent transition-colors duration-300 pt-2 whitespace-nowrap">{p.linkLabel} <Arrow className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" /></div>
              </a>
            ))}
          </div>
        </section>

        {/* RESEARCH */}
        <section id="research" className="mx-auto max-w-5xl px-6 py-20 md:py-28 border-t border-line">
          <div className="reveal mb-12 max-w-2xl">
            <Kicker index="04">Research &amp; publications</Kicker>
            <h2 className="font-display text-4xl md:text-6xl leading-[1.02]">
              <Line delay={60}>Two papers,</Line>
              <Line delay={150}>one lens.</Line>
            </h2>
            <p className="mt-4 text-dim text-lg">Model robustness and evaluation — the through-line connecting my research and my engineering.</p>
          </div>
          <div className="space-y-4">
            {RESEARCH.map((r, i) => (
              <article key={r.n} style={{ '--i': i }} className="spot reveal rounded-2xl border border-line bg-surface p-7 md:p-8 hover:border-line2 transition-colors duration-300">
                <div className="grid md:grid-cols-[auto_1fr] gap-5">
                  <div className="font-display text-4xl text-accent leading-none">{r.n}</div>
                  <div>
                    <h3 className="text-xl leading-snug text-fg">{r.title}</h3>
                    <div className="mt-2 text-sm font-semibold text-accent">{r.venue}</div>
                    <div className="text-sm text-faint">{r.meta}</div>
                    <p className="mt-3 text-dim leading-relaxed">{r.desc}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* EXPERIENCE + SKILLS */}
        <section id="experience" className="mx-auto max-w-5xl px-6 py-20 md:py-28 border-t border-line">
          <div className="reveal mb-12">
            <Kicker index="05">Experience</Kicker>
            <h2 className="font-display text-4xl md:text-6xl leading-[1.02]"><Line delay={60}>Where I’ve shipped.</Line></h2>
          </div>
          <div className="spot reveal rounded-2xl border border-line p-7 md:p-9 hover:border-line2 transition-colors duration-300">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-2xl md:text-3xl">Web Development Intern</h3>
              <span className="font-mono text-sm text-faint">May 2024 – June 2024</span>
            </div>
            <div className="mt-1 text-accent font-medium">Teachnook × Rhyno EV</div>
            <ul className="mt-6 space-y-3 text-dim">
              {['Optimised backend-driven ETL pipelines handling real-time API responses, reducing end-to-end latency by 25%.', 'Refactored React rendering and data-flow logic for a 30% performance improvement across key interactions.', 'Standardised handling of structured and semi-structured data, cutting runtime inconsistencies.'].map((li, i) => (
                <li key={i} className="flex gap-3"><span className="mt-2.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" /><span>{li}</span></li>
              ))}
            </ul>
          </div>

          <div className="reveal mt-16 mb-8">
            <Kicker index="06">Toolkit</Kicker>
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
                <a href="https://github.com/Rishicreates20" target="_blank" rel="noopener noreferrer" className="press inline-flex items-center gap-2 rounded-full border border-line2 px-6 py-3.5 text-sm font-medium hover:bg-surface">GitHub <Arrow /></a>
              </Magnetic>
              <Magnetic>
                <a href="https://linkedin.com/in/rishikeshsarangi" target="_blank" rel="noopener noreferrer" className="press inline-flex items-center gap-2 rounded-full border border-line2 px-6 py-3.5 text-sm font-medium hover:bg-surface">LinkedIn <Arrow /></a>
              </Magnetic>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line relative z-10">
        <div className="mx-auto max-w-5xl px-6 py-8 flex flex-wrap items-center justify-between gap-4 text-sm text-faint">
          <div className="flex items-center gap-3"><Mark className="h-4 w-4" /> © {year} Rishikesh Sarangi · Bengaluru, India</div>
          <div className="flex gap-5">
            <a className="hover:text-fg transition-colors duration-300" href="https://github.com/Rishicreates20" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a className="hover:text-fg transition-colors duration-300" href="https://linkedin.com/in/rishikeshsarangi" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a className="hover:text-fg transition-colors duration-300" href="https://leetcode.com/rishicreates26" target="_blank" rel="noopener noreferrer">LeetCode</a>
            <a className="hover:text-fg transition-colors duration-300" href="mailto:rishikeshsarangi56@gmail.com">Email</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
