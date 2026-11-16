import { useEffect } from 'react'
import Project3D from './Project3D'

/*
  Long-form write-ups for the projects with the most to show.
  Every fact here comes from the master profile; nothing is estimated.
*/
export const CASE_STUDIES = {
  studypilot: {
    title: 'StudyPilot',
    kicker: 'Case study · AI learning platform',
    lede: 'A learning platform that turns a goal into a study plan: notes, quizzes, a roadmap and resource links for every topic, with progress tracked over time.',
    icon: { variant: 'stack', shape: 'square', glyph: 'book', hue: 36 },
    facts: [['Back end', 'Python · FastAPI'], ['Data', 'PostgreSQL · pgvector'], ['Tests', '1,700+ in CI'], ['Status', 'Live demo']],
    links: [['Live demo', 'https://studypilotpatch122.vercel.app'], ['Source', 'https://github.com/Rishicreates20/StudyPilot']],
    sections: [
      { h: 'What it does', p: [
        'You create a learning goal with a level (Beginner or Intermediate), a category (Professional Skill, Career Pivot or Hobby), minutes per day and a target date. For each topic, StudyPilot generates notes, quizzes, a roadmap and resource links.',
        'Goals can be active, paused, completed or archived. The dashboard shows curriculum progress and study time logged, with Analytics, Lectures and Status pages.',
      ] },
      { h: 'How it is built', list: [
        'Python back end with explicit SQL on PostgreSQL and a documented REST API (OpenAPI).',
        'A durable job queue with leases, retries, idempotency keys and crash recovery, so generation work survives restarts and is never applied twice.',
        'Every request runs as the signed-in user under Row Level Security, so the database itself enforces who can read what.',
        'Retrieval-augmented answers use pgvector.',
        'The live demo uses Firebase Google sign-in and test accounts, with study goals synced to Firestore.',
      ] },
      { h: 'How it was tested', list: [
        '1,700+ automated tests (pytest, Vitest, Playwright) run in GitHub Actions on every change.',
        'Ran three topics end to end (Kubernetes and cloud architecture, deep learning with PyTorch, Rust systems programming) and checked that each produced notes, quizzes, a roadmap and links, and that progress and goal status showed correctly.',
      ] },
      { h: 'Three bugs worth telling', list: [
        'The Gemini adapter, written from the docs, got a 400 on its first live call. Bisecting the request fields isolated the problem; the fix kept responseMimeType with responseJsonSchema, dropped maxItems from the schema, and let Pydantic enforce the limits instead. A live smoke test then passed on three models.',
        'The sign-up confirmation link arrived as /?code= and left users signed out. Fixed the callback handling and added 21 tests around it.',
        'CI failed while everything passed locally: the CI Postgres service had no pgvector extension, which the local setup had hidden. Traced it from the logs and fixed the pipeline.',
      ] },
      { h: 'Tools', p: [
        'Built with an AI coding agent as a pair, used for the API key integration and for chasing down bugs in deployment and authentication. Each fix above was verified with tests or a live run.',
      ] },
    ],
  },

  waves: {
    title: 'Waves QA',
    kicker: 'Case study · API testing',
    lede: 'An API test harness for the smallest.ai Waves text-to-speech API, built for their hiring trial. It measures latency across three transports, logs every request so it can be traced, and ships a repro script for every finding.',
    icon: { variant: 'bars', glyph: 'wave', hue: 186, tilt: -14 },
    facts: [['Language', 'Python'], ['Requests / run', '~170'], ['Findings', '6 (3 Medium, 3 Low)'], ['5xx errors', '0']],
    links: [['Source', 'https://github.com/Rishicreates20/Waves_QA']],
    sections: [
      { h: 'The setup', list: [
        'A Python harness (requests + websockets, about 1,400 lines) plus a repro.py per finding and a check of the official Node SDK.',
        'About 170 requests per run across sync REST /tts, SSE /tts/live and WebSocket /tts/live.',
        'Every request carries a session_id and request_id and is logged to JSONL with UTC timestamps and the server X-Request-Id. The API key comes from an environment variable and is redacted in logs.',
      ] },
      { h: 'Latency', table: {
        head: ['Path', 'p50', 'p95'],
        rows: [['WebSocket, first audio', '160 ms', '195 ms'], ['SSE, first audio (run 1)', '187 ms', '205 ms'], ['Sync REST, short text', '624 ms', '710 ms']],
      }, p: ['Zero 5xx responses, and a 10-request concurrent burst all succeeded.'] },
      { h: 'Findings', list: [
        'The WebSocket idle timeout drops the TCP connection without a Close frame (code 1006).',
        'Deleted or unknown pronunciation-dictionary IDs return 200 and are silently ignored.',
        'Odia voice accent issue, and a model limit.',
        'Validation and error bodies differ from the API reference (28 cases).',
        '?timeout=0 closes the connection immediately.',
        'The official Node SDK (smallestai 1.0.1) quickstart fails with 410 MODEL_DEPRECATED.',
      ], p: ['A second run reproduced findings 1, 2, 4 and 5 exactly.'] },
      { h: 'Beyond the happy path', p: [
        'Also tested how ₹ amounts and lakh are read aloud, and Hindi, Hinglish and Odia scripts: audio checked by ear, with MFCC and DTW used to compare audio for the dictionary check.',
      ] },
    ],
  },

  safesteel: {
    title: 'SafeSteel AI',
    kicker: 'Case study · LLM evaluation',
    lede: 'An evaluation and red-teaming framework for LLMs: a bank of adversarial prompts, automatic scoring, and run-to-run tracking, so a change to the model or the prompt is judged by numbers.',
    icon: { variant: 'pyramid', glyph: 'shield', hue: 22, tilt: -14 },
    facts: [['Prompts', '500+'], ['Failure categories', '6'], ['Scoring', 'DeepEval'], ['Result', '61% fewer violations']],
    links: [],
    sections: [
      { h: 'The approach', list: [
        '500+ adversarial prompts spread across 6 failure categories.',
        'Each response scored automatically with DeepEval.',
        'Runs tracked in LangSmith, so results can be compared run to run.',
      ] },
      { h: 'The result', p: [
        'Measured run to run, the violation rate fell 61%.',
      ] },
      { h: 'Why it matters to me', p: [
        'It is the engineering side of my research. My IEEE CCICT 2025 paper is about stress-testing medical imaging models with image reconstruction, and SafeSteel applies the same idea to language models: break the system on purpose, measure it, and only trust the number.',
      ] },
    ],
  },
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function CaseStudy({ id }) {
  const cs = CASE_STUDIES[id]
  useEffect(() => {
    const prev = document.title
    if (cs) document.title = `${cs.title} case study · Rishikesh Sarangi`
    window.scrollTo(0, 0)
    return () => { document.title = prev }
  }, [id, cs])

  if (!cs) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-28 text-center">
        <h1 className="font-display text-5xl">Case study not found</h1>
        <a href="#work" className="mt-8 inline-flex text-accent">Back to all work</a>
      </section>
    )
  }

  const others = Object.entries(CASE_STUDIES).filter(([k]) => k !== id)

  return (
    <article className="mx-auto max-w-3xl px-6 pt-10 pb-24 md:pt-16" style={{ '--h': cs.icon.hue }}>
      <a href="#work" className="inline-flex items-center gap-2 text-sm text-dim hover:text-accent transition-colors duration-300">
        <span aria-hidden="true">←</span> All work
      </a>

      <header className="mt-8 grid md:grid-cols-[1fr_220px] gap-8 items-center">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.18em] proj-hue">{cs.kicker}</div>
          <h1 className="mt-3 font-display text-5xl md:text-7xl leading-[0.95]">{cs.title}</h1>
          <p className="mt-5 text-lg text-dim leading-relaxed">{cs.lede}</p>
          {cs.links.length > 0 && (
            <div className="mt-7 flex flex-wrap gap-2">
              {cs.links.map(([label, href], i) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className={`press inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold ${i === 0 ? 'bg-accent text-base hover:bg-accent2' : 'border border-line2 text-dim hover:text-fg hover:bg-surface'}`}>
                  {label} <Arrow />
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="proj-stage relative h-56 rounded-2xl border border-line">
          <Project3D {...cs.icon} />
        </div>
      </header>

      <dl className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-line bg-line">
        {cs.facts.map(([k, v]) => (
          <div key={k} className="bg-base p-4">
            <dt className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-faint">{k}</dt>
            <dd className="mt-1.5 text-fg">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-14 space-y-12">
        {cs.sections.map((s) => (
          <section key={s.h}>
            <h2 className="font-display text-3xl md:text-4xl leading-tight">{s.h}</h2>
            {s.table && (
              <div className="mt-5 overflow-x-auto rounded-xl border border-line">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface text-faint font-mono text-[0.7rem] uppercase tracking-[0.12em]">
                    <tr>{s.table.head.map((h) => <th key={h} className="px-4 py-3 font-normal">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {s.table.rows.map((r) => (
                      <tr key={r[0]}>{r.map((c, j) => <td key={j} className={`px-4 py-3 ${j ? 'font-mono proj-hue' : 'text-fg'}`}>{c}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {s.list && (
              <ol className="mt-5 space-y-3 text-dim leading-relaxed">
                {s.list.map((li, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="font-mono text-xs proj-hue pt-1 w-5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    <span>{li}</span>
                  </li>
                ))}
              </ol>
            )}
            {s.p && s.p.map((t) => <p key={t} className="mt-4 text-dim leading-relaxed">{t}</p>)}
          </section>
        ))}
      </div>

      <nav className="mt-20 border-t border-line pt-8" aria-label="More case studies">
        <div className="font-mono text-xs uppercase tracking-[0.16em] text-faint">More case studies</div>
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          {others.map(([k, o]) => (
            <a key={k} href={`#/work/${k}`} className="spot tile rounded-xl border border-line p-5 hover:border-line2">
              <div className="text-fg font-medium">{o.title}</div>
              <div className="mt-1 text-sm text-dim">{o.kicker.replace('Case study · ', '')}</div>
            </a>
          ))}
        </div>
      </nav>
    </article>
  )
}
