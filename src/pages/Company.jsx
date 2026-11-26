import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon, { WhatsAppIcon } from '../components/Icon.jsx'
import { Breadcrumbs, SectionHead, waLink } from '../components/Chrome.jsx'
import { PageHero, Stats, CtaBand, Testimonials } from '../components/Blocks.jsx'
import { Seo, breadcrumbSchema, orgSchema } from '../lib/seo.jsx'
import { SITE, OFFICES, WHY } from '../data/site.js'
import { submitLead } from '../lib/api.js'

export function About() {
  const crumbs = [{ label: 'Home', to: '/' }, { label: 'About', to: '/about' }]
  return (
    <>
      <Seo title="About Haque Travel & Tours" path="/about" description={`${SITE.name} has helped Pakistani families, pilgrims and companies travel since ${SITE.founded}, with offices in Karachi, Lahore and Islamabad.`}
        lcp="hunza" schema={[orgSchema(), breadcrumbSchema(crumbs)]} />
      <PageHero img="hunza" eyebrow="About us" title="We’ve been sending Pakistan around the world since 2010" crumbs={<Breadcrumbs items={crumbs} />} />
      <section className="section container about">
        <div className="about__grid">
          <div>
            <h2 className="detail__h2">Who is Haque Travel &amp; Tours?</h2>
            <p className="answer answer--boxed">{SITE.name} is a family-run travel agency founded in Karachi in {SITE.founded}. We plan Umrah journeys, northern Pakistan tours, international holidays and business travel for families, pilgrims and companies, and support Pakistanis abroad travelling home from the UK, Gulf and Canada.</p>
            <p className="prose">What started as a small ticketing desk is now a team of advisors across three Pakistani cities and partner desks in Dubai, Jeddah and Istanbul. The idea hasn’t changed: answer the phone, explain the price, and stay with travellers until they’re home. {/* CONFIRM story with client */}</p>
          </div>
          <Stats />
        </div>
      </section>
      <section className="section section--alt">
        <div className="container">
          <SectionHead eyebrow="Our promise" title="What you can hold us to" />
          <ul className="why__list why__list--grid">
            {WHY.map((w) => <li key={w.title} data-reveal><span className="why__icon"><Icon name={w.icon} /></span><div><h3>{w.title}</h3><p>{w.text}</p></div></li>)}
          </ul>
        </div>
      </section>
      <section className="section testi"><Testimonials /></section>
      <CtaBand />
    </>
  )
}

export function Contact() {
  const crumbs = [{ label: 'Home', to: '/' }, { label: 'Contact', to: '/contact' }]
  const [state, setState] = useState('idle')
  const onSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    if (!form.checkValidity()) { form.reportValidity(); return }
    setState('sending')
    await submitLead({ type: 'contact', ...Object.fromEntries(new FormData(form)) })
    setState('sent')
  }
  const localBusinesses = OFFICES.map((o) => ({ '@type': 'TravelAgency', name: `${SITE.name} — ${o.city}`, telephone: o.phone, address: { '@type': 'PostalAddress', streetAddress: o.address, addressLocality: o.city, addressCountry: o.country === 'UAE' ? 'AE' : 'PK' }, geo: { '@type': 'GeoCoordinates', latitude: o.geo[0], longitude: o.geo[1] } }))
  return (
    <>
      <Seo title="Contact us — offices in Karachi, Lahore, Islamabad & Dubai" path="/contact" description={`Call ${SITE.phone}, WhatsApp 24/7, or visit our offices in Karachi, Lahore, Islamabad and Dubai.`} lcp="dubai" schema={[breadcrumbSchema(crumbs), ...localBusinesses]} />
      <PageHero img="dubai" eyebrow="Contact" title="Talk to a real travel advisor" crumbs={<Breadcrumbs items={crumbs} />}>
        <div className="phero__ctas">
          <a href={waLink()} className="btn btn--wa btn--lg"><WhatsAppIcon />WhatsApp 24/7</a>
          <a href={`tel:${SITE.phoneHref}`} className="btn btn--glass btn--lg"><Icon name="Phone" size={18} />{SITE.phone}</a>
        </div>
      </PageHero>
      <section className="section container contact">
        <div className="offices">
          {OFFICES.map((o, i) => (
            <article className="office glass" key={o.id} data-reveal style={{ '--rd': `${i * 70}ms` }}>
              <span className="chip">{o.label}</span>
              <h2 className="office__city">{o.city}<small>{o.country}</small></h2>
              <p><Icon name="MapPin" size={15} />{o.address}</p>
              <p><Icon name="Phone" size={15} /><a href={`tel:${o.phone.replace(/\s/g, '')}`}>{o.phone}</a></p>
              <p><Icon name="Clock" size={15} />{o.hours}</p>
              <a className="office__map" href={`https://www.google.com/maps?q=${o.geo[0]},${o.geo[1]}`} target="_blank" rel="noopener">Open in Google Maps<Icon name="ArrowUpRight" size={15} /></a>
            </article>
          ))}
        </div>
        <form className="cform glass" onSubmit={onSubmit} noValidate>
          <h2 className="detail__h2">Send us a message</h2>
          {state === 'sent' ? (
            <div className="success"><span className="success__tick"><Icon name="Check" size={28} /></span><h3>Message received</h3><p>An advisor will reply by WhatsApp or email within 30 minutes during office hours.</p></div>
          ) : (<>
            <div className="cform__row">
              <label className="field"><span className="field__label">Full name</span><input name="name" required autoComplete="name" /></label>
              <label className="field"><span className="field__label">Phone / WhatsApp</span><input name="phone" required type="tel" autoComplete="tel" placeholder="+92 3xx xxxxxxx" /></label>
            </div>
            <label className="field"><span className="field__label">Email</span><input name="email" type="email" autoComplete="email" /></label>
            <label className="field"><span className="field__label">How can we help?</span><textarea name="message" rows="4" required /></label>
            <button className="btn btn--primary btn--lg" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Send message'}<Icon name="Send" size={18} /></button>
          </>)}
        </form>
      </section>
    </>
  )
}
