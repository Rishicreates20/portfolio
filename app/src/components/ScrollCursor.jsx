import { useEffect, useRef } from 'react'

const RADIUS = 21
const CIRC = 2 * Math.PI * RADIUS
const lerp = (a, b, t) => a + (b - a) * t
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)

/**
 * Pointer companion that doubles as a scroll gauge: the ring stretches along the
 * scroll axis with velocity, a progress arc fills as the page advances, and a
 * chevron flips to match direction. Native cursor stays visible.
 */
export default function ScrollCursor() {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ring = root.querySelector('[data-ring]')
    const gauge = root.querySelector('[data-gauge]')
    const arc = root.querySelector('[data-arc]')
    const chevron = root.querySelector('[data-chevron]')
    const dot = root.querySelector('[data-dot]')

    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight / 2
    let x = targetX
    let y = targetY
    let live = false

    let lastScroll = window.scrollY
    let velocity = 0
    let activity = 0
    let hover = 0
    let hoverTarget = 0
    let press = 0
    let pressTarget = 0
    let raf = 0

    const onMove = (e) => {
      targetX = e.clientX
      targetY = e.clientY
      if (!live) {
        live = true
        x = targetX
        y = targetY
        root.classList.add('is-live')
      }
    }
    const onOver = (e) => {
      const el = e.target instanceof Element ? e.target.closest('a, button, [data-cursor]') : null
      hoverTarget = el ? 1 : 0
    }
    const onDown = () => { pressTarget = 1 }
    const onUp = () => { pressTarget = 0 }
    const onLeave = () => { live = false; root.classList.remove('is-live') }

    const frame = () => {
      raf = requestAnimationFrame(frame)

      x = lerp(x, targetX, 0.2)
      y = lerp(y, targetY, 0.2)

      const scrollY = window.scrollY
      velocity = lerp(velocity, scrollY - lastScroll, 0.25)
      lastScroll = scrollY

      const span = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const progress = clamp01(scrollY / span)

      const intensity = clamp01(Math.abs(velocity) / 26)
      activity = lerp(activity, intensity, intensity > activity ? 0.35 : 0.07)
      hover = lerp(hover, hoverTarget, 0.16)
      press = lerp(press, pressTarget, 0.25)

      const scale = 1 + hover * 0.8 - press * 0.16
      const stretch = activity * (1 - hover * 0.65)
      const squashX = scale * (1 - stretch * 0.32)
      const squashY = scale * (1 + stretch * 0.6)

      root.style.transform = `translate3d(${x}px, ${y}px, 0)`
      ring.style.transform = `translate(-50%, -50%) scale(${squashX}, ${squashY})`
      ring.style.opacity = String(0.3 + hover * 0.45 + activity * 0.35)
      gauge.style.transform = `translate(-50%, -50%) rotate(-90deg) scale(${scale})`
      gauge.style.opacity = String(activity)
      arc.style.strokeDashoffset = String(CIRC * (1 - progress))
      chevron.style.opacity = String(activity * (1 - hover))
      chevron.style.transform = `translate(-50%, -50%) scale(${1 - hover}) scaleY(${velocity < 0 ? -1 : 1})`
      dot.style.transform = `translate(-50%, -50%) scale(${clamp01(1 - activity * 0.75 - hover * 0.6)})`
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointerleave', onLeave)
      root.classList.remove('is-live')
    }
  }, [])

  return (
    <div ref={rootRef} className="cursor" aria-hidden="true">
      <span data-ring className="cursor-ring" />
      <svg data-gauge className="cursor-gauge" viewBox="0 0 48 48" width="48" height="48">
        <circle
          data-arc
          cx="24"
          cy="24"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC}
        />
      </svg>
      <svg data-chevron className="cursor-chevron" viewBox="0 0 24 24" width="12" height="12">
        <path d="M5 9l7 7 7-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span data-dot className="cursor-dot" />
    </div>
  )
}
