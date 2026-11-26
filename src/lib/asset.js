// Resolves files in /public for both root deploys and relative preview builds.
export const asset = (p) => `${import.meta.env.BASE_URL}${p.replace(/^\//, '')}`
export const heroImg = (name, size = 1280) => asset(`images/hero/${name}-${size}.webp`)
