import React, { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Icon, { WhatsAppIcon } from '../components/Icon.jsx'
import { Breadcrumbs, waLink } from '../components/Chrome.jsx'
import { Seo, breadcrumbSchema } from '../lib/seo.jsx'
import { submitLead } from '../lib/api.js'

const SERVICES = [
  ['flights', 'Air tickets', 'Plane'], ['umrah', 'Umrah / Hajj', 'Moon'], ['tours', 'Holiday tour', 'Mountain'],
  ['visa', 'Visa', 'Stamp'], ['hotel', 'Hotel', 'BedDouble'], ['car', 'Car / transfer', 'Car'],
]
const STEPS = ['Service', 'Trip', 'Travellers', 'Contact']

export default function Quote() {
  const { search } = useLocation()
  const pre = useMemo(() => Object.fromEntries(new URLSearchParams(search)), [search])
  const [step, setStep] = useState(0)
  const [data, setData] = useState({ service: SERVICES.find(([id]) => id === pre.service)?.[0] || 'umrah', from: pre.from || '', to: pre.to || '', date: pre.date || '', adults: '2', children: '0', budget: 'Standard', name: '', phone: '', email: '', notes: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const set = (k) => (e) => setData((d) => ({ ...d, [k]: e.target.value }))
  const crumbs = [{ label: 'Home', to: '/' }, { label: 'Get a quote', to: '/quote' }]

  const validate = () => {
    const e = {}
    if (step === 1 && !data.to.trim()) e.to = 'Tell us where you’d like to go'
    if (step === 3) {
      if (!data.name.trim()) e.name = 'Please add your name'
      if (!/^[+\d][\d\s-]{8,}$/.test(data.phone.trim())) e.phone = 'Enter a valid phone / WhatsApp number'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }
  const nextStep = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    if (step < 3) return setStep(step + 1)
    setStatus('sending')
    try { await submitLead({ type: 'quote', ...data }); setStatus('sent') } catch { setStatus('error') }
  }

  return (
    <>
      <Seo title="Get a free travel quote" path="/quote" description="Request a free quote for flights, Umrah, tours, visas, hotels or car rental. Clear PKR prices from a Baba Travels advisor in about 30 minutes." schema={[breadcrumbSchema(crumbs)]} />
      <section className="quote container">
        <Breadcrumbs items={crumbs} />
        <div className="quote__grid">
          <div className="quote__intro">
            <span className="eyebrow">Free quote</span>
            <h1 className="quote__title">Tell us the trip. <em>We’ll do the rest.</em></h1>
            <p className="answer">Share four quick details and a Baba Travels advisor sends 2–3 options with full PKR prices — usually within 30 minutes during office hours. No booking fee, no obligation.</p>
            <a href={waLink()} className="btn btn--wa"><WhatsAppIcon />Prefer WhatsApp?</a>
          </div>

          <form className="qform glass" onSubmit={nextStep} noValidate>
            {status === 'sent' ? (
              <div className="success">
                <span className="success__tick"><Icon name="Check" size={30} /></span>
                <h2>Request received, {data.name.split(' ')[0]}!</h2>
                <p>We’ll WhatsApp you at <b>{data.phone}</b> with your options shortly.</p>
              </div>
            ) : (<>
              <div className="qprog" aria-label={`Step ${step + 1} of 4`}>
                <div className="qprog__bar"><span style={{ transform: `scaleX(${(step + 1) / 4})` }} /></div>
                <ol>{STEPS.map((s, i) => <li key={s} className={i <= step ? 'is-done' : ''} aria-current={i === step ? 'step' : undefined}><span>{i + 1}</span>{s}</li>)}</ol>
              </div>
              <div className="qstep" key={step}>
                {step === 0 && (<fieldset><legend className="qstep__q">What would you like to book?</legend>
                  <div className="choices">{SERVICES.map(([id, label, icon]) => (
                    <label key={id} className={`choice ${data.service === id ? 'is-on' : ''}`}>
                      <input type="radio" name="service" value={id} checked={data.service === id} onChange={set('service')} />
                      <Icon name={icon} size={22} /><span>{label}</span>
                    </label>))}</div></fieldset>)}
                {step === 1 && (<fieldset><legend className="qstep__q">Where and when?</legend>
                  <div className="cform__row">
                    <label className="field"><span className="field__label">From</span><input value={data.from} onChange={set('from')} placeholder="Karachi" /></label>
                    <label className={`field ${errors.to ? 'has-error' : ''}`}><span className="field__label">To *</span><input value={data.to} onChange={set('to')} placeholder="Makkah, Hunza, Dubai…" aria-invalid={!!errors.to} aria-describedby="e-to" />{errors.to && <span className="field__err" id="e-to">{errors.to}</span>}</label>
                  </div>
                  <label className="field"><span className="field__label">Travel date</span><input type="date" value={data.date} onChange={set('date')} /></label></fieldset>)}
                {step === 2 && (<fieldset><legend className="qstep__q">Who’s travelling?</legend>
                  <div className="cform__row">
                    <label className="field"><span className="field__label">Adults</span><input type="number" min="1" value={data.adults} onChange={set('adults')} /></label>
                    <label className="field"><span className="field__label">Children</span><input type="number" min="0" value={data.children} onChange={set('children')} /></label>
                  </div>
                  <div className="choices choices--3">{['Economy', 'Standard', 'Premium'].map((b) => (
                    <label key={b} className={`choice ${data.budget === b ? 'is-on' : ''}`}><input type="radio" name="budget" value={b} checked={data.budget === b} onChange={set('budget')} /><span>{b}</span></label>))}</div></fieldset>)}
                {step === 3 && (<fieldset><legend className="qstep__q">Where should we send options?</legend>
                  <label className={`field ${errors.name ? 'has-error' : ''}`}><span className="field__label">Full name *</span><input value={data.name} onChange={set('name')} autoComplete="name" aria-invalid={!!errors.name} />{errors.name && <span className="field__err">{errors.name}</span>}</label>
                  <div className="cform__row">
                    <label className={`field ${errors.phone ? 'has-error' : ''}`}><span className="field__label">WhatsApp *</span><input value={data.phone} onChange={set('phone')} type="tel" autoComplete="tel" placeholder="+92 3xx xxxxxxx" aria-invalid={!!errors.phone} />{errors.phone && <span className="field__err">{errors.phone}</span>}</label>
                    <label className="field"><span className="field__label">Email</span><input value={data.email} onChange={set('email')} type="email" autoComplete="email" /></label>
                  </div>
                  <label className="field"><span className="field__label">Anything else?</span><textarea rows="3" value={data.notes} onChange={set('notes')} placeholder="Wheelchair help, hotel distance, budget…" /></label></fieldset>)}
              </div>
              {status === 'error' && <p className="field__err" role="alert">Couldn’t send — please try again or WhatsApp us.</p>}
              <div className="qnav">
                {step > 0 ? <button type="button" className="btn btn--ghost" onClick={() => setStep(step - 1)}><Icon name="ChevronLeft" size={18} />Back</button> : <span />}
                <button className="btn btn--primary btn--lg" disabled={status === 'sending'}>{step < 3 ? 'Continue' : status === 'sending' ? 'Sending…' : 'Get my quote'}<Icon name="ArrowRight" size={18} /></button>
              </div>
            </>)}
          </form>
        </div>
      </section>
    </>
  )
}
