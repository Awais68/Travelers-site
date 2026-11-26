import React from 'react'
import {
  Plane, Moon, Mountain, Stamp, BedDouble, Car, PlaneLanding, Bus, Briefcase, Package,
  ShieldCheck, Wallet, MessageCircle, Users, BadgePercent, Globe2, ArrowRight, ArrowUpRight,
  ChevronLeft, ChevronRight, ChevronDown, Menu, X, Sun, MoonStar, Phone, Mail, MapPin, Clock,
  Star, Search, CalendarDays, Check, Quote, Sparkles, Send, Facebook, Instagram, Youtube, Home,
} from 'lucide-react'

const MAP = {
  Plane, Moon, Mountain, Stamp, BedDouble, Car, PlaneLanding, Bus, Briefcase, Package,
  ShieldCheck, Wallet, MessageCircle, Users, BadgePercent, Globe2, ArrowRight, ArrowUpRight,
  ChevronLeft, ChevronRight, ChevronDown, Menu, X, Sun, MoonStar, Phone, Mail, MapPin, Clock,
  Star, Search, CalendarDays, Check, Quote, Sparkles, Send, Facebook, Instagram, Youtube, Home,
}

export default function Icon({ name, size = 20, ...rest }) {
  const C = MAP[name] || Sparkles
  return <C size={size} strokeWidth={1.75} aria-hidden="true" focusable="false" {...rest} />
}

export function WhatsAppIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.2-.6-.4zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4C2.7 15.6 2.2 13.8 2.2 12 2.2 6.6 6.6 2.2 12 2.2c2.6 0 5.1 1 6.9 2.9 1.8 1.8 2.9 4.3 2.9 6.9 0 5.4-4.4 9.8-9.8 9.8zm8.4-18.2C18.2 1.3 15.2 0 12 0 5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6c1.8 1 3.8 1.5 5.8 1.5 6.6 0 12-5.4 12-12 0-3.2-1.2-6.2-3.6-8.3z" />
    </svg>
  )
}

export function Logo() {
  return (
    <span className="logo">
      <img className="logo__img" src="/images/haque-logo.png" alt="Haque Travel & Tours"
        width="580" height="240" decoding="async" />
    </span>
  )
}
