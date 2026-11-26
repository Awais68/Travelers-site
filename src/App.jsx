import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import { Footer, MobileBar, WhatsAppFab } from './components/Chrome.jsx'
import { useRevealAll } from './lib/hooks.js'
import Home from './pages/Home.jsx'
import { Services, ServiceDetail } from './pages/Services.jsx'
import Packages from './pages/Packages.jsx'
import Destination from './pages/Destination.jsx'
import { About, Contact } from './pages/Company.jsx'
import Quote from './pages/Quote.jsx'
import BlogPost from './pages/BlogPost.jsx'
import NotFound from './pages/NotFound.jsx'
import './styles/tokens.css'
import './styles/base.css'
import './styles/components.css'
import './styles/sections.css'

export default function App() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  useRevealAll(pathname)
  return (
    <>
      <Navbar />
      <main id="main" className="page" key={pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/destinations/:slug" element={<Destination />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <MobileBar />
      <WhatsAppFab />
    </>
  )
}
