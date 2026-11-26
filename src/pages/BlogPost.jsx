import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Breadcrumbs } from '../components/Chrome.jsx'
import { PageHero, CtaBand } from '../components/Blocks.jsx'
import { Seo, breadcrumbSchema, articleSchema } from '../lib/seo.jsx'
import { POSTS } from '../data/site.js'
import NotFound from './NotFound.jsx'

export default function BlogPost() {
  const { slug } = useParams()
  const p = POSTS.find((x) => x.slug === slug)
  if (!p) return <NotFound />
  const crumbs = [{ label: 'Home', to: '/' }, { label: 'Guides', to: '/blog/' + POSTS[0].slug }, { label: p.title, to: `/blog/${p.slug}` }]
  const date = new Date(p.updated).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  return (
    <>
      <Seo title={p.title} path={`/blog/${p.slug}`} description={p.excerpt} image={`/images/hero/${p.img}-1280.webp`} lcp={p.img} schema={[articleSchema(p), breadcrumbSchema(crumbs)]} />
      <PageHero img={p.img} eyebrow="Travel guide" title={p.title} crumbs={<Breadcrumbs items={crumbs} />}>
        <p className="phero__lead byline">By {p.author} · Last updated <time dateTime={p.updated}>{date}</time> · {p.read} read</p>
      </PageHero>
      <article className="section container article">
        <p className="answer answer--boxed"><strong>In short:</strong> {p.excerpt} This guide is maintained by the {p.author} and reviewed every season so prices, visa rules and timings stay current.</p>
        <h2>Before you book</h2>
        <p className="prose">Full article content goes here — write it as short sections with question-style H2s (“How long does…”, “What does it cost…”) so search engines and AI assistants can quote individual answers.</p>
        <h2>Need help planning?</h2>
        <p className="prose">Our advisors can turn this guide into a priced itinerary. <Link to="/quote">Request a free quote</Link>.</p>
      </article>
      <CtaBand />
    </>
  )
}
