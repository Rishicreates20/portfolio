import { useEffect, useRef, useState } from 'react'

const lerp = (a, b, t) => a + (b - a) * t
const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const finePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches

/* Reveals every `.reveal` node once it enters the viewport. */
export function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal')
    if (prefersReduced() || !('IntersectionObserver' in window)) {
      nodes.forEach((el) => el.classList.add('in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' }
    )
    nodes.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

/* Thin determinate bar pinned under the header. */
export function ScrollProgress() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let queued = false
    const paint = () => {
      queued = false
      const span = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      el.style.transform = `scaleX(${Math.min(1, window.scrollY / span)})`
    }
    const onScroll = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(paint)
    }
    paint()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  return <span ref={ref} className="progress-bar" aria-hidden="true" />
}

/* Reports which section id currently owns the viewport. */
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const seen = new Map()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.intersectionRatio))
        let best = null
        let bestRatio = 0
        seen.forEach((ratio, id) => {
          if (ratio > bestRatio) { bestRatio = ratio; best = id }
        })
        if (best && bestRatio > 0.06) setActive(best)
      },
      { threshold: [0, 0.15, 0.35, 0.6, 0.9] }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [ids.join('|')])
  return active
}

/* Buttons that lean toward the pointer, driven outside React's render cycle. */
export function Magnetic({ children, strength = 0.32, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !finePointer() || prefersReduced()) return
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, rect = null

    const settle = () => {
      cx = lerp(cx, tx, 0.16)
      cy = lerp(cy, ty, 0.16)
      el.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`
      if (Math.abs(cx - tx) > 0.05 || Math.abs(cy - ty) > 0.05) {
        raf = requestAnimationFrame(settle)
      } else {
        raf = 0
      }
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(settle) }
    const onEnter = () => { rect = el.getBoundingClientRect() }
    const onMove = (e) => {
      if (!rect) rect = el.getBoundingClientRect()
      tx = (e.clientX - (rect.left + rect.width / 2)) * strength
      ty = (e.clientY - (rect.top + rect.height / 2)) * strength * 0.7
      kick()
    }
    const onLeave = () => { tx = 0; ty = 0; rect = null; kick() }

    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [strength])

  return (
    <span ref={ref} className={`magnetic ${className}`}>
      {children}
    </span>
  )
}

/* Fluent-style edge highlight: writes pointer coords onto `.spot` descendants. */
export function useSpotlight(ref) {
  useEffect(() => {
    const host = ref.current
    if (!host || !finePointer()) return
    let queued = false
    let pending = null

    const paint = () => {
      queued = false
      if (!pending) return
      const { card, x, y } = pending
      card.style.setProperty('--sx', `${x}px`)
      card.style.setProperty('--sy', `${y}px`)
    }
    const onMove = (e) => {
      const card = e.target instanceof Element ? e.target.closest('.spot') : null
      if (!card) return
      const r = card.getBoundingClientRect()
      pending = { card, x: e.clientX - r.left, y: e.clientY - r.top }
      if (!queued) { queued = true; requestAnimationFrame(paint) }
    }
    host.addEventListener('pointermove', onMove, { passive: true })
    return () => host.removeEventListener('pointermove', onMove)
  }, [ref])
}

/* Counts a numeric label up on first view, keeping padding and suffix intact. */
export function CountUp({ value, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const match = String(value).match(/^(\d+)(.*)$/)
    if (!match || prefersReduced() || !('IntersectionObserver' in window)) {
      el.textContent = String(value)
      return
    }
    const end = Number(match[1])
    const pad = match[1].length
    const suffix = match[2]
    el.textContent = `${'0'.repeat(pad)}${suffix}`

    let raf = 0
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        const start = performance.now()
        const run = (now) => {
          const t = Math.min(1, (now - start) / 1400)
          const eased = 1 - Math.pow(1 - t, 4)
          el.textContent = `${String(Math.round(end * eased)).padStart(pad, '0')}${suffix}`
          if (t < 1) raf = requestAnimationFrame(run)
        }
        raf = requestAnimationFrame(run)
      },
      { threshold: 0.5 }
    )
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [value])

  return <span ref={ref} className={className} />
}

/* Masked line that slides up into place — used for display headings. */
export function Line({ children, delay = 0, className = '' }) {
  return (
    <span className={`line-mask ${className}`}>
      <span className="line-inner" style={{ animationDelay: `${delay}ms` }}>
        {children}
      </span>
    </span>
  )
}

/* Transform-only parallax bound to scroll position. */
export function useParallax(ref, distance = 46) {
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReduced()) return
    let queued = false
    const paint = () => {
      queued = false
      const r = el.getBoundingClientRect()
      const mid = r.top + r.height / 2
      const offset = (mid - window.innerHeight / 2) / window.innerHeight
      el.style.transform = `translate3d(0, ${(-offset * distance).toFixed(2)}px, 0)`
    }
    const onScroll = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(paint)
    }
    paint()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ref, distance])
}
