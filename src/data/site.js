// ─────────────────────────────────────────────────────────────
// Single source of truth for all business content.
// Everything marked CONFIRM is a placeholder: replace with the client's real data
// before launch (NAP data must match Google Business Profile exactly for local SEO).
// ─────────────────────────────────────────────────────────────

export const SITE = {
  name: 'Baba Travels & Tours',
  shortName: 'Baba Travels',
  url: 'https://www.babatravels.pk', // CONFIRM production domain
  tagline: 'Flights, Umrah & tours — planned in Pakistan, trusted worldwide',
  description:
    'Baba Travels & Tours is a Pakistan-based travel agency for air tickets, Umrah and Hajj packages, northern-area and international tours, visa assistance, hotels, car rental and airport transfers.',
  phone: '+92 300 0000000', // CONFIRM
  phoneHref: '+923000000000', // CONFIRM
  whatsapp: '923000000000', // CONFIRM (international format, no +)
  email: 'info@babatravels.pk', // CONFIRM
  founded: 2010, // CONFIRM
  hours: 'Mon–Sat 9:00–21:00 PKT · WhatsApp 24/7', // CONFIRM
  social: {
    facebook: 'https://facebook.com/', // CONFIRM
    instagram: 'https://instagram.com/', // CONFIRM
    youtube: 'https://youtube.com/', // CONFIRM
    tiktok: 'https://tiktok.com/', // CONFIRM
  },
  rating: { value: 4.9, count: 1280 }, // CONFIRM from Google reviews
}

export const OFFICES = [
  // CONFIRM all addresses / phones / geo
  { id: 'karachi', city: 'Karachi', country: 'Pakistan', label: 'Head office', address: 'Office 12, Shahrah-e-Faisal, Karachi 75400', phone: '+92 21 0000 0000', hours: 'Mon–Sat 9:00–21:00', geo: [24.8607, 67.0011] },
  { id: 'lahore', city: 'Lahore', country: 'Pakistan', label: 'Branch', address: 'Main Boulevard, Gulberg III, Lahore 54660', phone: '+92 42 0000 0000', hours: 'Mon–Sat 10:00–20:00', geo: [31.5204, 74.3587] },
  { id: 'islamabad', city: 'Islamabad', country: 'Pakistan', label: 'Branch', address: 'Blue Area, Jinnah Avenue, Islamabad 44000', phone: '+92 51 0000 0000', hours: 'Mon–Sat 10:00–20:00', geo: [33.6844, 73.0479] },
  { id: 'dubai', city: 'Dubai', country: 'UAE', label: 'Partner desk', address: 'Al Karama, Dubai, UAE', phone: '+971 4 000 0000', hours: 'Sun–Fri 10:00–19:00', geo: [25.2048, 55.2708] },
]

const img = (name) => ({
  d1920: `images/hero/${name}-1920.webp`,
  d1280: `images/hero/${name}-1280.webp`,
  mobile: `images/hero/${name}-m.webp`,
  thumb: `images/hero/${name}-thumb.webp`,
})

// Hero slides — swap images in /public/images/hero (keep the same file names)
export const HERO_SLIDES = [
  { id: 'hunza', place: 'Hunza Valley · Gilgit-Baltistan', title: 'Wake up beside the mountains of the north', from: 'PKR 54,900', meta: '6 days · Northern tours', to: '/destinations/hunza-valley', img: img('hunza'), alt: 'Golden-hour light over snow-capped peaks and a calm lake in Hunza Valley' },
  { id: 'umrah', place: 'Makkah & Madinah', title: 'Umrah, arranged with care from start to finish', from: 'PKR 289,000', meta: '14 & 21 nights · Umrah', to: '/services/umrah-hajj-packages', img: img('umrah'), alt: 'The Kaaba at night in the Grand Mosque of Makkah, ringed by worshippers beneath lit minarets' },
  { id: 'dubai', place: 'Dubai · United Arab Emirates', title: 'City lights, desert sunsets, one easy visa', from: 'PKR 119,000', meta: '4 nights · Visa + hotel', to: '/destinations/dubai', img: img('dubai'), alt: 'Downtown Dubai skyline at dusk, the Burj Khalifa rising above highway light trails' },
  { id: 'skies', place: '60+ countries · Air tickets', title: 'Every airline, every route, one fair fare', from: 'PKR 38,500', meta: 'Domestic & international', to: '/services/air-tickets', img: img('skies'), alt: 'Passenger jet flying above golden sunrise clouds' },
  { id: 'islands', place: 'Maldives · Bali · Langkawi', title: 'Turquoise water, honeymoon quiet', from: 'PKR 245,000', meta: '5 nights · Holidays', to: '/destinations/maldives', img: img('islands'), alt: 'A calm beach and sea glowing at golden sunset' },
]

export const SERVICES = [
  {
    slug: 'air-tickets', icon: 'Plane', title: 'Air tickets', short: 'Domestic & international fares on every major airline, with 24/7 rebooking help.',
    summary: 'Baba Travels books domestic and international air tickets from Pakistan on PIA, Emirates, Qatar Airways, Saudia, Turkish Airlines and 40+ other carriers. We compare fares across airlines, hold seats while you decide, and handle date changes, refunds and baggage add-ons on WhatsApp, 24 hours a day.',
    facts: [['Coverage', '60+ countries, all Pakistani airports'], ['Airlines', 'PIA, Emirates, Qatar, Saudia, Turkish + 40 more'], ['Booking time', 'E-ticket in 15–30 minutes'], ['Price from', 'PKR 38,500 return (KHI–DXB)'], ['Payment', 'Bank transfer, card, JazzCash, Easypaisa'], ['Support', '24/7 WhatsApp for changes']],
    includes: ['Fare comparison across 40+ airlines', 'Seat hold while you confirm', 'Group & student fares', 'Date change and refund handling', 'Extra baggage and meal requests'],
  },
  {
    slug: 'umrah-hajj-packages', icon: 'Moon', title: 'Umrah & Hajj packages', short: 'Visa, flights, Haram-close hotels and ziyarat — one package, one team.',
    summary: 'Our Umrah packages from Pakistan include the Umrah visa, return flights, hotels in Makkah and Madinah at your chosen distance from the Haram, airport and intercity transport, and guided ziyarat. Packages run 7 to 28 nights, start from PKR 289,000 per person, and can be customised for families.',
    facts: [['Duration', '7, 14, 21 or 28 nights'], ['Hotels', '3★ to 5★, 150 m – 1 km from Haram'], ['Includes', 'Visa, flights, hotels, transport, ziyarat'], ['Price from', 'PKR 289,000 per person (sharing)'], ['Departures', 'Karachi, Lahore, Islamabad, Multan, Peshawar'], ['Support', 'Saudi-side helpline 24/7']],
    includes: ['Umrah visa processing', 'Return flights from 5 Pakistani cities', 'Makkah & Madinah hotels', 'Private or shared transport', 'Ziyarat with guide', 'Pre-departure briefing'],
  },
  {
    slug: 'holiday-tour-packages', icon: 'Mountain', title: 'Holiday tour packages', short: 'Northern Pakistan and international holidays, from budget to luxury.',
    summary: 'We plan guided holiday packages to Hunza, Skardu, Swat, Naran-Kaghan and Neelum Valley, plus international trips to Dubai, Turkey, Malaysia, Thailand, Azerbaijan and the Maldives. Each package bundles transport, hotels, meals and a local guide, with fixed departures every week and private family tours on request.',
    facts: [['Domestic', 'Hunza, Skardu, Swat, Naran, Neelum'], ['International', 'Dubai, Turkey, Malaysia, Thailand, Baku, Maldives'], ['Duration', '3 to 12 days'], ['Price from', 'PKR 29,900 per person'], ['Group size', 'Private or 8–20 traveller groups'], ['Best season', 'Apr–Oct (north), all year (abroad)']],
    includes: ['Hotels & meals', 'AC coaster or private car', 'Local guide', 'Sightseeing entry tickets', 'Travel insurance on request'],
  },
  {
    slug: 'visa-assistance', icon: 'Stamp', title: 'Visa assistance', short: 'Document checklists, appointments and filing for 40+ countries.',
    summary: 'Our visa team prepares and files tourist, visit and business visa applications for UAE, Saudi Arabia, Turkey, UK, Schengen, Malaysia, Thailand and 30+ more countries. We give you a document checklist, book biometrics appointments, draft cover letters and track your file until the passport is back.',
    facts: [['Countries', '40+ destinations'], ['Visa types', 'Tourist, visit, business, Umrah'], ['UAE visa time', '3–5 working days'], ['Service fee from', 'PKR 4,500'], ['Approval rate', 'High, with complete files'], ['Tracking', 'WhatsApp updates at each step']],
    includes: ['Eligibility check', 'Personal document checklist', 'Appointment booking', 'Cover letter & itinerary', 'Hotel & flight reservations for file'],
  },
  {
    slug: 'hotel-booking', icon: 'BedDouble', title: 'Hotel booking', short: 'Negotiated rates in Pakistan, the Gulf and beyond.',
    summary: 'We book hotels across Pakistan and abroad at negotiated rates, from budget guest houses in Hunza to 5-star stays in Dubai and Istanbul. Rooms are confirmed in writing, and we can pay in PKR on your behalf, which avoids card fees and exchange surprises.',
    facts: [['Properties', '25,000+ worldwide'], ['Pay in', 'PKR'], ['Confirmation', 'Written voucher in 1 hour'], ['Price from', 'PKR 6,500 / night'], ['Free changes', 'On flexible rates'], ['Support', '24/7']],
    includes: ['Negotiated rates', 'Room-type advice', 'Early check-in requests', 'Group blocks'],
  },
  {
    slug: 'car-rental', icon: 'Car', title: 'Car rental & chauffeur', short: 'Sedans, SUVs and coasters with experienced drivers.',
    summary: 'Rent a car with driver in Karachi, Lahore, Islamabad and for northern tours. Choose from sedans, Prado and Land Cruiser SUVs, Grand Cabin vans and 22-seat coasters. Prices include the driver and fuel within city limits; outstation tours are quoted per day.',
    facts: [['Cities', 'Karachi, Lahore, Islamabad + north'], ['Fleet', 'Sedan, SUV, Grand Cabin, Coaster'], ['Price from', 'PKR 9,500 / day with driver'], ['Booking', 'Same day'], ['Drivers', 'Vetted, tour-experienced']],
    includes: ['Professional driver', 'Fuel within city', 'Toll & parking (outstation quoted)', 'Clean, insured vehicles'],
  },
  {
    slug: 'airport-transfers', icon: 'PlaneLanding', title: 'Airport transfers', short: 'Meet-and-greet pickups at KHI, LHE, ISB, JED, MED and DXB.',
    summary: 'Our drivers meet you in arrivals with a name board and track your flight, so a delay never leaves you waiting. Transfers run 24/7 at Karachi, Lahore and Islamabad airports, and at Jeddah, Madinah and Dubai for our Umrah and holiday travellers.',
    facts: [['Airports', 'KHI, LHE, ISB, JED, MED, DXB'], ['Availability', '24/7'], ['Price from', 'PKR 4,500 one way'], ['Flight tracking', 'Included'], ['Free waiting', '60 minutes']],
    includes: ['Name-board meet & greet', 'Flight tracking', 'Luggage help', 'Child seats on request'],
  },
  {
    slug: 'intercity-coach-booking', icon: 'Bus', title: 'Intercity coach booking', short: 'Seats on premium coaches between 30+ Pakistani cities.',
    summary: 'Book seats on premium intercity coaches between Karachi, Lahore, Islamabad, Multan, Peshawar, Faisalabad and 25+ other cities. We confirm your seat, share boarding details on WhatsApp, and can add a pickup to the terminal.',
    facts: [['Routes', '30+ cities'], ['Classes', 'Executive, business, sleeper'], ['Price from', 'PKR 2,800'], ['Confirmation', 'Instant on WhatsApp']],
    includes: ['Seat selection', 'Terminal pickup add-on', 'Group bookings'],
  },
  {
    slug: 'corporate-travel', icon: 'Briefcase', title: 'Corporate travel', short: 'Monthly invoicing, policy control and a dedicated travel desk.',
    summary: 'Baba Travels runs travel for companies with a dedicated account manager, monthly invoicing, approval workflows and negotiated airline and hotel rates. We handle conferences, team trips and executive travel, and send a monthly spend report for finance.',
    facts: [['Billing', 'Monthly credit invoicing'], ['Desk', 'Dedicated account manager'], ['Reports', 'Monthly spend report'], ['Setup time', '2 working days']],
    includes: ['Policy-based booking', 'Negotiated rates', 'MICE & conferences', 'Visa desk for staff'],
  },
  {
    slug: 'cargo-courier', icon: 'Package', title: 'Cargo & courier', short: 'Send parcels and excess baggage between Pakistan and the Gulf, UK & beyond.',
    summary: 'Send documents, parcels and unaccompanied baggage between Pakistan and the UAE, Saudi Arabia, the UK, Canada and the US. We collect from your door, handle customs paperwork and share tracking updates until delivery.',
    facts: [['Lanes', 'PK ↔ UAE, KSA, UK, CA, US'], ['Transit', '3–10 working days'], ['Price from', 'PKR 2,200 / kg'], ['Pickup', 'Door collection in major cities']],
    includes: ['Door pickup', 'Customs paperwork', 'Tracking updates', 'Packing on request'],
  },
]

export const PACKAGES = [
  { id: 'umrah-economy', cat: 'Umrah', title: 'Economy Umrah', nights: '14 nights', hotel: '3★ · 800 m from Haram', price: 'PKR 289,000', badge: null, perks: ['Visa + return flights', 'Shared transport', 'Ziyarat Makkah & Madinah'] },
  { id: 'umrah-standard', cat: 'Umrah', title: 'Family Umrah', nights: '21 nights', hotel: '4★ · 400 m from Haram', price: 'PKR 365,000', badge: 'Most booked', perks: ['Visa + direct flights', 'Private family transport', 'Guided ziyarat + briefing'] },
  { id: 'umrah-premium', cat: 'Umrah', title: 'Premium Umrah', nights: '14 nights', hotel: '5★ · Haram-facing', price: 'PKR 540,000', badge: 'Premium', perks: ['Visa + business-class option', 'GMC private transport', 'Dedicated Saudi-side host'] },
  { id: 'hunza-6d', cat: 'Northern Pakistan', title: 'Hunza & Khunjerab', nights: '6 days', hotel: 'Hotels + breakfast & dinner', price: 'PKR 54,900', badge: 'Weekly departures', perks: ['Attabad Lake & Passu Cones', 'Khunjerab Pass (China border)', 'AC coaster from Islamabad'] },
  { id: 'skardu-7d', cat: 'Northern Pakistan', title: 'Skardu & Deosai', nights: '7 days', hotel: 'Hotels + meals', price: 'PKR 69,500', badge: null, perks: ['Shangrila & Upper Kachura', 'Deosai Plains jeep safari', 'Flights or road option'] },
  { id: 'dubai-4n', cat: 'International', title: 'Dubai Getaway', nights: '4 nights', hotel: '4★ · Downtown/Deira', price: 'PKR 119,000', badge: 'Visa included', perks: ['UAE visit visa', 'Desert safari + dhow cruise', 'Airport transfers'] },
  { id: 'turkey-7n', cat: 'International', title: 'Istanbul & Cappadocia', nights: '7 nights', hotel: '4★ hotels', price: 'PKR 315,000', badge: null, perks: ['Bosphorus cruise', 'Cappadocia balloon option', 'Domestic flight included'] },
  { id: 'maldives-5n', cat: 'International', title: 'Maldives Honeymoon', nights: '5 nights', hotel: 'Water villa option', price: 'PKR 245,000', badge: 'Honeymoon', perks: ['Speedboat transfers', 'Half board', 'Sunset cruise'] },
]

export const DESTINATIONS = [
  {
    slug: 'hunza-valley', name: 'Hunza Valley', region: 'Gilgit-Baltistan, Pakistan', img: 'hunza', from: 'PKR 54,900', days: '5–7 days',
    summary: 'A Hunza Valley tour from Islamabad takes 5 to 7 days by road along the Karakoram Highway, or 4 days if you fly to Gilgit. Packages from PKR 54,900 per person include hotels, meals, an AC coaster and a guide, and cover Karimabad, Attabad Lake, Passu Cones and the Khunjerab Pass. The best time to visit is April to October.',
    best: 'April–October (blossoms in April, autumn colour in late October)', reach: 'Road from Islamabad via KKH (~16 h over 2 days) or flight to Gilgit + 2 h drive',
    highlights: ['Baltit & Altit Forts', 'Attabad Lake boating', 'Passu Cones & suspension bridge', 'Khunjerab Pass at 4,693 m', 'Eagle’s Nest sunset'],
    itinerary: ['Islamabad → Naran or Chilas', 'Drive to Hunza via Karakoram Highway', 'Karimabad: Baltit & Altit Forts, Eagle’s Nest', 'Attabad Lake, Passu, Khunjerab Pass', 'Hunza → Chilas / Besham', 'Return to Islamabad'],
    nearby: ['skardu', 'swat'],
  },
  {
    slug: 'skardu', name: 'Skardu', region: 'Gilgit-Baltistan, Pakistan', img: 'hunza', tone: { objectPosition: '18% 50%', filter: 'hue-rotate(-28deg) saturate(1.15)' }, from: 'PKR 69,500', days: '6–8 days',
    summary: 'Skardu is the gateway to Deosai, Shangrila and the Karakoram, reachable by a 1-hour flight from Islamabad or two days by road. A 7-day Skardu package from PKR 69,500 includes hotels, meals and a jeep safari to the Deosai Plains, open June to September.',
    best: 'May–October (Deosai open June–September)', reach: '1-hour flight from Islamabad, or 2 days by road via KKH',
    highlights: ['Shangrila Resort', 'Upper Kachura Lake', 'Deosai Plains', 'Cold Desert at Katpana', 'Manthokha Waterfall'],
    itinerary: ['Fly Islamabad → Skardu', 'Shangrila & Upper Kachura', 'Deosai Plains jeep safari', 'Shigar Fort & Cold Desert', 'Khaplu Palace', 'Return flight'],
    nearby: ['hunza-valley', 'swat'],
  },
  {
    slug: 'swat', name: 'Swat & Kalam', region: 'Khyber Pakhtunkhwa, Pakistan', img: 'hunza', tone: { objectPosition: '88% 50%', filter: 'hue-rotate(75deg) saturate(.9)' }, from: 'PKR 29,900', days: '3–4 days',
    summary: 'A Swat and Kalam tour runs 3 to 4 days from Islamabad or Lahore, covering Malam Jabba, Mingora, Kalam and Mahodand Lake. Packages start at PKR 29,900 per person with hotel, meals and transport, and are ideal for families and first-time visitors to the north.',
    best: 'April–October; Malam Jabba for snow in December–February', reach: '5–6 hours by road from Islamabad via Swat Motorway',
    highlights: ['Malam Jabba chairlift', 'Kalam valley', 'Mahodand Lake', 'Ushu Forest'],
    itinerary: ['Islamabad → Swat via motorway', 'Malam Jabba', 'Kalam & Ushu Forest', 'Mahodand Lake → return'],
    nearby: ['hunza-valley', 'skardu'],
  },
  {
    slug: 'dubai', name: 'Dubai', region: 'United Arab Emirates', img: 'dubai', from: 'PKR 119,000', days: '4–5 nights',
    summary: 'A Dubai holiday package from Pakistan costs from PKR 119,000 per person for 4 nights and includes the UAE visit visa, return flights from Karachi, Lahore or Islamabad, a 4-star hotel, desert safari and dhow cruise. Visas are usually processed in 3 to 5 working days.',
    best: 'November–March for pleasant weather', reach: '2–3.5 hour direct flights from all major Pakistani airports',
    highlights: ['Burj Khalifa observation deck', 'Desert safari', 'Dhow cruise dinner', 'Dubai Mall & Old Souk'],
    itinerary: ['Arrival & transfer', 'City tour + Burj Khalifa', 'Desert safari', 'Free day / Abu Dhabi option', 'Departure'],
    nearby: ['maldives', 'hunza-valley'],
  },
  {
    slug: 'maldives', name: 'Maldives', region: 'Indian Ocean', img: 'islands', from: 'PKR 245,000', days: '4–6 nights',
    summary: 'A Maldives honeymoon package from Pakistan starts at PKR 245,000 per person for 5 nights, with flights via Dubai or Colombo, a beach or water villa, half-board meals and speedboat transfers. Pakistani passport holders receive a free 30-day visa on arrival.',
    best: 'November–April (dry season)', reach: '1 stop via Dubai, Doha or Colombo, ~8–10 hours',
    highlights: ['Water villa stay', 'Snorkelling house reefs', 'Sunset dolphin cruise', 'Sandbank picnic'],
    itinerary: ['Arrive Malé + speedboat', 'Resort & reef snorkelling', 'Sunset cruise', 'Sandbank picnic', 'Departure'],
    nearby: ['dubai', 'skardu'],
  },
]

export const STEPS = [
  { title: 'Tell us your plan', text: 'Share dates, budget and travellers through the form or WhatsApp — it takes two minutes.' },
  { title: 'Get options in 30 minutes', text: 'A travel advisor sends 2–3 clear options with total prices in PKR, no hidden fees.' },
  { title: 'Confirm & pay securely', text: 'Pay by bank transfer, card or mobile wallet. Tickets and vouchers arrive on WhatsApp and email.' },
  { title: 'Travel with backup', text: 'A real person answers 24/7 on WhatsApp while you travel, from flight delays to hotel changes.' },
]

export const STATS = [
  // CONFIRM all figures with client
  { value: 15, suffix: '+', label: 'Years in travel' },
  { value: 48000, suffix: '+', label: 'Travellers served' },
  { value: 60, suffix: '+', label: 'Countries covered' },
  { value: 4.9, suffix: '★', label: 'Average rating', decimals: 1 },
]

export const WHY = [
  { icon: 'ShieldCheck', title: 'Licensed & accountable', text: 'Registered with the Department of Tourist Services and IATA-accredited ticketing. (CONFIRM licence numbers)' },
  { icon: 'Wallet', title: 'Clear PKR pricing', text: 'Every quote shows the full price in rupees — taxes, visa and transfers included.' },
  { icon: 'MessageCircle', title: 'Humans on WhatsApp, 24/7', text: 'Message us at 3 a.m. from Jeddah airport and a real advisor replies.' },
  { icon: 'Users', title: 'Family-first planning', text: 'Wheelchair help, elderly-friendly hotels and mahram-aware Umrah groups.' },
  { icon: 'BadgePercent', title: 'Negotiated rates', text: 'Direct contracts with airlines and hotels mean better fares than DIY booking.' },
  { icon: 'Globe2', title: 'Local here, local there', text: 'Partner desks in Dubai, Jeddah and Istanbul handle problems on the ground.' },
]

export const TESTIMONIALS = [
  // CONFIRM: replace with real, consented reviews
  { name: 'Ayesha R.', city: 'Karachi', trip: 'Family Umrah, 21 nights', rating: 5, text: 'They handled my parents’ wheelchair assistance at both airports and the hotel was a short walk from the Haram. My father still talks about it.' },
  { name: 'Hamza Q.', city: 'Lahore', trip: 'Hunza & Khunjerab', rating: 5, text: 'Driver was careful on the KKH, hotels were clean and the guide knew every stop. Worth every rupee.' },
  { name: 'Sana & Bilal', city: 'Islamabad', trip: 'Maldives honeymoon', rating: 5, text: 'Water villa upgrade, flowers on the bed, smooth transfers. They answered WhatsApp within minutes the whole trip.' },
  { name: 'Imran K.', city: 'Manchester, UK', trip: 'Air tickets MAN–LHE', rating: 5, text: 'Got a better fare than online sites and they changed my return date for free when my plans moved.' },
  { name: 'Fatima Z.', city: 'Multan', trip: 'Dubai visa + package', rating: 5, text: 'Visa came in four days. The checklist they gave made it simple. Desert safari was the highlight.' },
  { name: 'Usman T.', city: 'Faisalabad', trip: 'Corporate travel', rating: 4, text: 'Monthly invoicing and one point of contact made our team travel much easier to manage.' },
]

export const FAQS = [
  { q: 'How much does an Umrah package from Pakistan cost?', a: 'Umrah packages with Baba Travels start from PKR 289,000 per person on a sharing basis for 14 nights, including visa, return flights, hotels and transport. Family and premium packages near the Haram range from PKR 365,000 to PKR 540,000.' },
  { q: 'How do I book a tour or ticket with Baba Travels?', a: 'Send your dates and number of travellers through our quote form or WhatsApp. An advisor replies with options within 30 minutes during office hours. Once you confirm and pay, tickets and vouchers are sent by WhatsApp and email.' },
  { q: 'Which payment methods do you accept?', a: 'We accept bank transfer, debit and credit cards, JazzCash and Easypaisa. Overseas Pakistanis can pay from the UK, UAE or Saudi Arabia by bank transfer.' },
  { q: 'Can you help with a UAE or Saudi visit visa?', a: 'Yes. We process UAE, Saudi, Turkey, Malaysia, UK and Schengen visas. UAE visit visas typically take 3–5 working days with complete documents.' },
  { q: 'When is the best time to visit Hunza and Skardu?', a: 'April to October. April brings cherry and apricot blossoms, June to September is best for Deosai and high passes, and October has autumn colours.' },
  { q: 'Do you offer support while I am travelling?', a: 'Yes. Our WhatsApp line is answered 24/7 by a real advisor, and partner desks in Dubai, Jeddah and Istanbul can help on the ground.' },
]

export const POSTS = [
  { slug: 'umrah-checklist-2026', title: 'Umrah checklist 2026: documents, packing and first-day plan', excerpt: 'Everything to prepare before you fly, from Nusuk registration to what to carry in your ihram bag.', author: 'Baba Travels Umrah desk', updated: '2026-11-02', read: '7 min', img: 'umrah' },
  { slug: 'hunza-in-autumn', title: 'Hunza in autumn: a 6-day route with the best colour', excerpt: 'Where to stay, which days to drive, and why late October beats spring for photography.', author: 'Northern tours team', updated: '2026-10-18', read: '6 min', img: 'hunza' },
  { slug: 'dubai-visa-pakistanis', title: 'Dubai visit visa for Pakistanis: fees, timing and rejections', excerpt: 'The exact documents, current processing times and the mistakes that cause rejections.', author: 'Visa desk', updated: '2026-11-10', read: '5 min', img: 'dubai' },
]

export const NAV = [
  { label: 'Services', to: '/services', mega: true },
  { label: 'Packages', to: '/packages' },
  { label: 'Destinations', to: '/destinations/hunza-valley', dest: true },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export const ROUTES_LIST = [
  '/', '/services', '/packages', '/about', '/contact', '/quote',
  ...SERVICES.map((s) => `/services/${s.slug}`),
  ...DESTINATIONS.map((d) => `/destinations/${d.slug}`),
  ...POSTS.map((p) => `/blog/${p.slug}`),
]
