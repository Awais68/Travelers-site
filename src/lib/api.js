// Frontend ↔ Express (MERN) contract. Set VITE_API_URL to your Express server, e.g. https://api.babatravels.pk
// Expected endpoint: POST /api/leads  → 201 { id }
const API = import.meta.env.VITE_API_URL

export async function submitLead(payload) {
  if (!API) {
    // No backend yet: simulate latency so the UI states can be reviewed.
    await new Promise((r) => setTimeout(r, 900))
    return { ok: true, demo: true }
  }
  const res = await fetch(`${API}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, source: typeof location !== 'undefined' ? location.pathname : '' }),
  })
  if (!res.ok) throw new Error(`Lead submit failed: ${res.status}`)
  return res.json()
}
