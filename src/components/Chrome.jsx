import React from 'react'
import { Link } from 'react-router-dom'
import Icon, { Logo, WhatsAppIcon } from './Icon.jsx'
import { SITE, SERVICES, DESTINATIONS, OFFICES } from '../data/site.js'

export const waLink = (msg = 'Assalam o Alaikum, I would like a travel quote.') =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__glow" aria-hidden="true" />
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <Logo />
            <p>{SITE.description}</p>
            <div className="footer__rating"><span className="stars" aria-hidden="true">★★★★★</span> {SITE.rating.value}/5 from {SITE.rating.count.toLocaleString()} Google reviews</div>
            <div className="footer__social">
              <a href={SITE.social.facebook} aria-label="Facebook" className="icon-btn"><Icon name="Facebook" size={18} /></a>
              <a href={SITE.social.instagram} aria-label="Instagram" className="icon-btn"><Icon name="Instagram" size={18} /></a>
              <a href={SITE.social.youtube} aria-label="YouTube" className="icon-btn"><Icon name="Youtube" size={18} /></a>
              <a href={waLink()} aria-label="WhatsApp" className="icon-btn"><WhatsAppIcon size={18} /></a>
            </div>
          </div>
          <div className="footer__cols">
            <div>
              <h2 className="footer__h">Services</h2>
              <ul>{SERVICES.slice(0, 7).map((s) => <li key={s.slug}><Link to={`/services/${s.slug}`}>{s.title}</Link></li>)}</ul>
            </div>
            <div>
              <h2 className="footer__h">Destinations</h2>
              <ul>{DESTINATIONS.map((d) => <li key={d.slug}><Link to={`/destinations/${d.slug}`}>{d.name} tours</Link></li>)}
                <li><Link to="/packages">All packages</Link></li></ul>
            </div>
            <div>
              <h2 className="footer__h">Company</h2>
              <ul>
                <li><Link to="/about">About us</Link></li><li><Link to="/contact">Contact & offices</Link></li>
                <li><Link to="/quote">Get a quote</Link></li><li><Link to="/blog/umrah-checklist-2026">Travel guides</Link></li>
                <li><Link to="/contact">Terms & refunds</Link></li><li><Link to="/contact">Privacy policy</Link></li>
              </ul>
            </div>
            <div>
              <h2 className="footer__h">Offices</h2>
              <ul className="footer__offices">
                {OFFICES.map((o) => <li key={o.id}><strong>{o.city}</strong><span>{o.address}</span><a href={`tel:${o.phone.replace(/\s/g, '')}`}>{o.phone}</a></li>)}
              </ul>
            </div>
          </div>
        </div>
        <svg className="footer__word" viewBox="0 0 1000 150" aria-hidden="true" focusable="false">
          <defs><linearGradient id="fw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".14" /><stop offset=".9" stopColor="#fff" stopOpacity="0" /></linearGradient></defs>
          <text x="0" y="128" textLength="1000" lengthAdjust="spacingAndGlyphs" fill="url(#fw)">Haque</text>
        </svg>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</span>
          <span>DTS Licence No. 0000 · IATA 00-0 0000 0 {/* CONFIRM */}</span>
          <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Back to top ↑</a>
        </div>
      </div>
    </footer>
  )
}

export function MobileBar() {
  return (
    <nav className="mbar" aria-label="Quick actions">
      <Link to="/quote" className="mbar__item mbar__item--primary"><Icon name="Send" size={20} /><span>Quote</span></Link>
      <Link to="/packages" className="mbar__item"><Icon name="Sparkles" size={20} /><span>Packages</span></Link>
      <a href={waLink()} className="mbar__item mbar__item--wa"><WhatsAppIcon size={20} /><span>WhatsApp</span></a>
      <a href={`tel:${SITE.phoneHref}`} className="mbar__item"><Icon name="Phone" size={20} /><span>Call</span></a>
    </nav>
  )
}

export function WhatsAppFab() {
  return (
    <a href={waLink()} className="wa-fab" aria-label="Chat with us on WhatsApp">
      <span className="wa-fab__pulse" aria-hidden="true" /><WhatsAppIcon size={26} />
      <span className="wa-fab__label">Chat with an advisor</span>
    </a>
  )
}

export function Breadcrumbs({ items }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((it, i) => (
          <li key={it.to}>
            {i < items.length - 1 ? <Link to={it.to}>{it.label}</Link> : <span aria-current="page">{it.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function SectionHead({ eyebrow, title, intro, align = 'left', as: H = 'h2', id }) {
  return (
    <div className={`shead shead--${align}`} data-reveal>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <H className="shead__title" id={id}>{title}</H>
      {intro && <p className="shead__intro">{intro}</p>}
    </div>
  )
}
