import React from 'react'
import { Link, useParams } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { Breadcrumbs, SectionHead } from '../components/Chrome.jsx'
import { PageHero, KeyFacts, Faq, CtaBand, DestCard } from '../components/Blocks.jsx'
import { Seo, breadcrumbSchema, tripSchema, faqSchema } from '../lib/seo.jsx'
import { DESTINATIONS, OFFICES } from '../data/site.js'
import NotFound from './NotFound.jsx'

// Template duplicated for every destination / route page (local SEO + GEO).
export default function Destination() {
  const { slug } = useParams()
  const d = DESTINATIONS.find((x) => x.slug === slug)
  if (!d) return <NotFound />
  const crumbs = [{ label: 'Home', to: '/' }, { label: 'Destinations', to: '/packages' }, { label: d.name, to: `/destinations/${d.slug}` }]
  const faqs = [
    { q: `How much does a ${d.name} tour cost from Pakistan?`, a: `${d.name} packages with Baba Travels start from ${d.from} per person for ${d.days}, including hotels and transport. Private family tours are quoted on request.` },
    { q: `What is the best time to visit ${d.name}?`, a: `${d.best}.` },
    { q: `How do I get to ${d.name}?`, a: `${d.reach}.` },
  ]
  const office = OFFICES[0]
  return (
    <>
      <Seo title={`${d.name} tour packages from Pakistan (${d.from})`} path={`/destinations/${d.slug}`} description={d.summary.slice(0, 155)}
        image={`/images/hero/${d.img}-1280.webp`} lcp={d.img} schema={[tripSchema(d), breadcrumbSchema(crumbs), faqSchema(faqs)]} />
      <PageHero img={d.img} eyebrow={d.region} title={`${d.name} tours from Karachi, Lahore & Islamabad`} crumbs={<Breadcrumbs items={crumbs} />}>
        <div className="phero__chips"><span className="chip chip--glass">{d.days}</span><span className="chip chip--glass">from {d.from}</span><span className="chip chip--glass">Best: {d.best.split(' ')[0]}</span></div>
      </PageHero>
      <section className="section container detail">
        <div className="detail__main">
          <h2 className="detail__h2">How much does a {d.name} trip cost and what’s included?</h2>
          <p className="answer answer--boxed">{d.summary}</p>
          <h2 className="detail__h2">Highlights</h2>
          <ul className="ticks ticks--2">{d.highlights.map((x) => <li key={x}><Icon name="Sparkles" size={16} />{x}</li>)}</ul>
          <h2 className="detail__h2">Sample itinerary</h2>
          <ol className="itin">{d.itinerary.map((t, i) => <li key={i}><span className="itin__day">Day {i + 1}</span><span>{t}</span></li>)}</ol>
        </div>
        <div className="detail__side">
          <KeyFacts title={`${d.name} at a glance`} facts={[['Duration', d.days], ['Price from', `${d.from} / person`], ['Best time', d.best], ['Getting there', d.reach]]} />
          <div className="office glass" itemScope itemType="https://schema.org/TravelAgency">
            <h2 className="facts__title">Book with our {office.city} office</h2>
            <p itemProp="name"><strong>Baba Travels &amp; Tours — {office.city}</strong></p>
            <p itemProp="address"><Icon name="MapPin" size={15} />{office.address}</p>
            <p><Icon name="Phone" size={15} /><a href={`tel:${office.phone.replace(/\s/g, '')}`} itemProp="telephone">{office.phone}</a></p>
            <p><Icon name="Clock" size={15} />{office.hours}</p>
          </div>
          <Link to={`/quote?service=tours&to=${encodeURIComponent(d.name)}`} className="btn btn--primary btn--block">Plan my {d.name} trip</Link>
        </div>
      </section>
      <section className="section container faqwrap">
        <SectionHead eyebrow="FAQ" title={`${d.name}: questions answered`} />
        <Faq items={faqs} idPrefix="dfaq" />
      </section>
      <section className="section">
        <div className="container"><SectionHead eyebrow="Nearby" title="Travellers also explore" /></div>
        <div className="hscroll">{DESTINATIONS.filter((x) => x.slug !== d.slug).map((x, i) => <DestCard key={x.slug} d={x} i={i} />)}</div>
      </section>
      <CtaBand />
    </>
  )
}
