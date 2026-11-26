import React from 'react'
import { Link, useParams } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { Breadcrumbs, SectionHead } from '../components/Chrome.jsx'
import { ServiceCard, PageHero, KeyFacts, Faq, CtaBand, Steps } from '../components/Blocks.jsx'
import { Seo, breadcrumbSchema, serviceSchema, faqSchema } from '../lib/seo.jsx'
import { SERVICES, FAQS } from '../data/site.js'
import NotFound from './NotFound.jsx'

const IMG = { 'air-tickets': 'skies', 'umrah-hajj-packages': 'umrah', 'holiday-tour-packages': 'hunza', 'visa-assistance': 'dubai', 'hotel-booking': 'islands', 'car-rental': 'hunza', 'airport-transfers': 'skies', 'intercity-coach-booking': 'hunza', 'corporate-travel': 'dubai', 'cargo-courier': 'skies' }

export function Services() {
  const crumbs = [{ label: 'Home', to: '/' }, { label: 'Services', to: '/services' }]
  return (
    <>
      <Seo title="Travel services: flights, Umrah, tours & visas" path="/services"
        description="All Baba Travels services: air tickets, Umrah and Hajj packages, holiday tours, visa assistance, hotels, car rental, airport transfers, coach booking, corporate travel and cargo."
        lcp="skies" schema={[breadcrumbSchema(crumbs)]} />
      <PageHero img="skies" eyebrow="Services" title="Ten travel services, one team" crumbs={<Breadcrumbs items={crumbs} />}>
        <p className="phero__lead">Book flights, Umrah, tours, visas and transport in one WhatsApp thread — with a single PKR invoice.</p>
      </PageHero>
      <section className="section container"><div className="bento">{SERVICES.map((s, i) => <ServiceCard key={s.slug} s={s} i={i} featured={i < 2} />)}</div></section>
      <CtaBand />
    </>
  )
}

export function ServiceDetail() {
  const { slug } = useParams()
  const s = SERVICES.find((x) => x.slug === slug)
  if (!s) return <NotFound />
  const crumbs = [{ label: 'Home', to: '/' }, { label: 'Services', to: '/services' }, { label: s.title, to: `/services/${s.slug}` }]
  const faqs = [
    { q: `How much does ${s.title.toLowerCase()} cost with Baba Travels?`, a: `${s.title} starts from ${s.facts.find(([k]) => /price/i.test(k))?.[1] || 'a clear PKR price'}. You get a full quote with taxes and fees in PKR within about 30 minutes.` },
    { q: `How do I book ${s.title.toLowerCase()}?`, a: 'Fill the quote form or message us on WhatsApp with your dates and travellers. Confirm the option you like, pay securely, and receive documents on WhatsApp and email.' },
    ...FAQS.slice(2, 4),
  ]
  const related = SERVICES.filter((x) => x.slug !== s.slug).slice(0, 3)
  return (
    <>
      <Seo title={`${s.title} from Pakistan`} path={`/services/${s.slug}`} description={s.summary.slice(0, 155)}
        image={`/images/hero/${IMG[s.slug]}-1280.webp`} lcp={IMG[s.slug]}
        schema={[serviceSchema(s), breadcrumbSchema(crumbs), faqSchema(faqs)]} />
      <PageHero img={IMG[s.slug]} eyebrow="Service" title={`${s.title} from Pakistan`} crumbs={<Breadcrumbs items={crumbs} />}>
        <div className="phero__ctas">
          <Link to={`/quote?service=${s.slug}`} className="btn btn--primary btn--lg">Get a quote<Icon name="ArrowRight" size={18} /></Link>
        </div>
      </PageHero>
      <section className="section container detail">
        <div className="detail__main">
          {/* Answer-first block (40–60 words) — extracted by AI Overviews, ChatGPT, Perplexity */}
          <h2 className="detail__h2">What is included in our {s.title.toLowerCase()} service?</h2>
          <p className="answer answer--boxed">{s.summary}</p>
          <h2 className="detail__h2">What you get</h2>
          <ul className="ticks">{s.includes.map((x) => <li key={x}><Icon name="Check" size={16} />{x}</li>)}</ul>
          <h2 className="detail__h2">How booking works</h2>
          <Steps vertical />
        </div>
        <div className="detail__side"><KeyFacts facts={s.facts} title={`${s.title}: key facts`} />
          <Link to={`/quote?service=${s.slug}`} className="btn btn--primary btn--block">Request this service</Link>
        </div>
      </section>
      <section className="section container faqwrap" aria-labelledby="sfaq">
        <SectionHead eyebrow="FAQ" id="sfaq" title={`${s.title}: common questions`} />
        <Faq items={faqs} idPrefix="sfaq" />
      </section>
      <section className="section container" aria-labelledby="rel">
        <SectionHead eyebrow="Related" id="rel" title="Often booked together" />
        <div className="bento bento--3">{related.map((r, i) => <ServiceCard key={r.slug} s={r} i={i} />)}</div>
      </section>
      <CtaBand />
    </>
  )
}
