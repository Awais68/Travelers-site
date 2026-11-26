import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import { heroImg } from '../lib/asset.js'
import { useInView, useTilt, prefersReduced } from '../lib/hooks.js'
import { STEPS, STATS, TESTIMONIALS } from '../data/site.js'
import { waLink } from './Chrome.jsx'
import { WhatsAppIcon } from './Icon.jsx'

export function ServiceCard({ s, i, featured }) {
  const ref = useTilt(7)
  return (
    <Link ref={ref} to={`/services/${s.slug}`} className={`scard ${featured ? 'scard--feature' : ''}`} data-reveal style={{ '--rd': `${(i % 4) * 70}ms` }}>
      <span className="scard__spot" aria-hidden="true" />
      <span className="scard__icon"><Icon name={s.icon} size={22} /></span>
      <h3 className="scard__title">{s.title}</h3>
      <p className="scard__text">{s.short}</p>
      <span className="scard__more">Learn more <Icon name="ArrowUpRight" size={16} /></span>
      <span className="scard__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
    </Link>
  )
}

export function PackageCard({ p, i = 0 }) {
  const ref = useTilt(5)
  const img = p.cat === 'Umrah' ? 'umrah' : p.cat === 'Northern Pakistan' ? 'hunza' : p.id.startsWith('dubai') ? 'dubai' : p.id.startsWith('maldives') ? 'islands' : 'skies'
  return (
    <article ref={ref} className="pcard" data-reveal style={{ '--rd': `${(i % 3) * 80}ms` }}>
      <div className="pcard__media">
        <img src={heroImg(img, 1280)} alt="" loading="lazy" decoding="async" width="1280" height="720" />
        {p.badge && <span className="chip chip--accent pcard__badge">{p.badge}</span>}
        <span className="pcard__cat">{p.cat}</span>
      </div>
      <div className="pcard__body">
        <h3 className="pcard__title">{p.title}</h3>
        <p className="pcard__sub"><Icon name="CalendarDays" size={15} />{p.nights} · {p.hotel}</p>
        <ul className="pcard__perks">{p.perks.map((x) => <li key={x}><Icon name="Check" size={14} />{x}</li>)}</ul>
        <div className="pcard__foot">
          <span><small>from / person</small><strong>{p.price}</strong></span>
          <Link to={`/quote?service=${encodeURIComponent(p.cat)}&package=${p.id}`} className="btn btn--primary btn--sm" aria-label={`Book ${p.title}`}>Book</Link>
        </div>
      </div>
    </article>
  )
}

export function DestCard({ d, i }) {
  return (
    <Link to={`/destinations/${d.slug}`} className="dcard" data-reveal style={{ '--rd': `${i * 70}ms` }}>
      <img src={heroImg(d.img, 1280)} alt={`${d.name}, ${d.region}`} loading="lazy" decoding="async" width="1280" height="720" style={d.tone} />
      <span className="dcard__shade" aria-hidden="true" />
      <span className="dcard__body">
        <span className="dcard__region">{d.region}</span>
        <h3 className="dcard__name">{d.name}</h3>
        <span className="dcard__meta">{d.days} · from <b>{d.from}</b></span>
      </span>
      <span className="dcard__go" aria-hidden="true"><Icon name="ArrowUpRight" size={20} /></span>
    </Link>
  )
}

/* Route board: Pakistan hubs → world. Pure SVG, arcs draw in on view, planes move with SMIL. */
const HUBS = { KHI: [596, 262], LHE: [640, 214], ISB: [636, 196] }
const CITIES = [
  { code: 'JED', name: 'Jeddah', pos: [470, 290], from: 'KHI', info: 'Umrah · 4h 05m direct' },
  { code: 'MED', name: 'Madinah', pos: [462, 262], from: 'LHE', info: 'Umrah · 4h 40m direct' },
  { code: 'DXB', name: 'Dubai', pos: [540, 270], from: 'KHI', info: 'Holidays · 2h 10m direct' },
  { code: 'IST', name: 'Istanbul', pos: [430, 170], from: 'ISB', info: 'Tours · 6h 15m direct' },
  { code: 'LHR', name: 'London', pos: [330, 120], from: 'ISB', info: 'Diaspora · 8h 30m direct' },
  { code: 'YYZ', name: 'Toronto', pos: [120, 150], from: 'LHE', info: 'Diaspora · 1 stop' },
  { code: 'KUL', name: 'Kuala Lumpur', pos: [800, 360], from: 'KHI', info: 'Tours · 1 stop' },
  { code: 'BKK', name: 'Bangkok', pos: [780, 300], from: 'LHE', info: 'Tours · 1 stop' },
  { code: 'GYD', name: 'Baku', pos: [500, 160], from: 'LHE', info: 'Tours · 1 stop' },
  { code: 'MLE', name: 'Malé', pos: [650, 380], from: 'KHI', info: 'Honeymoon · 1 stop' },
]
const arc = ([x1, y1], [x2, y2]) => {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - Math.abs(x2 - x1) * 0.28 - 20
  return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`
}
export function RouteMap() {
  const [ref, inView] = useInView({ threshold: 0.25 })
  const [hover, setHover] = useState(null)
  // dotted "land" grid, deterministic
  const dots = []
  for (let y = 60; y < 420; y += 14) for (let x = 40; x < 920; x += 14) {
    const v = Math.sin(x * 0.021) * Math.cos(y * 0.034) + Math.sin((x + y) * 0.011)
    if (v > 0.35) dots.push([x, y])
  }
  return (
    <div ref={ref} className={`routemap ${inView ? 'is-in' : ''}`}>
      <svg viewBox="0 0 960 460" className="routemap__svg" role="img" aria-labelledby="rm-title rm-desc">
        <title id="rm-title">Baba Travels route network</title>
        <desc id="rm-desc">Routes from Karachi, Lahore and Islamabad to Jeddah, Madinah, Dubai, Istanbul, London, Toronto, Kuala Lumpur, Bangkok, Baku and Malé.</desc>
        <g className="routemap__dots">{dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1.6" />)}</g>
        {CITIES.map((c, i) => {
          const d = arc(HUBS[c.from], c.pos)
          return (
            <g key={c.code} className={`route ${hover && hover !== c.code ? 'is-dim' : ''} ${hover === c.code ? 'is-hot' : ''}`} style={{ '--i': i }}>
              <path d={d} className="route__line" pathLength="1" />
              {inView && !prefersReduced() && (
                <circle r="3.2" className="route__plane">
                  <animateMotion dur={`${4 + (i % 4)}s`} begin={`${1.2 + i * 0.15}s`} repeatCount="indefinite" path={d} />
                </circle>
              )}
            </g>
          )
        })}
        {CITIES.map((c) => (
          <g key={c.code} className="city" transform={`translate(${c.pos[0]} ${c.pos[1]})`}
            onMouseEnter={() => setHover(c.code)} onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(c.code)} onBlur={() => setHover(null)} tabIndex="0" role="button" aria-label={`${c.name}: ${c.info}`}>
            <circle r="14" className="city__halo" /><circle r="4.5" className="city__dot" />
            <text y="-12" textAnchor="middle" className="city__label">{c.code}</text>
          </g>
        ))}
        {Object.entries(HUBS).map(([k, [x, y]]) => (
          <g key={k} transform={`translate(${x} ${y})`} className="hub">
            <circle r="18" className="hub__pulse" /><circle r="7" className="hub__dot" />
            <text x="12" y={k === 'ISB' ? -8 : k === 'LHE' ? 14 : 18} className="hub__label">{k}</text>
          </g>
        ))}
      </svg>
      <div className="routemap__card glass" aria-live="polite">
        {hover ? (() => { const c = CITIES.find((x) => x.code === hover); return <><strong>{c.from} → {c.code}</strong><span>{c.name} · {c.info}</span></> })()
          : <><strong>Hover a city</strong><span>Routes from Karachi, Lahore & Islamabad</span></>}
      </div>
    </div>
  )
}

export function Steps({ vertical }) {
  const [ref, inView] = useInView({ threshold: 0.3 })
  return (
    <ol ref={ref} className={`steps ${vertical ? 'steps--v' : ''} ${inView ? 'is-in' : ''}`}>
      <span className="steps__line" aria-hidden="true"><span /></span>
      {STEPS.map((s, i) => (
        <li key={s.title} className="step" style={{ '--i': i }}>
          <span className="step__num">{i + 1}</span>
          <h3 className="step__title">{s.title}</h3>
          <p className="step__text">{s.text}</p>
        </li>
      ))}
    </ol>
  )
}

function Counter({ value, decimals = 0, suffix, run }) {
  const [n, setN] = useState(value)
  const started = useRef(false)
  useEffect(() => {
    if (!run || started.current || prefersReduced()) return
    started.current = true
    const t0 = performance.now(), dur = 1600
    let raf
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur)
      const e = 1 - Math.pow(1 - p, 4)
      setN(value * e)
      if (p < 1) raf = requestAnimationFrame(step)
    }
    setN(0); raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [run, value])
  return <span className="stat__num">{n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}<span className="stat__suf">{suffix}</span></span>
}
export function Stats() {
  const [ref, inView] = useInView({ threshold: 0.4 })
  return (
    <dl ref={ref} className="stats">
      {STATS.map((s) => (
        <div className="stat" key={s.label} data-reveal>
          <dt className="stat__label">{s.label}</dt>
          <dd><Counter {...s} run={inView} /></dd>
        </div>
      ))}
    </dl>
  )
}

export function Testimonials() {
  const row = (list, rev) => (
    <div className={`marquee ${rev ? 'marquee--rev' : ''}`}>
      <div className="marquee__track">
        {[...list, ...list].map((t, i) => (
          <figure className="tcard" key={i} aria-hidden={i >= list.length ? 'true' : undefined} itemScope itemType="https://schema.org/Review">
            <div className="tcard__stars" aria-label={`${t.rating} out of 5 stars`}>{'★'.repeat(t.rating)}<span>{'★'.repeat(5 - t.rating)}</span></div>
            <blockquote className="tcard__text" itemProp="reviewBody">“{t.text}”</blockquote>
            <figcaption className="tcard__who">
              <span className="tcard__avatar" aria-hidden="true">{t.name[0]}</span>
              <span><strong itemProp="author">{t.name}</strong><small>{t.city} · {t.trip}</small></span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
  return <div className="tmarquee">{row(TESTIMONIALS.slice(0, 3))}{row(TESTIMONIALS.slice(3), true)}</div>
}

export function Faq({ items, idPrefix = 'faq' }) {
  const [open, setOpen] = useState(0)
  return (
    <div className="faq">
      {items.map((f, i) => (
        <div className={`faq__item ${open === i ? 'is-open' : ''}`} key={f.q} data-reveal>
          <h3 className="faq__q">
            <button aria-expanded={open === i} aria-controls={`${idPrefix}-${i}`} id={`${idPrefix}-b${i}`} onClick={() => setOpen(open === i ? -1 : i)}>
              <span>{f.q}</span><span className="faq__plus" aria-hidden="true" />
            </button>
          </h3>
          <div className="faq__a" id={`${idPrefix}-${i}`} role="region" aria-labelledby={`${idPrefix}-b${i}`}>
            <div><p>{f.a}</p></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function KeyFacts({ facts, title = 'Key facts' }) {
  return (
    <aside className="facts glass" aria-label={title}>
      <h2 className="facts__title">{title}</h2>
      <table><tbody>{facts.map(([k, v]) => <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>)}</tbody></table>
    </aside>
  )
}

export function CtaBand() {
  return (
    <section className="cta container" aria-labelledby="cta-title">
      <div className="cta__card" data-reveal>
        <div className="cta__orb" aria-hidden="true" />
        <svg className="cta__route" viewBox="0 0 800 200" aria-hidden="true"><path d="M0 160 C 200 160 220 40 420 60 S 700 150 800 30" /></svg>
        <span className="eyebrow eyebrow--dark">Ready when you are</span>
        <h2 id="cta-title" className="cta__title">Your next journey is one message away.</h2>
        <p className="cta__text">Tell us where and when. A real advisor replies with clear PKR prices in about 30 minutes.</p>
        <div className="cta__btns">
          <Link to="/quote" className="btn btn--dark btn--lg">Get a free quote<Icon name="ArrowRight" size={18} /></Link>
          <a href={waLink()} className="btn btn--wa btn--lg"><WhatsAppIcon size={20} />WhatsApp us</a>
        </div>
      </div>
    </section>
  )
}

export function PageHero({ img = 'skies', eyebrow, title, children, crumbs }) {
  return (
    <header className="phero">
      <div className="phero__media" aria-hidden="true">
        <picture>
          <source media="(max-width: 767px)" srcSet={heroImg(img, 'm')} />
          <img
            src={heroImg(img, 1280)}
            srcSet={`${heroImg(img, 1280)} 1280w, ${heroImg(img, 1920)} 1920w`}
            sizes="100vw"
            alt="" width="1280" height="720"
            loading="eager" fetchpriority="high" decoding="async"
          />
        </picture>
      </div>
      <div className="phero__scrim" aria-hidden="true" />
      <div className="phero__body container">
        {crumbs}
        {eyebrow && <span className="eyebrow eyebrow--light">{eyebrow}</span>}
        <h1 className="phero__title">{title}</h1>
        {children}
      </div>
    </header>
  )
}
