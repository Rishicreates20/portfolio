import { useEffect, useRef } from 'react'

/*
  Animated 3D project icons built from plain DOM planes and CSS 3D transforms.
  No WebGL, no runtime library: each icon is a handful of divs, animated on
  `transform` only, paused while off-screen, and frozen in a static pose when
  the visitor prefers reduced motion.
*/

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const finePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches

/* ---------- glyphs (24px line icons) ---------- */
const GLYPHS = {
  book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" /><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5" /><path d="M9 8h7M9 11.5h5" /></>,
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
  bell: <><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8" /><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  shield: <><path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z" /><path d="m9 12 2 2 4-4" /></>,
  compass: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5z" /></>,
  wave: <path d="M2 12h2l2-6 3 12 3-15 3 15 3-9 2 3h2" />,
  db: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></>,
  chip: <><rect x="6" y="6" width="12" height="12" rx="1.5" /><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" /></>,
  cell: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3.5" /></>,
}

export function Glyph({ name, className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {GLYPHS[name]}
    </svg>
  )
}

/* ---------- primitives ---------- */
const plane = (w, h, transform, extra = {}) => ({
  width: w, height: h, marginLeft: -w / 2, marginTop: -h / 2, transform, ...extra,
})

function Box({ w, h, d, front, frontClass = '', style }) {
  return (
    <div className="p3d-group" style={style}>
      <div className={`p3d-face p3d-front ${frontClass}`} style={plane(w, h, `translateZ(${d / 2}px)`)}>{front}</div>
      <div className="p3d-face p3d-back" style={plane(w, h, `rotateY(180deg) translateZ(${d / 2}px)`)}>{front}</div>
      <div className="p3d-face p3d-side" style={plane(d, h, `rotateY(90deg) translateZ(${w / 2}px)`)} />
      <div className="p3d-face p3d-side" style={plane(d, h, `rotateY(-90deg) translateZ(${w / 2}px)`)} />
      <div className="p3d-face p3d-top" style={plane(w, d, `rotateX(90deg) translateZ(${h / 2}px)`)} />
      <div className="p3d-face p3d-side" style={plane(w, d, `rotateX(-90deg) translateZ(${h / 2}px)`)} />
    </div>
  )
}

/* ---------- variants ---------- */
function Cube({ glyph }) {
  const g = <Glyph name={glyph} className="h-8 w-8" />
  return <Box w={66} h={66} d={66} front={g} />
}

function Stack({ glyph, shape = 'disc' }) {
  const layers = [0, 1, 2, 3]
  const size = shape === 'disc' ? 92 : 84
  return (
    <div className="p3d-group">
      <div className="p3d-axis" style={plane(2, 96, 'none')} />
      {layers.map((i) => (
        <div key={i} className="p3d-group" style={{ transform: `translateY(${(i - 1.5) * 22}px)` }}>
          <div className={`p3d-group ${i < 2 ? 'p3d-bob-up' : 'p3d-bob-down'}`} style={{ animationDelay: `${i * -0.35}s` }}>
          <div
            className={`p3d-face p3d-slab ${shape === 'disc' ? 'rounded-full' : 'rounded-[14px]'} ${i === 0 ? 'p3d-slab-top' : ''}`}
            style={plane(size, size, 'rotateX(90deg)')}
          >
            {i === 0 && <Glyph name={glyph} className="h-7 w-7" />}
          </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function Orbit({ glyph }) {
  const rings = [
    'rotateX(72deg)',
    'rotateY(60deg) rotateX(72deg)',
    'rotateY(-60deg) rotateX(72deg)',
  ]
  return (
    <div className="p3d-group">
      {rings.map((t, i) => (
        <div key={i} className="p3d-group" style={{ transform: t }}>
          <div className="p3d-ring p3d-ring-spin" style={{ ...plane(116, 116, 'none'), animationDuration: `${7 + i * 2.5}s`, animationDirection: i % 2 ? 'reverse' : 'normal' }}>
            <span className="p3d-sat" />
          </div>
        </div>
      ))}
      <div className="p3d-billboard" style={plane(46, 46, 'none')}>
        <div className="p3d-core"><Glyph name={glyph} className="h-5 w-5" /></div>
      </div>
    </div>
  )
}

function Sphere({ glyph }) {
  const meridians = [0, 30, 60, 90, 120, 150]
  return (
    <div className="p3d-group">
      {meridians.map((a) => (
        <div key={a} className="p3d-ring p3d-ring-soft" style={plane(96, 96, `rotateY(${a}deg)`)} />
      ))}
      <div className="p3d-ring p3d-ring-soft" style={plane(96, 96, 'rotateX(90deg)')} />
      <div className="p3d-ring p3d-ring-soft" style={plane(66, 66, 'rotateX(90deg) translateZ(34px)')} />
      <div className="p3d-ring p3d-ring-soft" style={plane(66, 66, 'rotateX(90deg) translateZ(-34px)')} />
      <div className="p3d-billboard" style={plane(34, 34, 'none')}>
        <div className="p3d-core p3d-core-sm"><Glyph name={glyph} className="h-4 w-4" /></div>
      </div>
    </div>
  )
}

function Pyramid({ glyph }) {
  const s = 84
  const H = 72
  const L = Math.hypot(H, s / 2)
  const tilt = (Math.atan(s / 2 / H) * 180) / Math.PI
  return (
    <div className="p3d-group">
      {[0, 1, 2, 3].map((k) => (
        <div
          key={k}
          className={`p3d-face p3d-tri ${k % 2 ? 'p3d-tri-dim' : ''}`}
          style={plane(s, L, `rotateY(${k * 90}deg) translateZ(${s / 4}px) rotateX(${tilt}deg)`)}
        />
      ))}
      <div className="p3d-face p3d-side" style={plane(s, s, `rotateX(-90deg) translateZ(${H / 2}px)`)} />
      <div className="p3d-billboard" style={plane(30, 30, `translateY(10px)`)}>
        <div className="p3d-core p3d-core-sm"><Glyph name={glyph} className="h-4 w-4" /></div>
      </div>
    </div>
  )
}

function Bars() {
  const n = 9
  return (
    <div className="p3d-group">
      <div className="p3d-face p3d-floor" style={plane(124, 44, 'translateY(34px) rotateX(90deg)')} />
      {Array.from({ length: n }, (_, i) => (
        <div key={i} className="p3d-group" style={{ transform: `translateX(${(i - (n - 1) / 2) * 13}px) translateY(34px)` }}>
          <div className="p3d-group p3d-bar" style={{ animationDelay: `${i * -0.17}s` }}>
            <Box w={8} h={64} d={8} style={{ transform: 'translateY(-32px)' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function Phone({ glyph }) {
  const screen = (
    <div className="p3d-screen">
      <span className="p3d-notch" />
      <Glyph name={glyph} className="h-6 w-6" />
      <span className="p3d-xp"><span /></span>
    </div>
  )
  return <Box w={56} h={100} d={9} front={screen} frontClass="p3d-phone" />
}

function Chip({ glyph }) {
  const front = (
    <div className="p3d-die"><Glyph name={glyph} className="h-7 w-7" /></div>
  )
  return (
    <div className="p3d-group">
      <div className="p3d-face p3d-pins" style={plane(100, 100, 'translateZ(-4px)')} />
      <Box w={76} h={76} d={10} front={front} />
    </div>
  )
}

const VARIANTS = {
  cube: { C: Cube, motion: 'spin' },
  stack: { C: Stack, motion: 'spin' },
  orbit: { C: Orbit, motion: 'spin' },
  sphere: { C: Sphere, motion: 'spin' },
  pyramid: { C: Pyramid, motion: 'spin' },
  bars: { C: Bars, motion: 'sway' },
  phone: { C: Phone, motion: 'sway' },
  chip: { C: Chip, motion: 'sway' },
}

/*
  <Project3D variant="cube" hue={350} glyph="bolt" />
  `hue` drives the whole palette through --h, so every icon shares one material.
*/
export default function Project3D({ variant = 'cube', hue = 36, glyph = 'bolt', shape, tilt = -22, speed = 14, size = 'md' }) {
  const ref = useRef(null)
  const { C, motion } = VARIANTS[variant] ?? VARIANTS.cube

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReduced() || !('IntersectionObserver' in window)) {
      el.classList.add('is-still')
      return
    }
    const io = new IntersectionObserver(
      ([e]) => el.classList.toggle('is-live', e.isIntersecting),
      { rootMargin: '80px' }
    )
    io.observe(el)

    if (!finePointer()) return () => io.disconnect()
    const card = el.closest('[data-tilt]') || el
    let raf = 0
    const onMove = (e) => {
      const r = card.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--px', `${(x * 26).toFixed(1)}deg`)
        el.style.setProperty('--py', `${(-y * 20).toFixed(1)}deg`)
      })
    }
    const onLeave = () => {
      cancelAnimationFrame(raf)
      el.style.setProperty('--px', '0deg')
      el.style.setProperty('--py', '0deg')
    }
    card.addEventListener('pointermove', onMove, { passive: true })
    card.addEventListener('pointerleave', onLeave)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      card.removeEventListener('pointermove', onMove)
      card.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div
      ref={ref}
      className={`p3d p3d-${size}`}
      style={{ '--h': hue, '--bx': `${tilt}deg`, '--spd': `${speed}s` }}
      aria-hidden="true"
    >
      <div className="p3d-shadow" />
      <div className="p3d-tilt">
        <div className="p3d-float">
          <div className="p3d-motion">
            <div className={`p3d-group p3d-${motion}`}>
              <C glyph={glyph} shape={shape} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
