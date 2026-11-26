// Image pipeline: turns the hi-res source photos in /assets/hero-src into the
// responsive WebP derivatives the site references (see src/data/site.js → img()).
//
//   {name}-1920.webp   1920×1080  desktop / large screens
//   {name}-1280.webp   1280×720   desktop default + card/PageHero + OG image
//   {name}-m.webp        960×540   mobile <picture> source
//   {name}-thumb.webp    480×270   small thumbnails
//
// Every variant is cropped to a 16:9 "cover" box so the rendered dimensions match
// the hard-coded width/height attributes exactly → no layout shift (CLS = 0).
//
//   node scripts/optimize-images.mjs
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.join(root, 'assets/hero-src')
const OUT = path.join(root, 'public/images/hero')

// width, height, starting webp quality, and a byte budget. Each variant is encoded
// at `q`; if it exceeds `max`, quality steps down (to a floor of 40) until it fits —
// so easily-compressed photos stay crisp while detail-heavy ones are forced under
// budget. Budgets: hero 1280 < 150 KB, thumbnails < 30 KB.
const KB = 1024
const VARIANTS = [
  { suffix: '1920', w: 1920, h: 1080, q: 72, max: 280 * KB },
  { suffix: '1280', w: 1280, h: 720, q: 74, max: 150 * KB },
  { suffix: 'm', w: 960, h: 540, q: 72, max: 90 * KB },
  { suffix: 'thumb', w: 480, h: 270, q: 68, max: 30 * KB },
]

// Per-image crop focus (sharp gravity). Default is 'centre'.
// umrah: the Makkah source has a tall, empty night sky up top, so centre-cropping
// to 16:9 leaves the Kaaba sitting low. Crop from the bottom to lift it up.
const POSITION = {
  umrah: 'bottom',
}

async function encodeToBudget(input, v, outPath, name) {
  let q = v.q
  let info
  while (true) {
    info = await sharp(input)
      .resize(v.w, v.h, { fit: 'cover', position: POSITION[name] || 'centre', kernel: 'lanczos3' })
      .sharpen({ sigma: 0.6 })
      .webp({ quality: q, effort: 6 })
      .toFile(outPath)
    if (info.size <= v.max || q <= 44) return { info, q }
    q -= 6
  }
}

const names = fs.readdirSync(SRC).filter((f) => /\.(jpe?g|png)$/i.test(f)).map((f) => f.replace(/\.[^.]+$/, ''))
if (!names.length) { console.error('No source images in', SRC); process.exit(1) }

fs.mkdirSync(OUT, { recursive: true })
let total = 0
const report = []

for (const name of names) {
  const srcFile = fs.readdirSync(SRC).find((f) => f.replace(/\.[^.]+$/, '') === name)
  for (const v of VARIANTS) {
    const outPath = path.join(OUT, `${name}-${v.suffix}.webp`)
    const { info, q } = await encodeToBudget(path.join(SRC, srcFile), v, outPath, name)
    total += info.size
    report.push(`  ${name}-${v.suffix}.webp`.padEnd(26) + `${(info.size / 1024).toFixed(1)} KB`.padStart(10) + `  q${q}`)
  }
}

console.log(report.join('\n'))
console.log('  ' + '─'.repeat(34))
console.log('  total'.padEnd(26) + `${(total / 1024).toFixed(1)} KB`.padStart(10))
console.log(`  ${names.length} images × ${VARIANTS.length} sizes = ${names.length * VARIANTS.length} files`)
