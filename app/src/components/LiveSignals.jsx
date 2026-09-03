import { useCallback, useEffect, useRef, useState } from 'react'

/* Public handles. HackerRank has no CORS-open API, so it stays a linked tile. */
const GITHUB_USER = 'Rishicreates20'
const LEETCODE_USER = 'rishicreates26'
const HACKERRANK_USER = null // set your handle here to light up the HackerRank tile

const CACHE_TTL = 15 * 60 * 1000

/* Two independent community mirrors — the second covers the first going down. */
const LEETCODE_MIRRORS = [
  (u) => `https://leetcode-api-faisalshohag.vercel.app/${u}`,
  (u) => `https://alfa-leetcode-api.onrender.com/${u}/solved`,
]

function readCache(key) {
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return null
    const { at, data } = JSON.parse(raw)
    return Date.now() - at < CACHE_TTL ? data : null
  } catch {
    return null
  }
}

function writeCache(key, data) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), data }))
  } catch {
    /* private mode or blocked storage — the fetch still works, just uncached */
  }
}

async function getJSON(url, signal) {
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

/* Both mirrors return different shapes for the same numbers. */
function normaliseLeetCode(raw) {
  const solved = raw.totalSolved ?? raw.solvedProblem
  if (typeof solved !== 'number') throw new Error('unexpected payload')
  const buckets = raw.totalSubmissions ?? raw.totalSubmissionNum ?? []
  const all = buckets.find((b) => b.difficulty === 'All')
  return {
    solved,
    easy: raw.easySolved ?? 0,
    medium: raw.mediumSolved ?? 0,
    hard: raw.hardSolved ?? 0,
    submissions: all?.submissions ?? null,
    ranking: raw.ranking ?? null,
  }
}

async function fetchLeetCode(signal) {
  const cached = readCache('lc')
  if (cached) return cached
  let lastError
  for (const build of LEETCODE_MIRRORS) {
    try {
      const data = normaliseLeetCode(await getJSON(build(LEETCODE_USER), signal))
      writeCache('lc', data)
      return data
    } catch (err) {
      if (signal.aborted) throw err
      lastError = err
    }
  }
  throw lastError ?? new Error('all mirrors unreachable')
}

async function fetchGitHub(signal) {
  const cached = readCache('gh')
  if (cached) return cached
  const [user, repos] = await Promise.all([
    getJSON(`https://api.github.com/users/${GITHUB_USER}`, signal),
    getJSON(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`, signal),
  ])
  const own = repos.filter((r) => !r.fork)
  const languages = {}
  own.forEach((r) => { if (r.language) languages[r.language] = (languages[r.language] || 0) + 1 })
  const data = {
    repos: user.public_repos,
    since: new Date(user.created_at).getFullYear(),
    languages: Object.entries(languages).sort((a, b) => b[1] - a[1]).slice(0, 6),
    recent: own.slice(0, 5).map((r) => ({
      name: r.name,
      description: r.description,
      language: r.language,
      url: r.html_url,
      pushed: r.pushed_at,
    })),
  }
  writeCache('gh', data)
  return data
}

/* ---------------- states ---------------- */
function Skeleton({ className = '' }) {
  return <span className={`shimmer block rounded-md bg-white/[0.06] ${className}`} />
}

function Failed({ label, onRetry }) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <span className="text-faint">{label} is not responding right now.</span>
      <button onClick={onRetry} className="press rounded-lg border border-line2 px-3 py-1.5 text-xs font-medium text-dim hover:text-fg hover:bg-surface">
        Try again
      </button>
    </div>
  )
}

/* Difficulty split as a single stacked rail rather than three separate meters. */
function DifficultyRail({ easy, medium, hard }) {
  const total = Math.max(1, easy + medium + hard)
  const bands = [
    ['Easy', easy, 'bg-emerald-400/80'],
    ['Medium', medium, 'bg-accent'],
    ['Hard', hard, 'bg-rose-400/80'],
  ]
  return (
    <div>
      <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
        {bands.map(([name, value, tone]) => (
          <span
            key={name}
            className={`rail-band h-full ${tone}`}
            style={{ width: `${(value / total) * 100}%` }}
          />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5">
        {bands.map(([name, value, tone]) => (
          <span key={name} className="inline-flex items-center gap-2 text-xs text-faint">
            <span className={`h-1.5 w-1.5 rounded-full ${tone}`} />
            {name} <span className="font-mono text-dim">{value}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function relative(iso) {
  const days = Math.floor((Date.now() - new Date(iso)) / 86400000)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return months < 12 ? `${months}mo ago` : `${Math.floor(months / 12)}y ago`
}

/* ---------------- panel ---------------- */
export default function LiveSignals() {
  const [leet, setLeet] = useState({ state: 'loading' })
  const [git, setGit] = useState({ state: 'loading' })
  const [nonce, setNonce] = useState(0)
  const wrapRef = useRef(null)

  const retry = useCallback(() => {
    try { sessionStorage.removeItem('lc'); sessionStorage.removeItem('gh') } catch { /* ignore */ }
    setLeet({ state: 'loading' })
    setGit({ state: 'loading' })
    setNonce((n) => n + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    fetchLeetCode(signal)
      .then((data) => { if (!signal.aborted) setLeet({ state: 'ready', data }) })
      .catch(() => { if (!signal.aborted) setLeet({ state: 'error' }) })

    fetchGitHub(signal)
      .then((data) => { if (!signal.aborted) setGit({ state: 'ready', data }) })
      .catch(() => { if (!signal.aborted) setGit({ state: 'error' }) })

    return () => controller.abort()
  }, [nonce])

  return (
    <div ref={wrapRef}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-7">
        <div className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.16em] text-faint">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Live signals
        </div>
        <span className="text-xs text-faint">Pulled from public APIs on page load</span>
      </div>

      <div className="grid gap-px bg-line lg:grid-cols-[1.35fr_1fr] rounded-2xl overflow-hidden border border-line">
        {/* LeetCode */}
        <div className="spot bg-base p-7 md:p-8">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-sm font-semibold text-fg">LeetCode</h3>
            <a href={`https://leetcode.com/${LEETCODE_USER}`} target="_blank" rel="noopener noreferrer" className="text-xs text-faint hover:text-accent transition-colors duration-300">
              @{LEETCODE_USER}
            </a>
          </div>

          {leet.state === 'loading' && (
            <div className="mt-6 space-y-4">
              <Skeleton className="h-14 w-40" />
              <Skeleton className="h-1.5 w-full" />
              <Skeleton className="h-4 w-56" />
            </div>
          )}

          {leet.state === 'error' && (
            <div className="mt-6"><Failed label="The LeetCode mirror" onRetry={retry} /></div>
          )}

          {leet.state === 'ready' && (
            <>
              <div className="mt-5 flex flex-wrap items-baseline gap-x-8 gap-y-3">
                <div>
                  <div className="font-display text-5xl md:text-6xl leading-none tabular-nums">{leet.data.solved}</div>
                  <div className="mt-1.5 text-sm text-dim">problems solved</div>
                </div>
                {leet.data.submissions != null && (
                  <div>
                    <div className="font-display text-4xl leading-none tabular-nums text-dim">{leet.data.submissions}</div>
                    <div className="mt-1.5 text-sm text-faint">total submissions</div>
                  </div>
                )}
              </div>
              <div className="mt-7">
                <DifficultyRail easy={leet.data.easy} medium={leet.data.medium} hard={leet.data.hard} />
              </div>
              {leet.data.ranking != null && (
                <div className="mt-6 font-mono text-xs text-faint">
                  Global rank <span className="text-dim">#{leet.data.ranking.toLocaleString()}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* GitHub + HackerRank */}
        <div className="bg-base divide-y divide-line">
          <div className="spot p-7 md:p-8">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-sm font-semibold text-fg">GitHub</h3>
              <a href={`https://github.com/${GITHUB_USER}`} target="_blank" rel="noopener noreferrer" className="text-xs text-faint hover:text-accent transition-colors duration-300">
                @{GITHUB_USER}
              </a>
            </div>

            {git.state === 'loading' && (
              <div className="mt-6 space-y-4">
                <Skeleton className="h-12 w-24" />
                <Skeleton className="h-4 w-full" />
              </div>
            )}

            {git.state === 'error' && (
              <div className="mt-6"><Failed label="The GitHub API" onRetry={retry} /></div>
            )}

            {git.state === 'ready' && (
              <>
                <div className="mt-5 flex items-baseline gap-3">
                  <span className="font-display text-5xl leading-none tabular-nums">{git.data.repos}</span>
                  <span className="text-sm text-dim">public repositories</span>
                </div>
                <div className="mt-2 text-xs text-faint">Building in the open since {git.data.since}</div>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {git.data.languages.map(([lang, count]) => (
                    <span key={lang} className="font-mono text-[0.7rem] rounded-md border border-line px-2 py-1 text-faint">
                      {lang} <span className="text-dim">{count}</span>
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="p-7 md:p-8">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-sm font-semibold text-fg">HackerRank</h3>
              {HACKERRANK_USER && (
                <a href={`https://www.hackerrank.com/profile/${HACKERRANK_USER}`} target="_blank" rel="noopener noreferrer" className="text-xs text-faint hover:text-accent transition-colors duration-300">
                  @{HACKERRANK_USER}
                </a>
              )}
            </div>
            <p className="mt-4 text-sm text-faint leading-relaxed">
              {HACKERRANK_USER
                ? 'Profile linked — HackerRank publishes no CORS-open API, so badges are verified on the profile itself.'
                : 'Handle not wired up yet. HackerRank exposes no CORS-open API, so this tile links out rather than inventing a number.'}
            </p>
          </div>
        </div>
      </div>

      {/* recently pushed */}
      <div className="mt-8">
        <div className="mb-4 font-mono text-xs uppercase tracking-[0.16em] text-faint">Recently pushed</div>
        {git.state === 'loading' && (
          <div className="space-y-px">
            {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        )}
        {git.state === 'error' && <p className="text-sm text-faint">Repository feed unavailable.</p>}
        {git.state === 'ready' && (
          git.data.recent.length === 0 ? (
            <p className="text-sm text-faint">No public repositories pushed yet.</p>
          ) : (
            <div className="divide-y divide-line border-y border-line">
              {git.data.recent.map((repo) => (
                <a
                  key={repo.name}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-wrap items-baseline gap-x-4 gap-y-1 py-4 hover:bg-surface/70 transition-colors duration-300 -mx-4 px-4"
                >
                  <span className="font-mono text-sm text-fg group-hover:text-accent transition-colors duration-300">{repo.name}</span>
                  {repo.language && <span className="text-xs text-faint">{repo.language}</span>}
                  {repo.description && <span className="text-sm text-dim grow basis-full sm:basis-auto">{repo.description}</span>}
                  <span className="ml-auto font-mono text-xs text-faint whitespace-nowrap">{relative(repo.pushed)}</span>
                </a>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}
