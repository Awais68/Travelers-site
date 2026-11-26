import React from 'react'
import { Helmet } from 'react-helmet-async'
import { SITE, OFFICES } from '../data/site.js'

/**
 * <Seo> — one per page. Title, description, canonical, OG/Twitter, hreflang + JSON-LD.
 * Prerendered into static HTML at build, so crawlers and AI bots (GPTBot, PerplexityBot,
 * ClaudeBot, Google AI Overviews) read it without running JavaScript.
 */
export function Seo({ title, description, path = '/', image = '/images/hero/skies-1280.webp', lcp, schema = [], noindex }) {
  const url = SITE.url + path
  const fullTitle = path === '/' ? `${SITE.name} | ${SITE.tagline}` : `${title} | ${SITE.shortName}`
  const graphs = Array.isArray(schema) ? schema : [schema]
  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {/* Preload the LCP hero image so it starts downloading before the CSS/JS parse.
          Split by viewport to exactly match the hero's <picture>: phones load -m, larger
          screens load -1280. fetchpriority=high pulls it to the front of the queue. */}
      {lcp && <link rel="preload" as="image" href={`/images/hero/${lcp}-m.webp`} media="(max-width: 767px)" fetchpriority="high" />}
      {lcp && <link rel="preload" as="image" href={`/images/hero/${lcp}-1280.webp`} media="(min-width: 768px)" fetchpriority="high" />}
      <link rel="canonical" href={url} />
      <link rel="alternate" hrefLang="en-PK" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />
      {noindex && <meta name="robots" content="noindex,follow" />}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={SITE.url + image} />
      <meta property="og:locale" content="en_PK" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={SITE.url + image} />
      <meta name="geo.region" content="PK-SD" />
      <meta name="geo.placename" content="Karachi" />
      {graphs.filter(Boolean).map((g, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', ...g })}</script>
      ))}
    </Helmet>
  )
}

// ── Schema builders ──────────────────────────────────────────
export const orgSchema = () => ({
  '@type': 'TravelAgency',
  '@id': SITE.url + '/#org',
  name: SITE.name,
  url: SITE.url,
  logo: SITE.url + '/favicon.svg',
  image: SITE.url + '/images/hero/skies-1280.webp',
  description: SITE.description,
  telephone: SITE.phone,
  email: SITE.email,
  foundingDate: String(SITE.founded),
  priceRange: 'PKR 2,800 – PKR 540,000',
  areaServed: ['Pakistan', 'United Arab Emirates', 'Saudi Arabia', 'United Kingdom', 'Canada', 'Turkey', 'Malaysia'],
  address: { '@type': 'PostalAddress', streetAddress: OFFICES[0].address, addressLocality: 'Karachi', addressRegion: 'Sindh', addressCountry: 'PK' },
  geo: { '@type': 'GeoCoordinates', latitude: OFFICES[0].geo[0], longitude: OFFICES[0].geo[1] },
  openingHours: 'Mo-Sa 09:00-21:00',
  sameAs: Object.values(SITE.social),
  department: OFFICES.slice(1).map((o) => ({
    '@type': 'TravelAgency', name: `${SITE.name} — ${o.city}`, telephone: o.phone,
    address: { '@type': 'PostalAddress', streetAddress: o.address, addressLocality: o.city, addressCountry: o.country === 'UAE' ? 'AE' : 'PK' },
  })),
})

export const websiteSchema = () => ({
  '@type': 'WebSite', '@id': SITE.url + '/#website', url: SITE.url, name: SITE.name, inLanguage: 'en-PK',
  publisher: { '@id': SITE.url + '/#org' },
})

export const faqSchema = (faqs) => ({
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
})

export const breadcrumbSchema = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.label, item: SITE.url + it.to })),
})

export const serviceSchema = (s) => ({
  '@type': 'Service', name: s.title, description: s.summary, serviceType: s.title,
  provider: { '@id': SITE.url + '/#org' }, areaServed: { '@type': 'Country', name: 'Pakistan' },
  url: `${SITE.url}/services/${s.slug}`,
})

export const tripSchema = (d) => ({
  '@type': 'TouristTrip', name: `${d.name} tour package`, description: d.summary, touristType: ['Families', 'Couples', 'Groups'],
  itinerary: { '@type': 'ItemList', itemListElement: d.itinerary.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: `Day ${i + 1}: ${t}` })) },
  offers: { '@type': 'Offer', priceCurrency: 'PKR', price: d.from.replace(/[^0-9]/g, ''), availability: 'https://schema.org/InStock', url: `${SITE.url}/destinations/${d.slug}` },
  provider: { '@id': SITE.url + '/#org' },
})

export const articleSchema = (p) => ({
  '@type': 'Article', headline: p.title, description: p.excerpt, dateModified: p.updated, datePublished: p.updated,
  author: { '@type': 'Organization', name: p.author }, publisher: { '@id': SITE.url + '/#org' },
  image: `${SITE.url}/images/hero/${p.img}-1280.webp`, mainEntityOfPage: `${SITE.url}/blog/${p.slug}`,
})
