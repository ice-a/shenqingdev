import { promises as fs } from 'fs'
import path from 'path'

const TEXTS_DIR = path.resolve(process.cwd(), 'texts')

export interface Quote {
  text: string
  category: string
}

let cache: { map: Map<string, string[]>; signature: string } | null = null

function stripPrefix(line: string): string {
  return line.replace(/^\s*\d+[、.：:]\s*/, '').trim()
}

async function loadQuotes(): Promise<Map<string, string[]>> {
  let entries
  try {
    entries = await fs.readdir(TEXTS_DIR, { withFileTypes: true })
  } catch {
    return new Map()
  }
  const files = entries.filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.txt'))
  const signature = files.map((f) => f.name).sort().join('|')
  if (cache && cache.signature === signature) return cache.map

  const map = new Map<string, string[]>()
  for (const f of files) {
    const category = f.name.replace(/\.txt$/i, '')
    const raw = await fs.readFile(path.join(TEXTS_DIR, f.name), 'utf8')
    const lines = raw
      .split(/\r?\n/)
      .map(stripPrefix)
      .filter(Boolean)
    map.set(category, lines)
  }
  cache = { map, signature }
  return map
}

export async function getRandom(category?: string): Promise<Quote> {
  const map = await loadQuotes()
  if (category && map.has(category)) {
    const lines = map.get(category)!
    return { text: lines[Math.floor(Math.random() * lines.length)], category }
  }
  const categories = [...map.keys()]
  if (categories.length === 0) {
    return { text: '（暂无语录，请往 texts 目录添加 txt 文件）', category: '' }
  }
  const cat = categories[Math.floor(Math.random() * categories.length)]
  const lines = map.get(cat)!
  return { text: lines[Math.floor(Math.random() * lines.length)], category: cat }
}

export async function getCategories(): Promise<string[]> {
  const map = await loadQuotes()
  return [...map.keys()]
}
