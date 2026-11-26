import React from 'react'
import { Link } from 'react-router-dom'
import HeroCarousel from '../components/HeroCarousel.jsx'
import BookingWidget from '../components/BookingWidget.jsx'
import Icon from '../components/Icon.jsx'
import { SectionHead } from '../components/Chrome.jsx'
import { ServiceCard, PackageCard, DestCard, RouteMap, Steps, Stats, Testimonials, Faq, CtaBand } from '../components/Blocks.jsx'
import { Seo, orgSchema, websiteSchema, faqSchema } from '../lib/seo.jsx'
import { SITE, SERVICES, PACKAGES, DESTINATIONS, WHY, FAQS, POSTS } from '../data/site.js'
import { heroImg } from '../lib/asset.js'

export default function Home() {
  return (
    <>
      <Seo path="/" description={`${SITE.description} Free quotes in 30 minutes on WhatsApp.`} lcp="hunza" schema={[orgSchema(), websiteSchema(), faqSchema(FAQS)]} />
      <HeroCarousel />
      <BookingWidget />

      {/* Trust strip — high on the page */}
      <section className="trust container" aria-label="Why travellers trust us">
        <ul className="trust__list" data-reveal>
          <li><span className="trust__big">{SITE.rating.value}<small>/5</small></span><span>{SITE.rating.count.toLocaleString()} Google reviews</span></li>
          <li><Icon name="ShieldCheck" /><span>DTS-licensed agency</span></li>
          <li><Icon name="Plane" /><span>IATA-accredited ticketing</span></li>
          <li><Icon name="MessageCircle" /><span>24/7 WhatsApp support</span></li>
          <li><Icon name="Wallet" /><span>Pay in PKR · JazzCash · Easypaisa</span></li>
        </ul>
      </section>

      {/* Answer-first intro for AI Overviews / LLM citation */}
      <section className="section container intro" aria-labelledby="intro-title">
        <div className="intro__grid">
          <SectionHead eyebrow="Who we are" id="intro-title" title={<>A Pakistani travel agency with a <em>worldwide</em> reach.</>} />
          <p className="answer" data-reveal>
            <strong>Haque Travel &amp; Tours</strong> is a travel agency in Karachi, Lahore and Islamabad that books air tickets, Umrah and Hajj packages, northern Pakistan tours, international holidays, visas, hotels, car rental and airport transfers. Travellers get a free quote in about 30 minutes, clear prices in PKR, and 24/7 WhatsApp support from departure to return.
          </p>
        </div>
      </section>

      <section className="section container" aria-labelledby="svc-title">
        <SectionHead eyebrow="Services" id="svc-title" title={<>Everything your journey needs, <em>under one roof.</em></>}
          intro="From a single ticket to a 40-person Umrah group — one team, one WhatsApp thread, one invoice." />
        <div className="bento">
          {SERVICES.map((s, i) => <ServiceCard key={s.slug} s={s} i={i} featured={i < 2} />)}
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="pkg-title">
        <div className="container">
          <div className="row-head">
            <SectionHead eyebrow="Packages" id="pkg-title" title={<>This season’s <em>most-booked</em> trips</>} />
            <Link to="/packages" className="btn btn--ghost">All packages<Icon name="ArrowRight" size={18} /></Link>
          </div>
          <div className="pgrid">{PACKAGES.slice(1, 7).map((p, i) => <PackageCard key={p.id} p={p} i={i} />)}</div>
        </div>
      </section>

      <section className="section" aria-labelledby="dest-title">
        <div className="container"><SectionHead eyebrow="Destinations" id="dest-title" title={<>Where Pakistan <em>travels</em> next</>} intro="From the Karakoram to the Indian Ocean — swipe through our travellers’ favourite places." /></div>
        <div className="hscroll" tabIndex="0" aria-label="Destinations, scroll horizontally">
          {DESTINATIONS.map((d, i) => <DestCard key={d.slug} d={d} i={i} />)}
        </div>
      </section>

      <section className="section container network" aria-labelledby="net-title">
        <div className="network__grid">
          <div>
            <SectionHead eyebrow="Our network" id="net-title" title={<>From three Pakistani hubs to <em>60+ countries.</em></>}
              intro="Direct and one-stop routes from Karachi, Lahore and Islamabad to the Gulf, Europe, North America and Asia, with partner desks in Dubai, Jeddah and Istanbul." />
            <Stats />
          </div>
          <RouteMap />
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="how-title">
        <div className="container">
          <SectionHead eyebrow="How it works" id="how-title" align="center" title={<>Booked in four <em>calm</em> steps</>} />
          <Steps />
        </div>
      </section>

      <section className="section container" aria-labelledby="why-title">
        <div className="why">
          <div className="why__media" data-reveal>
            <img src={heroImg('skies', 1280)} alt="Aircraft above sunrise clouds" loading="lazy" width="1280" height="720" />
            <div className="why__badge glass"><span className="why__badge-num">24/7</span><span>Real people on WhatsApp — even at 3 a.m. in Jeddah.</span></div>
          </div>
          <div>
            <SectionHead eyebrow="Why Haque" id="why-title" title={<>Travel with people who <em>pick up.</em></>} />
            <ul className="why__list">
              {WHY.map((w, i) => (
                <li key={w.title} data-reveal style={{ '--rd': `${i * 60}ms` }}>
                  <span className="why__icon"><Icon name={w.icon} /></span>
                  <div><h3>{w.title}</h3><p>{w.text}</p></div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section section--alt testi" aria-labelledby="t-title">
        <div className="container"><SectionHead eyebrow="Reviews" id="t-title" align="center" title={<>Rated <em>{SITE.rating.value}/5</em> by {SITE.rating.count.toLocaleString()} travellers</>} /></div>
        <Testimonials />
      </section>

      <section className="section container" aria-labelledby="faq-title">
        <div className="faqwrap">
          <SectionHead eyebrow="FAQ" id="faq-title" title={<>Questions travellers <em>ask us</em> most</>} intro="Can’t find yours? Ask on WhatsApp — we reply in minutes." />
          <Faq items={FAQS} />
        </div>
      </section>

      <section className="section container" aria-labelledby="blog-title">
        <div className="row-head">
          <SectionHead eyebrow="Travel guides" id="blog-title" title={<>Plan smarter with our <em>guides</em></>} />
        </div>
        <div className="posts">
          {POSTS.map((p, i) => (
            <article className="post" key={p.slug} data-reveal style={{ '--rd': `${i * 80}ms` }}>
              <Link to={`/blog/${p.slug}`} className="post__media"><img src={heroImg(p.img, 'thumb')} alt="" loading="lazy" width="480" height="270" /></Link>
              <div className="post__body">
                <p className="post__meta">Updated <time dateTime={p.updated}>{new Date(p.updated).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</time> · {p.read}</p>
                <h3 className="post__title"><Link to={`/blog/${p.slug}`}>{p.title}</Link></h3>
                <p className="post__excerpt">{p.excerpt}</p>
                <p className="post__author">By {p.author}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Brand promise — Haque advertisement */}
      <section className="section promo" aria-labelledby="promo-title">
        <div className="container promo__grid">
          <figure className="promo__art" data-reveal>
            <img src="/images/haque-journey.webp"
              alt="Haque Travel & Tours — a family watching an aircraft take off, with the message: some journeys aren’t about places"
              width="1080" height="1080" loading="lazy" />
          </figure>
          <div className="promo__body">
            <span className="eyebrow">Your Journey, Our Passion</span>
            <h2 className="promo__title" id="promo-title">Some journeys aren’t about <em>places.</em></h2>
            <ul className="promo__points">
              <li data-reveal><span className="promo__ic"><Icon name="Users" size={18} /></span><span>They’re about <strong>the people</strong> you travel with.</span></li>
              <li data-reveal style={{ '--rd': '70ms' }}><span className="promo__ic"><Icon name="Sparkles" size={18} /></span><span>The <strong>memories</strong> you bring home.</span></li>
              <li data-reveal style={{ '--rd': '140ms' }}><span className="promo__ic"><Icon name="Quote" size={18} /></span><span>And the <strong>stories</strong> you’ll tell for years.</span></li>
            </ul>
            <p className="promo__quote">“Because in the end, it’s not just the destination… it’s the journey that stays with you forever.”</p>
            <div className="promo__ctas">
              <Link to="/quote" className="btn btn--primary btn--lg">Where will your next story begin?<Icon name="ArrowRight" size={18} /></Link>
            </div>
            <ul className="promo__contact">
              {SITE.phones.map((p) => (
                <li key={p}><a href={`tel:${p.replace(/\s/g, '')}`}><Icon name="Phone" size={15} />{p}</a></li>
              ))}
              <li><a href={`mailto:${SITE.email}`}><Icon name="Mail" size={15} />{SITE.email}</a></li>
              <li><a href={SITE.url} target="_blank" rel="noreferrer"><Icon name="Globe2" size={15} />{SITE.website}</a></li>
              <li className="promo__addr"><Icon name="MapPin" size={15} /><span>{SITE.addressLine}</span></li>
            </ul>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
