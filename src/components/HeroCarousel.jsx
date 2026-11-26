import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import { HERO_SLIDES, SITE } from '../data/site.js'
import { asset } from '../lib/asset.js'
import { prefersReduced, useMagnetic } from '../lib/hooks.js'
import { waLink } from './Chrome.jsx'

/*
  HERO — "Split-panel 3D flip"
  ───────────────────────────
  The image is sliced into N vertical panels (6 desktop / 3 mobile). Each panel is a
  two-sided card: the visible face shows the current slide, the hidden face is loaded with
  the next one. Panels rotate 180° on Y with a staggered delay and a slight Z push, so the
  whole picture "turns over" like a wall of louvres.

  Performance rules
  - Only transform + opacity animate (Web Animations API, compositor thread).
  - Rotation accumulates (0 → 180 → 360…), so faces never snap back or flash.
  - The next image is decoded (img.decode) BEFORE a flip starts → no blank frames.
  - Autoplay pauses when the tab is hidden, the hero is off-screen, or the user hovers controls.
  - prefers-reduced-motion → a calm 400 ms crossfade, no 3D.
*/

const INTERVAL = 6500
const FLIP_MS = 1150
const STAGGER = 75

function SlideImg({ slide, i, n, eager }) {
  const im = slide.img
  return (
    <picture>
      <source media="(max-width: 767px)" srcSet={asset(im.mobile)} />
      <img
        src={asset(im.d1280)}
        srcSet={`${asset(im.d1280)} 1280w, ${asset(im.d1920)} 1920w`}
        sizes="100vw"
        alt={i === 0 ? slide.alt : ''}
        width="1920" height="1080"
        decoding="async"
        loading={eager ? 'eager' : 'lazy'}
        fetchpriority={eager && i === 0 ? 'high' : undefined}
        draggable="false"
        style={{ width: `${n * 100}%`, left: `${-i * 100}%` }}
      />
    </picture>
  )
}

export default function HeroCarousel() {
  const total = HERO_SLIDES.length
  const [panels, setPanels] = useState(5)
  const [active, setActive] = useState(0)
  const [faces, setFaces] = useState({ front: 0, back: 1 })
  const [playing, setPlaying] = useState(true)
  const angle = useRef(0)
  const busy = useRef(false)
  const panelRefs = useRef([])
  const heroRef = useRef(null)
  const mediaRef = useRef(null)
  const timer = useRef(0)
  const visible = useRef(true)
  const hovering = useRef(false)
  const decoded = useRef(new Set([0]))
  const primary = useMagnetic(0.25)

  // Panel count by viewport (mobile = fewer layers)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const set = () => setPanels(prefersReduced() ? 1 : mq.matches ? 3 : 6)
    set()
    mq.addEventListener('change', set)
    return () => mq.removeEventListener('change', set)
  }, [])

  // Preload + decode every slide in the background, after first paint
  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 767px)').matches
    const big = window.innerWidth * (window.devicePixelRatio || 1) > 1400
    const idle = window.requestIdleCallback || ((f) => setTimeout(f, 600))
    idle(() => {
      HERO_SLIDES.forEach((s, i) => {
        const img = new Image()
        img.src = asset(mobile ? s.img.mobile : big ? s.img.d1920 : s.img.d1280)
        img.decode?.().then(() => decoded.current.add(i)).catch(() => decoded.current.add(i))
      })
    })
  }, [])

  const goTo = useCallback((target, dir = 1) => {
    if (busy.current || target === active) return
    const reduced = prefersReduced()
    const k = Math.round(angle.current / 180)
    const frontVisible = ((k % 2) + 2) % 2 === 0
    const hiddenFace = frontVisible ? 'back' : 'front'

    busy.current = true
    // 1) load the hidden face with the target slide (no visual change yet)
    setFaces((f) => ({ ...f, [hiddenFace]: target }))

    const run = () => {
      const from = angle.current
      const to = from + 180 * dir
      const els = panelRefs.current.filter(Boolean)
      if (reduced || els.length === 0) {
        angle.current = to
        els.forEach((el) => (el.style.transform = `rotateY(${to}deg)`))
        mediaRef.current?.animate([{ opacity: 0.55 }, { opacity: 1 }], { duration: 400, easing: 'ease-out' })
        setActive(target)
        busy.current = false
        return
      }
      const mid = (from + to) / 2
      const depth = window.innerWidth < 768 ? -110 : -220
      const anims = els.map((el, i) => {
        const order = dir > 0 ? i : els.length - 1 - i
        return el.animate(
          [
            { transform: `translateZ(0px) rotateY(${from}deg)` },
            { transform: `translateZ(${depth}px) rotateY(${mid}deg)`, offset: 0.5 },
            { transform: `translateZ(0px) rotateY(${to}deg)` },
          ],
          { duration: FLIP_MS, delay: order * STAGGER, easing: 'cubic-bezier(.7,0,.2,1)', fill: 'forwards' }
        )
      })
      // Shade sweep on each panel for depth
      els.forEach((el, i) => {
        const order = dir > 0 ? i : els.length - 1 - i
        el.querySelectorAll('.hero3d__shade').forEach((shade) => shade.animate([{ opacity: 0 }, { opacity: 0.55, offset: 0.5 }, { opacity: 0 }], { duration: FLIP_MS, delay: order * STAGGER, easing: 'ease-in-out' }))
      })
      // Text swaps halfway through the flip
      setTimeout(() => setActive(target), FLIP_MS * 0.45)
      Promise.all(anims.map((a) => a.finished)).then(() => {
        angle.current = to
        els.forEach((el, i) => { el.style.transform = `rotateY(${to}deg)`; anims[i].cancel() })
        busy.current = false
      }).catch(() => { busy.current = false })
    }
    // 2) wait one frame for React to commit the new src, then make sure it's decoded
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const els = panelRefs.current.filter(Boolean)
      const img = els[0]?.querySelector(`.hero3d__face--${hiddenFace} img`)
      const ready = decoded.current.has(target) || !img?.decode ? Promise.resolve() : img.decode().catch(() => {})
      Promise.race([ready, new Promise((r) => setTimeout(r, 1200))]).then(run)
    }))
  }, [active])

  const next = useCallback(() => goTo((active + 1) % total, 1), [active, goTo, total])
  const prev = useCallback(() => goTo((active - 1 + total) % total, -1), [active, goTo, total])

  // Autoplay with pause conditions
  useEffect(() => {
    clearTimeout(timer.current)
    if (!playing) return
    timer.current = setTimeout(function tick() {
      if (visible.current && !hovering.current && !document.hidden) next()
      else timer.current = setTimeout(tick, 1000)
    }, INTERVAL)
    return () => clearTimeout(timer.current)
  }, [active, playing, next])

  useEffect(() => {
    const el = heroRef.current
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting }, { threshold: 0.25 })
    io.observe(el)
    // Scroll parallax on the media layer (transform only, rAF-throttled)
    let raf = 0
    const onScroll = () => {
      if (prefersReduced()) return
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, window.innerHeight)
        if (mediaRef.current) mediaRef.current.style.transform = `translate3d(0, ${y * 0.28}px, 0)`
        el.style.setProperty('--hero-fade', String(1 - y / (window.innerHeight * 0.9)))
      })
    }
    addEventListener('scroll', onScroll, { passive: true })
    return () => { io.disconnect(); removeEventListener('scroll', onScroll) }
  }, [])

  // Swipe on touch
  useEffect(() => {
    const el = heroRef.current
    let x0 = null, y0 = null
    const s = (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY }
    const m = (e) => {
      if (x0 == null) return
      const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) dx < 0 ? next() : prev()
      x0 = null
    }
    el.addEventListener('touchstart', s, { passive: true })
    el.addEventListener('touchend', m, { passive: true })
    return () => { el.removeEventListener('touchstart', s); el.removeEventListener('touchend', m) }
  }, [next, prev])

  const slide = HERO_SLIDES[active]
  const words = slide.title.split(' ')

  return (
    <section
      ref={heroRef}
      className="hero"
      aria-roledescription="carousel"
      aria-label="Featured journeys"
      onKeyDown={(e) => { if (e.key === 'ArrowRight') next(); if (e.key === 'ArrowLeft') prev() }}
    >
      <div className="hero__media" ref={mediaRef}>
        <div className="hero3d" style={{ '--n': panels }}>
          {Array.from({ length: panels }).map((_, i) => (
            <div className="hero3d__panel" key={`${panels}-${i}`} ref={(el) => (panelRefs.current[i] = el)}
              style={{ left: `${(i * 100) / panels}%`, width: `calc(${100 / panels}% + 1px)`, transform: `rotateY(${angle.current}deg)` }}>
              <div className="hero3d__face hero3d__face--front"><SlideImg slide={HERO_SLIDES[faces.front]} i={i} n={panels} eager={faces.front === 0} /><span className="hero3d__shade" aria-hidden="true" /></div>
              <div className="hero3d__face hero3d__face--back"><SlideImg slide={HERO_SLIDES[faces.back]} i={i} n={panels} /><span className="hero3d__shade" aria-hidden="true" /></div>
            </div>
          ))}
        </div>
      </div>
      <div className="hero__scrim" aria-hidden="true" />
      <svg className="hero__route" viewBox="0 0 1440 400" preserveAspectRatio="none" aria-hidden="true">
        <path d="M-20 340 C 260 300, 420 120, 720 160 S 1180 60, 1460 40" />
        <circle r="5"><animateMotion dur="9s" repeatCount="indefinite" path="M-20 340 C 260 300, 420 120, 720 160 S 1180 60, 1460 40" /></circle>
      </svg>

      {/* CENTER text */}
      <div className="hero__center container">
        <h1 className="hero__h1"><span className="hero__h1-dot" aria-hidden="true" />Baba Travels &amp; Tours — flights, Umrah &amp; tours from Pakistan</h1>
        <p className="hero__place" key={`p-${active}`}><Icon name="MapPin" size={16} />{slide.place}</p>
        <p className="hero__display" aria-live="polite" key={`t-${active}`}>
          {words.map((w, i) => (
            <React.Fragment key={i}>
              <span className="word" style={{ '--d': `${i * 55}ms` }}>
                <span className={i >= words.length - 2 ? 'word__in word__in--em' : 'word__in'}>{w}</span>
              </span>{i < words.length - 1 ? ' ' : ''}
            </React.Fragment>
          ))}
        </p>
        <div className="hero__ctas">
          <Link ref={primary} to={slide.to} className="btn btn--primary btn--lg">Explore this trip<Icon name="ArrowRight" size={18} /></Link>
          <a href={waLink(`Hi, I'm interested in: ${slide.place}`)} className="btn btn--glass btn--lg">Ask on WhatsApp</a>
        </div>
      </div>

      {/* BOTTOM bar */}
      <div className="hero__bottom container" onMouseEnter={() => (hovering.current = true)} onMouseLeave={() => (hovering.current = false)}>
        <div className="hero__meta" key={`m-${active}`}>
          <span className="hero__meta-k">From</span>
          <strong className="hero__price">{slide.from}</strong>
          <span className="hero__meta-v">{slide.meta}</span>
        </div>
        <div className="hero__tabs" role="tablist" aria-label="Choose slide">
          {HERO_SLIDES.map((s, i) => (
            <button key={s.id} role="tab" aria-selected={i === active} aria-label={`Slide ${i + 1}: ${s.place}`}
              className={`hero__tab ${i === active ? 'is-active' : ''}`}
              onClick={() => goTo(i, i > active ? 1 : -1)}>
              <span className="hero__tab-label">{s.place.split(' · ')[0]}</span>
              <span className="hero__tab-bar"><span className="hero__tab-fill" style={{ animationDuration: `${INTERVAL}ms`, animationPlayState: playing ? 'running' : 'paused' }} key={i === active ? `a-${active}` : 'x'} /></span>
            </button>
          ))}
        </div>
        <div className="hero__ctrl">
          <span className="hero__count"><b>{String(active + 1).padStart(2, '0')}</b> / {String(total).padStart(2, '0')}</span>
          <button className="icon-btn icon-btn--glass" onClick={prev} aria-label="Previous slide"><Icon name="ChevronLeft" /></button>
          <button className="icon-btn icon-btn--glass" onClick={() => setPlaying(!playing)} aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}>
            {playing ? <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><rect x="2" y="1" width="3.5" height="12" rx="1" fill="currentColor"/><rect x="8.5" y="1" width="3.5" height="12" rx="1" fill="currentColor"/></svg>
              : <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.5v11l9-5.5z" fill="currentColor"/></svg>}
          </button>
          <button className="icon-btn icon-btn--glass" onClick={next} aria-label="Next slide"><Icon name="ChevronRight" /></button>
        </div>
      </div>
      <div className="hero__scrollcue" aria-hidden="true"><span /></div>
    </section>
  )
}
