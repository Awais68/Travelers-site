import { useEffect, useRef, useState } from 'react'

export const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const finePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

/** Adds .is-in to every [data-reveal] inside the page once it enters the viewport. */
export function useRevealAll(dep) {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]:not(.is-in)')
    if (!('IntersectionObserver' in window) || prefersReduced()) {
      els.forEach((el) => el.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) }
      }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [dep])
}

/** True once the element has been on screen. */
export function useInView(opts = { threshold: 0.3 }) {
  const ref = useRef(null)
  const [inView, set] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) return set(true)
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { set(true); io.disconnect() } }, opts)
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, inView]
}

/** Pointer-driven 3D tilt + spotlight. Writes CSS vars only (compositor-friendly). */
export function useTilt(max = 8) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !finePointer() || prefersReduced()) return
    let raf = 0
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--rx', `${(0.5 - y) * max}deg`)
        el.style.setProperty('--ry', `${(x - 0.5) * max}deg`)
        el.style.setProperty('--mx', `${x * 100}%`)
        el.style.setProperty('--my', `${y * 100}%`)
      })
    }
    const leave = () => { cancelAnimationFrame(raf); el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg') }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave) }
  }, [max])
  return ref
}

/** Magnetic pull toward the cursor for primary CTAs (desktop only). */
export function useMagnetic(strength = 0.25) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !finePointer() || prefersReduced()) return
    const move = (e) => {
      const r = el.getBoundingClientRect()
      el.style.transform = `translate3d(${(e.clientX - r.left - r.width / 2) * strength}px, ${(e.clientY - r.top - r.height / 2) * strength}px, 0)`
    }
    const leave = () => { el.style.transform = '' }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave) }
  }, [strength])
  return ref
}

export function useTheme() {
  const [theme, setTheme] = useState('dark')
  useEffect(() => { setTheme(document.documentElement.getAttribute('data-theme') || 'dark') }, [])
  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    const apply = () => {
      document.documentElement.setAttribute('data-theme', next)
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#070D12' : '#F6F1E9')
      try { localStorage.setItem('bt-theme', next) } catch (e) {}
      setTheme(next)
    }
    // Circular reveal via View Transitions where supported
    if (document.startViewTransition && !prefersReduced()) document.startViewTransition(apply)
    else apply()
  }
  return [theme, toggle]
}
