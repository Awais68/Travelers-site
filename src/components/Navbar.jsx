import React, { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Icon, { Logo } from './Icon.jsx'
import { NAV, SERVICES, DESTINATIONS, SITE } from '../data/site.js'
import { useTheme, useMagnetic } from '../lib/hooks.js'
import { heroImg } from '../lib/asset.js'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [mega, setMega] = useState(null)
  const [theme, toggle] = useTheme()
  const progress = useRef(null)
  const loc = useLocation()
  const cta = useMagnetic(0.3)
  const closeTimer = useRef(0)
  const darkTop = /^\/($|services|packages|destinations|about|contact|blog)/.test(loc.pathname)

  useEffect(() => { setOpen(false); setMega(null) }, [loc.pathname])
  useEffect(() => {
    let raf = 0
    const on = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = window.scrollY
        setScrolled(y > 24)
        const max = document.documentElement.scrollHeight - innerHeight
        if (progress.current) progress.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`
      })
    }
    on()
    addEventListener('scroll', on, { passive: true })
    return () => removeEventListener('scroll', on)
  }, [])
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    const esc = (e) => { if (e.key === 'Escape') { setOpen(false); setMega(null) } }
    addEventListener('keydown', esc)
    return () => removeEventListener('keydown', esc)
  }, [open])

  const openMega = (k) => { clearTimeout(closeTimer.current); setMega(k) }
  const closeMega = () => { closeTimer.current = setTimeout(() => setMega(null), 140) }

  return (
    <header className={`nav ${scrolled || !darkTop ? 'nav--scrolled' : ''} ${open ? 'nav--open' : ''}`}>
      <div className="nav__bar container">
        <Link to="/" className="nav__brand" aria-label={`${SITE.name} home`}><Logo /></Link>

        <nav className="nav__links" aria-label="Primary">
          {NAV.map((item) => {
            const key = item.mega ? 'services' : item.dest ? 'dest' : null
            return key ? (
              <div key={item.label} className="nav__item" onMouseEnter={() => openMega(key)} onMouseLeave={closeMega}>
                <button className={`nav__link ${mega === key ? 'is-active' : ''}`} aria-expanded={mega === key} aria-controls={`mega-${key}`}
                  onClick={() => setMega(mega === key ? null : key)}>
                  {item.label}<Icon name="ChevronDown" size={16} className="nav__chev" />
                </button>
              </div>
            ) : (
              <NavLink key={item.label} to={item.to} className={({ isActive }) => `nav__link ${isActive ? 'is-current' : ''}`}>{item.label}</NavLink>
            )
          })}
        </nav>

        <div className="nav__actions">
          <button className="icon-btn theme-toggle" onClick={toggle} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
            <span className="theme-toggle__icons" data-theme-icon={theme}>
              <Icon name="Sun" size={18} /><Icon name="MoonStar" size={18} />
            </span>
          </button>
          <a className="nav__phone" href={`tel:${SITE.phoneHref}`}><Icon name="Phone" size={16} />{SITE.phone}</a>
          <Link ref={cta} to="/quote" className="btn btn--primary btn--sm nav__cta">Get a quote</Link>
          <button className="icon-btn nav__burger" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'}>
            <span className="burger"><span /><span /></span>
          </button>
        </div>
      </div>

      {/* Mega: services */}
      <div id="mega-services" className={`mega ${mega === 'services' ? 'is-open' : ''}`} onMouseEnter={() => openMega('services')} onMouseLeave={closeMega}>
        <div className="mega__inner container">
          <div className="mega__grid">
            {SERVICES.map((s) => (
              <Link key={s.slug} to={`/services/${s.slug}`} className="mega__link" tabIndex={mega === 'services' ? 0 : -1}>
                <span className="mega__icon"><Icon name={s.icon} size={18} /></span>
                <span><strong>{s.title}</strong><small>{s.short}</small></span>
              </Link>
            ))}
          </div>
          <Link to="/packages" className="mega__feature" tabIndex={mega === 'services' ? 0 : -1}>
            <img src={heroImg('umrah', 'thumb')} alt="" loading="lazy" width="480" height="270" />
            <span className="mega__feature-body">
              <span className="chip chip--accent">Season pick</span>
              <strong>Family Umrah · 21 nights</strong>
              <small>4★ hotels 400 m from Haram · from PKR 365,000</small>
            </span>
          </Link>
        </div>
      </div>
      {/* Mega: destinations */}
      <div id="mega-dest" className={`mega ${mega === 'dest' ? 'is-open' : ''}`} onMouseEnter={() => openMega('dest')} onMouseLeave={closeMega}>
        <div className="mega__inner container mega__dest">
          {DESTINATIONS.map((d) => (
            <Link key={d.slug} to={`/destinations/${d.slug}`} className="mega__dcard" tabIndex={mega === 'dest' ? 0 : -1}>
              <img src={heroImg(d.img, 'thumb')} alt="" loading="lazy" width="480" height="270" />
              <span><strong>{d.name}</strong><small>from {d.from}</small></span>
            </Link>
          ))}
        </div>
      </div>

      <div className="nav__progress" ref={progress} aria-hidden="true" />

      {/* Mobile drawer */}
      <div id="mobile-menu" className="drawer" aria-hidden={!open} inert={open ? undefined : ''}>
        <nav className="drawer__nav" aria-label="Mobile">
          <Link to="/" style={{ '--i': 0 }}>Home</Link>
          <Link to="/services" style={{ '--i': 1 }}>Services</Link>
          <Link to="/packages" style={{ '--i': 2 }}>Packages</Link>
          <Link to="/destinations/hunza-valley" style={{ '--i': 3 }}>Destinations</Link>
          <Link to="/about" style={{ '--i': 4 }}>About</Link>
          <Link to="/contact" style={{ '--i': 5 }}>Contact</Link>
        </nav>
        <div className="drawer__chips">
          {SERVICES.slice(0, 6).map((s) => <Link key={s.slug} to={`/services/${s.slug}`} className="chip"><Icon name={s.icon} size={14} />{s.title}</Link>)}
        </div>
        <div className="drawer__foot">
          <Link to="/quote" className="btn btn--primary btn--block">Get a free quote</Link>
          <a href={`tel:${SITE.phoneHref}`} className="btn btn--ghost btn--block"><Icon name="Phone" size={18} />{SITE.phone}</a>
        </div>
      </div>
    </header>
  )
}
