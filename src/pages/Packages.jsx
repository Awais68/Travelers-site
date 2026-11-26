import React, { useState } from 'react'
import { Breadcrumbs } from '../components/Chrome.jsx'
import { PackageCard, PageHero, CtaBand } from '../components/Blocks.jsx'
import { Seo, breadcrumbSchema } from '../lib/seo.jsx'
import { PACKAGES, SITE } from '../data/site.js'

const CATS = ['All', 'Umrah', 'Northern Pakistan', 'International']
export default function Packages() {
  const [cat, setCat] = useState('All')
  const crumbs = [{ label: 'Home', to: '/' }, { label: 'Packages', to: '/packages' }]
  const list = cat === 'All' ? PACKAGES : PACKAGES.filter((p) => p.cat === cat)
  const itemList = { '@type': 'ItemList', itemListElement: PACKAGES.map((p, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'TouristTrip', name: p.title, offers: { '@type': 'Offer', priceCurrency: 'PKR', price: p.price.replace(/[^0-9]/g, '') } } })) }
  return (
    <>
      <Seo title="Umrah, northern Pakistan & international tour packages" path="/packages"
        description="Compare Umrah packages, Hunza and Skardu tours and international holidays from Pakistan with clear PKR prices per person." lcp="hunza" schema={[breadcrumbSchema(crumbs), itemList]} />
      <PageHero img="hunza" eyebrow="Packages" title="Tour & Umrah packages with clear PKR prices" crumbs={<Breadcrumbs items={crumbs} />}>
        <p className="phero__lead">Prices are per person on sharing basis and include taxes. Custom dates? {SITE.shortName} tailors any package.</p>
      </PageHero>
      <section className="section container">
        <div className="filters" role="tablist" aria-label="Filter packages">
          {CATS.map((c) => <button key={c} role="tab" aria-selected={cat === c} className={`filter ${cat === c ? 'is-active' : ''}`} onClick={() => setCat(c)}>{c}</button>)}
        </div>
        <div className="pgrid" key={cat}>{list.map((p, i) => <PackageCard key={p.id} p={p} i={i} />)}</div>
      </section>
      <CtaBand />
    </>
  )
}
