import React from 'react'
import { Link } from 'react-router-dom'
import { Seo } from '../lib/seo.jsx'

export default function NotFound() {
  return (
    <section className="nf container">
      <Seo title="Page not found" path="/404" description="This page doesn’t exist." noindex />
      <p className="nf__code" aria-hidden="true">404</p>
      <h1>This route isn’t on our map.</h1>
      <p>The page may have moved. Try our packages or ask us on WhatsApp.</p>
      <div className="phero__ctas"><Link to="/" className="btn btn--primary">Back home</Link><Link to="/packages" className="btn btn--ghost">See packages</Link></div>
    </section>
  )
}
