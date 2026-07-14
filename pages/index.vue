<script setup lang="ts">
interface Quote { text: string; category: string }

const quote = ref<Quote>({ text: '加载中…', category: '' })
const categories = ref<string[]>([])
const selected = ref('')
const copied = ref(false)
const isLoading = ref(true)
const isDark = ref(true)
const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

function selectCategory(value: string) {
  selected.value = value
  dropdownOpen.value = false
  refresh()
}

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
}

function handleClickOutside(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    dropdownOpen.value = false
  }
}

async function loadCategories() {
  try {
    const data = await $fetch<{ categories: string[] }>('/api/categories')
    if (data) categories.value = data.categories
  } catch (e) {}
}

async function refresh() {
  isLoading.value = true
  copied.value = false
  const url = selected.value
    ? `/api/random?category=${encodeURIComponent(selected.value)}`
    : '/api/random'
  try {
    const data = await $fetch<Quote>(url)
    if (data) {
      quote.value = data
      const el = document.getElementById('quote')
      if (el) { el.classList.remove('fade'); void el.offsetWidth; el.classList.add('fade') }
    }
  } catch (e) {}
  isLoading.value = false
}

async function copy() {
  try {
    await navigator.clipboard.writeText(quote.value.text)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch (e) {}
}

function toggleTheme() {
  isDark.value = !isDark.value
}

onMounted(() => {
  loadCategories()
  refresh()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="page" :class="{ light: !isDark }">
    <div class="bg-grid"></div>
    <div class="bg-orbs">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>

    <div class="card">
      <div class="card-shine"></div>
      <div class="card-border"></div>

      <header class="head">
        <div class="head-top">
          <div class="logo">
            <span class="logo-text">天</span>
          </div>
          <button class="theme-toggle" @click="toggleTheme" :title="isDark ? '切换亮色' : '切换暗色'">
            <svg v-if="isDark" class="theme-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            <svg v-else class="theme-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </button>
        </div>
        <h1>天狗语录</h1>
        <p class="sub">每一次刷新，都是一次心动（或心碎）</p>
      </header>

      <div class="quote-area">
        <div class="quote-wrapper">
          <div class="quote-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
            </svg>
          </div>
          <blockquote id="quote" class="quote fade">
            <p class="quote-text">{{ quote.text }}</p>
          </blockquote>
        </div>

        <div class="meta">
          <span v-if="quote.category" class="badge" :class="quote.category">
            <span class="badge-icon">{{ quote.category === '情话' ? '♥' : '✦' }}</span>
            {{ quote.category }}
          </span>
        </div>
      </div>

      <div class="controls">
        <div class="select-wrapper" ref="dropdownRef">
          <button class="select" @click="toggleDropdown" :class="{ open: dropdownOpen }">
            <span class="select-value">{{ selected || '全部随机' }}</span>
            <span class="select-arrow" :class="{ open: dropdownOpen }">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </button>
          <div class="dropdown-panel" v-show="dropdownOpen">
            <button
              class="dropdown-item"
              :class="{ active: selected === '' }"
              @click="selectCategory('')"
            >全部随机</button>
            <button
              v-for="c in categories"
              :key="c"
              class="dropdown-item"
              :class="{ active: selected === c }"
              @click="selectCategory(c)"
            >{{ c }}</button>
          </div>
        </div>

        <div class="btn-group">
          <button class="btn btn-secondary" @click="copy">
            <span class="btn-content">
              <svg v-if="!copied" class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <svg v-else class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              {{ copied ? '已复制' : '复制' }}
            </span>
          </button>

          <button class="btn btn-primary" @click="refresh">
            <span class="btn-content">
              <svg class="btn-icon" :class="{ spinning: isLoading }" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M23 4v6h-6"></path>
                <path d="M1 20v-6h6"></path>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
              换一句
            </span>
          </button>
        </div>
      </div>
    </div>

    <footer class="footer">
      <div class="footer-content">
        <span class="footer-label">API</span>
        <code>/api/random</code>
        <span class="footer-dot">·</span>
        <code>/api/random?category=情话</code>
        <span class="footer-dot">·</span>
        <code>/api/categories</code>
      </div>
    </footer>
  </div>
</template>

<style>
:root {
  --bg: #0a0a0f;
  --bg-secondary: #12121a;
  --card: rgba(18, 18, 26, 0.85);
  --card-border: rgba(255, 255, 255, 0.06);
  --accent: #c084fc;
  --accent-2: #818cf8;
  --accent-3: #f472b6;
  --accent-glow: rgba(192, 132, 252, 0.2);
  --text: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --surface: rgba(255, 255, 255, 0.03);
  --surface-hover: rgba(255, 255, 255, 0.06);
  --border: rgba(255, 255, 255, 0.08);
  --radius: 16px;
  --radius-sm: 12px;
  --radius-lg: 20px;
  --shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.light {
  --bg: #fafafa;
  --bg-secondary: #f1f5f9;
  --card: rgba(255, 255, 255, 0.9);
  --card-border: rgba(0, 0, 0, 0.08);
  --accent: #9333ea;
  --accent-2: #6366f1;
  --accent-3: #ec4899;
  --accent-glow: rgba(147, 51, 234, 0.15);
  --text: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  --surface: rgba(0, 0, 0, 0.02);
  --surface-hover: rgba(0, 0, 0, 0.04);
  --border: rgba(0, 0, 0, 0.08);
  --shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
}

* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "PingFang SC", "Microsoft YaHei", sans-serif;
  background: var(--bg);
  color: var(--text);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background 0.3s ease, color 0.3s ease;
}

.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  position: relative;
  overflow: hidden;
}

.bg-grid {
  position: fixed;
  inset: 0;
  background-image: 
    linear-gradient(var(--border) 1px, transparent 1px),
    linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 64px 64px;
  opacity: 0.5;
  pointer-events: none;
}

.bg-orbs {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.4;
  animation: float 25s ease-in-out infinite;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: var(--accent);
  top: -150px;
  left: -100px;
  animation-delay: 0s;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: var(--accent-3);
  bottom: -100px;
  right: -80px;
  animation-delay: -8s;
}

.orb-3 {
  width: 350px;
  height: 350px;
  background: var(--accent-2);
  top: 40%;
  left: 60%;
  animation-delay: -16s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(40px, -40px) scale(1.1); }
  50% { transform: translate(-30px, 30px) scale(0.9); }
  75% { transform: translate(20px, 20px) scale(1.05); }
}

.card {
  width: 100%;
  max-width: 480px;
  background: var(--card);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border-radius: var(--radius-lg);
  padding: 44px 36px;
  position: relative;
  z-index: 1;
  box-shadow: var(--shadow);
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.card-shine {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
}

.card-border {
  position: absolute;
  inset: 0;
  border-radius: var(--radius-lg);
  border: 1px solid var(--card-border);
  pointer-events: none;
}

.head {
  text-align: center;
  margin-bottom: 32px;
}

.head-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.logo {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px var(--accent-glow);
}

.logo-text {
  font-size: 22px;
  font-weight: 700;
  color: white;
}

.theme-toggle {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.theme-toggle:hover {
  background: var(--surface-hover);
  color: var(--text);
  transform: scale(1.05);
}

.theme-icon {
  transition: transform 0.3s ease;
}

.theme-toggle:hover .theme-icon {
  transform: rotate(15deg);
}

h1 {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
  background: linear-gradient(135deg, var(--text) 0%, var(--text-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.sub {
  color: var(--text-muted);
  font-size: 14px;
  letter-spacing: 0.01em;
}

.quote-area {
  margin-bottom: 28px;
}

.quote-wrapper {
  position: relative;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 28px 24px;
  min-height: 160px;
  display: flex;
  align-items: center;
}

.quote-icon {
  position: absolute;
  top: 16px;
  left: 16px;
  color: var(--accent);
  opacity: 0.2;
}

.quote {
  border: none;
  background: transparent;
  padding: 0;
  margin: 0;
  min-height: auto;
}

.quote-text {
  font-size: 17px;
  line-height: 1.9;
  color: var(--text);
  text-align: center;
  width: 100%;
}

.meta {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: 100px;
  letter-spacing: 0.02em;
  transition: all 0.3s ease;
}

.badge.情话 {
  color: #f472b6;
  background: rgba(244, 114, 182, 0.1);
  border: 1px solid rgba(244, 114, 182, 0.2);
}

.badge.舔狗语录 {
  color: var(--accent);
  background: var(--accent-glow);
  border: 1px solid rgba(192, 132, 252, 0.2);
}

.badge-icon {
  font-size: 10px;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.select-wrapper {
  position: relative;
  width: 100%;
}

.select {
  width: 100%;
  font: inherit;
  font-size: 14px;
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 14px 40px 14px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;
}

.select:hover {
  background: var(--surface-hover);
  border-color: rgba(255, 255, 255, 0.12);
}

.select.open {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.select-value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.select-arrow {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.select-arrow.open {
  transform: translateY(-50%) rotate(180deg);
}

.dropdown-panel {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 6px;
  z-index: 100;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  max-height: 240px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}

.dropdown-panel::-webkit-scrollbar {
  width: 6px;
}

.dropdown-panel::-webkit-scrollbar-track {
  background: transparent;
}

.dropdown-panel::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 3px;
}

.dropdown-panel::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

.dropdown-item {
  width: 100%;
  font: inherit;
  font-size: 14px;
  color: var(--text);
  background: transparent;
  border: none;
  border-radius: 8px;
  padding: 10px 12px;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
}

.dropdown-item:hover {
  background: var(--surface-hover);
}

.dropdown-item.active {
  background: var(--accent-glow);
  color: var(--accent);
  font-weight: 500;
}

.light .select:hover {
  border-color: rgba(0, 0, 0, 0.15);
}

.light .select.open {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.light .dropdown-panel {
  background: #fff;
  border-color: rgba(0, 0, 0, 0.08);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.light .dropdown-item:hover {
  background: #f1f5f9;
}

.light .dropdown-item.active {
  background: rgba(147, 51, 234, 0.08);
  color: var(--accent);
}

.btn-group {
  display: flex;
  gap: 10px;
}

.btn {
  flex: 1;
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  border-radius: var(--radius-sm);
  padding: 14px 20px;
  cursor: pointer;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  transition: all 0.2s ease;
  overflow: hidden;
}

.btn-content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
}

.btn:hover {
  background: var(--surface-hover);
  border-color: rgba(255, 255, 255, 0.12);
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0);
}

.btn-icon {
  flex-shrink: 0;
}

.btn-icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.btn-primary {
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  border: none;
  color: white;
  box-shadow: 0 4px 16px var(--accent-glow);
}

.btn-primary:hover {
  box-shadow: 0 6px 24px var(--accent-glow);
  filter: brightness(1.1);
}

.btn-secondary {
  color: var(--text-secondary);
}

.btn-secondary:hover {
  color: var(--text);
}

.footer {
  margin-top: 24px;
  z-index: 1;
}

.footer-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.footer-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  padding: 2px 6px;
  background: var(--surface);
  border-radius: 4px;
}

.footer-dot {
  color: var(--text-muted);
  font-size: 10px;
}

.tip {
  color: var(--text-muted);
  font-size: 12px;
  text-align: center;
}

.tip code,
.footer-content code {
  color: var(--accent);
  background: var(--accent-glow);
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-family: "SF Mono", "Fira Code", "Cascadia Code", monospace;
}

.fade {
  animation: fade 0.5s ease;
}

@keyframes fade {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 520px) {
  .card {
    padding: 32px 24px;
    border-radius: var(--radius);
  }

  .head-top {
    margin-bottom: 16px;
  }

  h1 {
    font-size: 22px;
  }

  .quote-wrapper {
    padding: 24px 20px;
    min-height: 140px;
  }

  .quote-text {
    font-size: 15px;
  }

  .btn-group {
    flex-direction: column;
  }

  .footer-content {
    flex-direction: column;
    gap: 6px;
  }

  .footer-dot {
    display: none;
  }
}
</style>
