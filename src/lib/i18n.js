// ── i18n + units ────────────────────────────────────────────────────────────
// Tiny by design. English strings ARE the keys — `t('My Trip')` returns the
// zh-TW translation or falls back to the English key, so untranslated strings
// degrade gracefully instead of breaking. Language and temperature unit live
// at module level (readable from any render code without prop threading); the
// App root re-renders the whole tree when either changes (see onPrefsChange).
//
// v1 scope: UI chrome is translated; editorial content (place descriptions,
// tips) stays English — real prose deserves real translation in v1.1.

// v1 ships English-only — the zh-TW dictionary below is complete and tested,
// but the language toggle is held for v1.1. Forcing 'en' here (instead of
// reading the stored preference) guarantees no device that toggled Chinese
// during testing gets stuck in it with no visible way back.
// v1.1: restore → localStorage.getItem('nyc_lang') || 'en'
let _lang = 'en'
let _unit = (() => { try { return localStorage.getItem('nyc_temp_unit') || 'f' } catch { return 'f' } })()

export function getLang() { return _lang }
export function setLang(l) { _lang = l; try { localStorage.setItem('nyc_lang', l) } catch {} }
export function getUnit() { return _unit }
export function setUnit(u) { _unit = u; try { localStorage.setItem('nyc_temp_unit', u) } catch {} }

// All temperatures in the app are fetched in °F; convert at display time only.
export function fmtTemp(f) {
  if (f == null || isNaN(f)) return ''
  return _unit === 'c' ? Math.round((f - 32) * 5 / 9) : Math.round(f)
}
export function unitLabel() { return _unit === 'c' ? '°C' : '°F' }

// Date locale for day labels / trip summaries.
export function dateLocale() { return _lang === 'zh' ? 'zh-TW' : 'en-US' }

const ZH = {
  // ── Bottom nav ──
  'Explore': '探索', 'Events': '活動', 'Map': '地圖', 'My Trip': '我的行程',
  // ── Home ──
  'The City Guide': '城市指南',
  'Search venues, sights, artists…': '搜尋景點、餐廳、藝術家…',
  'What do you feel like?': '現在想做什麼？',
  'Eat': '吃飯', 'Restaurants': '餐廳',
  'Drinks': '喝一杯', 'Bars, cocktails, wine': '酒吧、調酒、葡萄酒',
  'Coffee': '咖啡', 'Cafés & bakeries': '咖啡館與烘焙坊',
  'Outdoors': '戶外', 'Parks & waterfront': '公園與河濱',
  'Culture': '文化', 'Museums & landmarks': '博物館與地標',
  'Live': '現場表演', 'Jazz, theater, music': '爵士、劇場、音樂',
  'Feeling something specific?': '想來點特別的？',
  'Just chilling': '放空放鬆', 'Date night': '約會之夜', 'Family day': '親子日',
  'Rainy day': '雨天備案', 'First time in NYC': '初訪紐約',
  'Browse by': '瀏覽', 'Topics': '主題', 'Areas': '區域',
  'This week in NYC': '本週紐約',
  'Tonight, curated': '今晚精選',
  'Plan my night': '規劃今晚',
  'A routed plan with food, in a couple of taps.': '幾下點擊，就有含餐廳的路線行程。',
  // ── Weather lines ({T} = temperature, {TOD} = time of day) ──
  'Thunder out there — a long-lunch, museum kind of day.': '外頭打雷 — 適合慢慢吃頓午餐、逛博物館的一天。',
  'Snow day — coffee first, then somewhere warm.': '下雪天 — 先來杯咖啡，再找個溫暖的地方。',
  'Rainy {TOD} — museums, bookstores, a long ramen.': '下雨的{TOD} — 博物館、書店、一碗慢慢吃的拉麵。',
  'Foggy — the city’s gone cinematic. Walk the bridge anyway.': '起霧了 — 城市變成電影場景，照樣去走橋吧。',
  '{T}° and steamy — shade, iced coffee, waterfront.': '{T}° 悶熱 — 找樹蔭、冰咖啡、去河濱。',
  '{T}° out there — bundle up, keep it indoors and cozy.': '外頭 {T}° — 穿暖一點，室內最舒服。',
  'Clear morning — bagel weather.': '晴朗的早晨 — 正是貝果天。',
  'Sunny afternoon — the waterfront is calling.': '陽光午後 — 河濱在呼喚。',
  'Clear night — rooftop weather.': '晴朗夜晚 — 適合上頂樓。',
  'Soft gray {TOD} — good wandering weather.': '灰濛濛的{TOD} — 適合隨意漫步。',
  'morning': '早晨', 'afternoon': '午後', 'evening': '夜晚',
  // ── My Trip ──
  'Your trip': '你的行程', 'Edit': '編輯', 'Done': '完成',
  'No dates yet — planning by day': '尚未設定日期 — 先以天次規劃',
  '{N} days': '{N} 天', '1 day': '1 天',
  'Arriving': '抵達', 'Days': '天數', 'Auto': '自動',
  'Choose stops': '選擇停留點', '{A} of {B} in plan': '已排入 {A}/{B}',
  'All days': '全部天數', 'Day {N}': '第 {N} 天',
  '{N} stops': '{N} 個停留點', '1 stop': '1 個停留點',
  'Lunch + Dinner': '午餐＋晚餐', 'Lunch': '午餐', 'Dinner': '晚餐',
  '{N} events': '{N} 場活動', '1 event': '1 場活動',
  'Morning': '上午', 'Afternoon': '下午', 'Evening': '晚上',
  'Add a note…': '加個註記…', 'Options': '選項',
  'Show another': '換一家', '+ Choose cuisine': '＋選擇料理',
  'Reserve a table': '訂位', 'View on Maps': '在地圖查看',
  'Add a place to this day': '為這一天新增地點',
  'Share': '分享', 'Save': '儲存', 'Saved': '已儲存', 'Copied': '已複製',
  'Route trip': '全程路線', 'Route day': '當日路線', 'Route': '路線',
  'Saved places': '收藏的地點', 'My saved places': '我收藏的地點', '+ Add to plan': '＋加入行程',
  'Remove from saved': '自收藏移除',
  'Your added places': '你新增的地點', 'Saved plans': '已存的行程',
  'Your event': '你的活動',
  'Visit website': '造訪網站', 'Get tickets': '購票',
  // ── Settings ──
  'Settings': '設定', 'Preferences': '偏好設定',
  'Language': '語言', 'Temperature': '溫度',
  'Sign in': '登入', 'Sign out': '登出',
  'Create account': '建立帳號',
  // ── Auth ──
  'Sign in to NYC Stoop': '登入 NYC Stoop',
  'Create your account': '建立你的帳號',
  'Reset your password': '重設密碼',
  'Sync your saves and trip plan across devices.': '在不同裝置間同步你的收藏與行程。',
  "Enter your email and we'll send you a reset link.": '輸入你的電子郵件，我們會寄送重設連結。',
  'Sign in with Apple': '使用 Apple 登入',
  'Continue with Google': '使用 Google 繼續',
  'or with email': '或使用電子郵件',
  'Password': '密碼',
  'Choose a password (8+ chars)': '設定密碼（至少 8 個字元）',
  'Display name (optional)': '顯示名稱（選填）',
  'Forgot password?': '忘記密碼？',
  // ── Common ──
  '+ Add to My Trip': '＋加入我的行程', '✓ In My Trip': '✓ 已在行程中',
  '✓ Saved to My Trip': '✓ 已存入我的行程', '✓ Added to My Trip!': '✓ 已加入我的行程！',
  'Show on the live map': '在實景地圖上顯示', 'Full details →': '完整介紹 →',
  'Near me': '附近', 'Anywhere': '不限地區',
}

export function t(en) {
  if (_lang === 'en') return en
  return ZH[en] || en
}

// Parametrized variant: t2('Day {N}', { N: 3 }) → 第 3 天 / Day 3
export function t2(key, vars = {}) {
  let s = t(key)
  for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v))
  return s
}
