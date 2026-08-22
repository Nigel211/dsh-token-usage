// dsh-token-usage Host half (static bundle form)
// Token usage/cost statistics with official DeepSeek CNY pricing (peak/off-peak,
// effective-date segmented), range filters, multi-provider balance queries, and
// price-table persistence. Serves the browser client through webServer routes.

const name = 'dsh-token-usage'

function sendJson(res, code, value) {
  res.statusCode = code
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.setHeader('cache-control', 'no-store')
  res.end(JSON.stringify(value))
}

function readBody(req, maxBytes) {
  return new Promise((resolve) => {
    const chunks = []
    let size = 0
    req.on('data', (chunk) => {
      size += chunk.length
      if (size <= maxBytes) chunks.push(chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', () => resolve(''))
  })
}

function apply(ctx) {
  const MAX_RECORDS = 100000
  const records = []
  let backfilling = false
  let backfillDone = 0
  let backfillTotal = 0
  let liveStarted = false

  // ---------- price table & display config ----------
  // DeepSeek official CNY pricing (yuan per 1M tokens):
  // old price before 2026-08-17 00:00 Beijing (= 2026-08-16 16:00 UTC);
  // peak/off-peak pricing from 8-17, peak 09:00-12:00 / 14:00-18:00 Beijing
  // (= UTC 01:00-04:00 / 06:00-10:00), off-peak = half price.
  const NEW_PRICE_EFFECTIVE = Date.UTC(2026, 7, 16, 16, 0, 0)
  const DEEPSEEK_PEAK = [{ start: 1, end: 4 }, { start: 6, end: 10 }]
  const DEFAULT_PRICING = [
    { provider: 'deepseek-official', model: 'deepseek-v4-flash', currency: 'CNY', inputMiss: 1.0, inputHit: 0.02, output: 2.0, effectiveFrom: 0 },
    { provider: 'deepseek-official', model: 'deepseek-v4-pro', currency: 'CNY', inputMiss: 3.0, inputHit: 0.025, output: 6.0, effectiveFrom: 0 },
    { provider: 'deepseek-official', model: 'deepseek-v4-flash', currency: 'CNY', inputMiss: 3.0, inputHit: 0.1, output: 9.0, peakHoursUTC: DEEPSEEK_PEAK, offPeak: { inputMiss: 1.5, inputHit: 0.05, output: 4.5 }, effectiveFrom: NEW_PRICE_EFFECTIVE },
    { provider: 'deepseek-official', model: 'deepseek-v4-pro', currency: 'CNY', inputMiss: 9.0, inputHit: 0.3, output: 27.0, peakHoursUTC: DEEPSEEK_PEAK, offPeak: { inputMiss: 4.5, inputHit: 0.15, output: 13.5 }, effectiveFrom: NEW_PRICE_EFFECTIVE }
  ]
  let pricing = []
  let pricingPersisted = false
  let displayCurrency = 'CNY'
  let usdCnyRate = 7.2

  function cloneJson(v) { return JSON.parse(JSON.stringify(v)) }
  function isOfficialEntry(e) {
    return !!(e && e.provider === 'deepseek-official' && (e.model === 'deepseek-v4-flash' || e.model === 'deepseek-v4-pro'))
  }
  function mergeWithBuiltin(saved) {
    const builtin = cloneJson(DEFAULT_PRICING)
    const merged = []
    for (const b of builtin) {
      if (saved.some((e) => e && e.provider === b.provider && e.model === b.model)) merged.push(b)
    }
    return merged.concat(saved.filter((e) => !isOfficialEntry(e)))
  }
  function pricingPath() {
    try {
      const sp = ctx.get('sandboxPolicy')
      if (!sp) return null
      const p = sp.resolve()
      return p && p.workspaceRoot ? p.workspaceRoot + '/.dsh-token-stats-pricing.json' : null
    } catch (e) { return null }
  }
  async function loadPricing() {
    const fsSvc = ctx.get('fs')
    const path = pricingPath()
    if (!fsSvc || !path) return
    try {
      const target = await fsSvc.resolve(path)
      const text = await fsSvc.readText(target)
      const parsed = JSON.parse(text)
      if (Array.isArray(parsed)) {
        pricing = mergeWithBuiltin(parsed)
        pricingPersisted = true
      } else if (parsed && typeof parsed === 'object' && Array.isArray(parsed.pricing)) {
        pricing = mergeWithBuiltin(parsed.pricing)
        if (parsed.displayCurrency === 'auto' || parsed.displayCurrency === 'USD' || parsed.displayCurrency === 'CNY') displayCurrency = parsed.displayCurrency
        if (typeof parsed.usdCnyRate === 'number' && Number.isFinite(parsed.usdCnyRate) && parsed.usdCnyRate > 0) usdCnyRate = parsed.usdCnyRate
        pricingPersisted = true
      }
    } catch (e) { /* first run: defaults */ }
  }
  async function savePricing() {
    const fsSvc = ctx.get('fs')
    const sp = ctx.get('sandboxPolicy')
    const path = pricingPath()
    if (!fsSvc || !sp || !path) return false
    try {
      const policy = sp.resolve()
      const target = await fsSvc.resolve(path)
      await fsSvc.writeText(target, JSON.stringify({ version: 4, pricing, displayCurrency, usdCnyRate }, null, 2), undefined, undefined, policy)
      pricingPersisted = true
      return true
    } catch (e) { return false }
  }

  // ---------- fold ----------
  const routeState = new Map()
  function pushRecord(rec) {
    records.push(rec)
    if (records.length > MAX_RECORDS) records.splice(0, records.length - MAX_RECORDS)
  }
  function fold(sessionId, time, type, data) {
    if (type === 'request/context') {
      routeState.set(sessionId, {
        provider: data && data.provider ? String(data.provider) : null,
        model: data && data.model ? String(data.model) : null
      })
      return
    }
    if (type !== 'assistant/message') return
    const usage = data && data.usage
    if (!usage || typeof usage !== 'object') return
    let st = routeState.get(sessionId)
    // DSH 重启后 routeState 为空,而正在进行的会话新消息不再逐条带 request/context;
    // 回退:从该 session 最近一条已入库记录推断 provider/model,避免实时消息计价丢失。
    if (!st || (!st.provider && !st.model)) {
      for (let i = records.length - 1; i >= 0; i--) {
        const r = records[i]
        if (r.sessionId === sessionId && (r.provider || r.model)) {
          if (!st) st = {}
          if (!st.provider) st.provider = r.provider
          if (!st.model) st.model = r.model
          break
        }
      }
      if (st) routeState.set(sessionId, st)
    }
    pushRecord({
      time: time || Date.now(),
      sessionId,
      provider: st ? st.provider : null,
      model: st ? st.model : null,
      input: usage.inputTokens || 0,
      output: usage.outputTokens || 0,
      cacheRead: usage.cacheReadTokens || 0,
      cacheWrite: usage.cacheWriteTokens || 0,
      reasoning: usage.reasoningTokens || 0
    })
  }

  // ---------- backfill ----------
  let backfillPending = false
  let backfillRetries = 0
  const MAX_BACKFILL_RETRIES = 10
  // 惰性回填:调用方(如 summary)在 records 为空时触发;bundle 启动时会话存储
  // 可能尚未就绪导致首次回填拿到空列表,这里会在稍后自动重试直到有数据。
  async function ensureBackfilled() {
    if (backfilling || backfillPending || records.length > 0) return
    backfillPending = true
    try {
      await backfill()
    } finally {
      backfillPending = false
    }
    if (records.length === 0) scheduleBackfillRetry()
  }
  function scheduleBackfillRetry() {
    if (backfillRetries >= MAX_BACKFILL_RETRIES) return
    if (records.length > 0 || backfillPending) return
    backfillRetries += 1
    setTimeout(() => {
      if (records.length > 0) return
      backfill().then(() => {
        if (records.length === 0) scheduleBackfillRetry()
      }).catch(() => scheduleBackfillRetry())
    }, 15000)
  }
  async function backfill() {
    const sq = ctx.get('sessionQuery')
    if (!sq) return
    backfilling = true
    backfillDone = 0
    backfillTotal = 0
    records.length = 0
    try {
      const list = await sq.listSessions()
      backfillTotal = list.length
      for (const rec of list) {
        const id = rec && rec.header && rec.header.id ? rec.header.id : (rec && rec.id)
        if (!id) { backfillDone += 1; continue }
        try {
          const snap = await sq.readSession(id)
          const events = snap && snap.events ? snap.events : []
          const st = {}
          for (const ev of events) {
            if (ev.type === 'request/context') {
              st.provider = ev.data && ev.data.provider ? String(ev.data.provider) : null
              st.model = ev.data && ev.data.model ? String(ev.data.model) : null
              continue
            }
            if (ev.type === 'assistant/message' && ev.data && ev.data.usage) {
              const usage = ev.data.usage
              pushRecord({
                time: ev.time || 0,
                sessionId: id,
                provider: st.provider || null,
                model: st.model || null,
                input: usage.inputTokens || 0,
                output: usage.outputTokens || 0,
                cacheRead: usage.cacheReadTokens || 0,
                cacheWrite: usage.cacheWriteTokens || 0,
                reasoning: usage.reasoningTokens || 0
              })
            }
          }
          // 预填 routeState,使该会话后续实时 fold 能关联到 provider/model
          if (st.provider || st.model) routeState.set(id, { provider: st.provider, model: st.model })
        } catch (e) { /* one bad session must not abort the scan */ }
        backfillDone += 1
      }
    } catch (e) { /* list failure */ } finally { backfilling = false }
  }

  // ---------- aggregates & cost ----------
  function isToday(ts) {
    const d = new Date(ts)
    const n = new Date()
    return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate()
  }
  function isPeak(ts, windows) {
    if (!windows || !windows.length) return false
    const h = new Date(ts).getUTCHours()
    for (const w of windows) {
      if (!w) continue
      const a = Number(w.start) || 0
      const b = Number(w.end) || 0
      if (a <= b ? (h >= a && h < b) : (h >= a || h < b)) return true
    }
    return false
  }
  function findEntry(provider, model, time) {
    let best = null
    let bestEff = -1
    let bestIdx = -1
    let bestPrio = -1
    function consider(e, idx, exactOnly) {
      if (!e) return
      const eff = typeof e.effectiveFrom === 'number' ? e.effectiveFrom : 0
      if (eff > time) return
      const isExact = e.model === model
      // 模型族前缀匹配:deepseek-v4-flash-vision-exp 沿用 deepseek-v4-flash 价目
      const isPrefix = !exactOnly && !isExact && e.model && model && model.indexOf(e.model) === 0
      if (!isExact && !isPrefix) return
      const prio = isExact ? 1 : 0
      if (best === null || prio > bestPrio || (prio === bestPrio && (eff > bestEff || (eff === bestEff && idx > bestIdx)))) {
        best = e
        bestEff = eff
        bestIdx = idx
        bestPrio = prio
      }
    }
    for (let i = 0; i < pricing.length; i++) {
      const e = pricing[i]
      if (e && e.provider === provider) consider(e, i, true)
    }
    for (let i = 0; i < pricing.length; i++) {
      const e = pricing[i]
      if (e && (e.provider === '*' || !e.provider)) consider(e, i, true)
    }
    if (best === null && model && model.indexOf('deepseek-v4-') === 0) {
      for (let i = 0; i < pricing.length; i++) {
        const e = pricing[i]
        if (e && e.provider === 'deepseek-official') consider(e, i, true)
      }
    }
    // 第二遍:模型族前缀匹配(仅当尚无精确条目命中时生效)
    if (best === null) {
      for (let i = 0; i < pricing.length; i++) {
        const e = pricing[i]
        if (e && e.provider === provider) consider(e, i, false)
      }
      for (let i = 0; i < pricing.length; i++) {
        const e = pricing[i]
        if (e && (e.provider === '*' || !e.provider)) consider(e, i, false)
      }
      if (model && model.indexOf('deepseek-v4-') === 0) {
        for (let i = 0; i < pricing.length; i++) {
          const e = pricing[i]
          if (e && e.provider === 'deepseek-official') consider(e, i, false)
        }
      }
    }
    return best
  }
  function costOf(rec) {
    const entry = findEntry(rec.provider, rec.model, rec.time)
    if (!entry) return null
    const off = !isPeak(rec.time, entry.peakHoursUTC) && entry.offPeak ? entry.offPeak : null
    const miss = (off ? off.inputMiss : entry.inputMiss) || 0
    const hit = (off ? off.inputHit : entry.inputHit) || 0
    const out = (off ? off.output : entry.output) || 0
    const value = ((rec.input + rec.cacheWrite) / 1e6) * miss + (rec.cacheRead / 1e6) * hit + (rec.output / 1e6) * out
    return { currency: entry.currency || 'CNY', value: Math.round(value * 1e6) / 1e6 }
  }
  function costMapOf(cost) {
    if (!cost) return {}
    const m = {}
    m[cost.currency] = cost.value
    return m
  }
  function emptyAgg() { return { calls: 0, input: 0, output: 0, cacheRead: 0, cacheWrite: 0, reasoning: 0, cost: {} } }
  function addCost(costMap, cost) {
    if (!cost) return
    costMap[cost.currency] = Math.round(((costMap[cost.currency] || 0) + cost.value) * 1e6) / 1e6
  }
  function aggList(list) {
    const a = emptyAgg()
    for (const r of list) {
      a.calls += 1
      a.input += r.input
      a.output += r.output
      a.cacheRead += r.cacheRead
      a.cacheWrite += r.cacheWrite
      a.reasoning += r.reasoning
      addCost(a.cost, costOf(r))
    }
    return a
  }
  function displayCost(costMap) {
    if (!costMap) return costMap
    if (displayCurrency === 'auto') return costMap
    const target = displayCurrency
    let total = 0
    const keys = Object.keys(costMap)
    for (const c of keys) {
      let v = costMap[c]
      if (c !== target) v = c === 'USD' ? v * usdCnyRate : v / usdCnyRate
      total += v
    }
    const out = {}
    out[target] = Math.round(total * 1e6) / 1e6
    return out
  }

  // ---------- titles ----------
  const titleCache = new Map()
  async function titleOf(sessionId) {
    const hit = titleCache.get(sessionId)
    if (hit && Date.now() - hit.at < 60000) return hit.title
    try {
      const sq = ctx.get('sessionQuery')
      if (!sq) return hit ? hit.title : null
      const obs = await sq.readTitleSnapshot(sessionId)
      const snap = obs && obs.title
      const t = snap && typeof snap.title === 'string' ? snap.title : null
      titleCache.set(sessionId, { title: t, at: Date.now() })
      return t
    } catch (e) { return hit ? hit.title : null }
  }

  // ---------- balance ----------
  const BALANCE_CACHE_TTL = 60000
  const LAST_GOOD_TTL = 10 * 60 * 1000
  let lastBalance = null
  const lastGoodByRoute = new Map()

  function hostOf(baseURL) {
    const s = String(baseURL || '').trim().toLowerCase()
    const m = s.match(/^https?:\/\/([^/?#]+)/)
    let h = m ? m[1] : s
    const idx = h.indexOf(':')
    if (idx >= 0) h = h.slice(0, idx)
    return h
  }
  function templateFor(route) {
    const base = String(route.baseURL || '').replace(/\/+$/, '')
    const host = hostOf(base)
    if (!base) return null
    if (route.route === 'deepseek-official' || host === 'api.deepseek.com' || host.endsWith('.deepseek.com')) {
      return { kind: 'deepseek', url: base + '/user/balance' }
    }
    if (host === 'openrouter.ai' || host.endsWith('.openrouter.ai')) {
      return { kind: 'openrouter', url: base + '/api/v1/auth/key' }
    }
    if (host === 'api.siliconflow.cn' || host.endsWith('.siliconflow.cn')) {
      return { kind: 'siliconflow', url: base + '/user/balance' }
    }
    if (host === 'platform.stepfun.com' || host.endsWith('.stepfun.com')) {
      return { kind: 'generic', url: base + '/api/v1/balance' }
    }
    if (host.includes('new-api') || host.includes('newapi') || route.route.toLowerCase().includes('new-api')) {
      return { kind: 'newapi', url: base + '/api/user/self' }
    }
    if (host.endsWith('.novita.ai') || host === 'novita.ai') {
      return { kind: 'generic', url: base + '/v1/user/balance' }
    }
    return null
  }
  function extract(kind, body) {
    if (kind === 'deepseek') {
      if (body && Array.isArray(body.balance_infos)) {
        return {
          is_available: !!body.is_available,
          balances: body.balance_infos.map((b) => ({
            currency: b && b.currency ? String(b.currency) : 'CNY',
            total: b && b.total_balance != null ? String(b.total_balance) : null,
            granted: b && b.granted_balance != null ? String(b.granted_balance) : null,
            toppedUp: b && b.topped_up_balance != null ? String(b.topped_up_balance) : null
          }))
        }
      }
      return null
    }
    if (kind === 'openrouter') {
      const d = body && body.data
      if (d && (typeof d.limit === 'number' || typeof d.usage === 'number')) {
        const remaining = typeof d.limit === 'number' && typeof d.usage === 'number' ? d.limit - d.usage : null
        return { balances: [{ currency: 'USD', total: remaining != null ? remaining.toFixed(2) : null }] }
      }
      return null
    }
    if (kind === 'siliconflow') {
      if (body && typeof body.balance === 'number') {
        return { balances: [{ currency: 'CNY', total: body.balance.toFixed(2) }] }
      }
      return null
    }
    if (kind === 'newapi') {
      const d = body && body.data
      if (d && typeof d.quota === 'number') {
        const total = (d.quota + (d.used_quota || 0)) / 500000
        const used = (d.used_quota || 0) / 500000
        return { balances: [{ currency: 'USD', total: total.toFixed(2), used: used.toFixed(2) }], is_available: body.success !== false }
      }
      return null
    }
    if (body && typeof body.balance === 'number') {
      return { balances: [{ currency: body.currency || 'USD', total: body.balance.toFixed(2) }] }
    }
    if (body && body.data && typeof body.data.balance === 'number') {
      return { balances: [{ currency: body.data.currency || 'USD', total: body.data.balance.toFixed(2) }] }
    }
    if (body && Array.isArray(body.balance_infos)) {
      return { balances: body.balance_infos.map((b) => ({ currency: b.currency || 'USD', total: b.total_balance != null ? String(b.total_balance) : null })) }
    }
    return null
  }
  function runAttempt(argv, env, cwd) {
    return new Promise((resolve) => {
      const sub = ctx.get('subprocess')
      if (!sub) { resolve(null); return }
      let handle
      try {
        handle = sub.spawn({
          argv,
          cwd,
          stdio: { stdin: 'ignore', stdout: { maxBytes: 16384 }, stderr: { maxBytes: 4096 } },
          graceMs: 5000,
          env
        })
      } catch (err) {
        resolve(null)
        return
      }
      handle.done.then(
        (outcome) => {
          let text = ''
          let errText = ''
          try {
            if (handle.collected && handle.collected.stdout) text = handle.collected.stdout.readFrom(0).text || ''
            if (handle.collected && handle.collected.stderr) errText = handle.collected.stderr.readFrom(0).text || ''
          } catch (err) { /* ignore */ }
          resolve({ exitCode: outcome && typeof outcome.exitCode === 'number' ? outcome.exitCode : -1, text, errText })
        },
        () => resolve(null)
      )
    })
  }
  async function httpGet(url, key) {
    const sp = ctx.get('sandboxPolicy')
    let cwd = '/'
    try { const p = sp && sp.resolve(); if (p && p.workspaceRoot) cwd = p.workspaceRoot } catch (e) { /* fallback */ }
    const sep = '\n__HTTP__'
    const curlAttempt = {
      argv: ['curl.exe', '-sS', '-L', '-m', '30', '-w', sep + '%{http_code}', '-H', 'Accept: application/json', '-H', 'Authorization: Bearer ' + key, url],
      env: undefined
    }
    const psCommand = "$h=@{Authorization='Bearer '+$env:DSH_UBK}; (Invoke-RestMethod -Uri '" + url + "' -Headers $h -TimeoutSec 30) | ConvertTo-Json -Compress -Depth 5"
    const psAttempt = {
      argv: ['powershell.exe', '-NoProfile', '-NonInteractive', '-Command', psCommand],
      env: { DSH_UBK: key }
    }
    for (const attempt of [curlAttempt, psAttempt]) {
      const result = await runAttempt(attempt.argv, attempt.env, cwd)
      if (result === null) continue
      const body = (result.text || '').trim()
      if (result.exitCode === 0 && body.length > 0) return { ok: true, text: body }
      const diag = (result.errText || body).trim().slice(0, 200)
      if (attempt === curlAttempt) continue
      return { ok: false, error: diag || '余额请求失败' }
    }
    return { ok: false, error: '未找到可用的查询程序(curl/powershell)' }
  }
  function collectRoutes() {
    const routes = []
    let ds = null
    let piAi = null
    const settingsSvc = ctx.get('settings')
    if (settingsSvc) {
      try { const v = settingsSvc.get('llm-deepseek'); if (v && typeof v === 'object') ds = v } catch (e) { /* default */ }
      try { const v = settingsSvc.get('llm-pi-ai'); if (v && typeof v === 'object') piAi = v } catch (e) { /* default */ }
    }
    routes.push({
      route: 'deepseek-official',
      label: 'DeepSeek 官方',
      baseURL: (ds && ds.baseURL) || 'https://api.deepseek.com',
      apiKeyEnv: (ds && ds.apiKeyEnv) || 'DEEPSEEK_API_KEY'
    })
    const providers = piAi && piAi.providers && typeof piAi.providers === 'object' ? piAi.providers : {}
    for (const routeName of Object.keys(providers)) {
      const p = providers[routeName]
      if (!p || typeof p !== 'object' || !p.baseURL) continue
      routes.push({ route: routeName, label: routeName, baseURL: String(p.baseURL), apiKeyEnv: p.apiKeyEnv ? String(p.apiKeyEnv) : undefined })
    }
    return routes
  }
  async function queryRoute(route) {
    const cred = ctx.get('credentials')
    let key = null
    if (cred) {
      try {
        const r = await cred.resolve(route.apiKeyEnv || 'DEEPSEEK_API_KEY')
        key = r ? r.value : null
      } catch (e) { /* unconfigured */ }
    }
    const base = { route: route.route, label: route.label, configured: !!key, fetchedAt: Date.now() }
    if (!key) return Object.assign({}, base, { error: '未配置 API Key(' + (route.apiKeyEnv || 'DEEPSEEK_API_KEY') + ')' })
    const tmpl = templateFor(route)
    if (!tmpl) return Object.assign({}, base, { error: '该路由暂无余额查询模板(主机 ' + hostOf(route.baseURL) + ')' })
    const res = await httpGet(tmpl.url, key)
    if (!res.ok) return Object.assign({}, base, { error: res.error, transient: true })
    const sep = '\n__HTTP__'
    const idx = res.text.lastIndexOf(sep)
    const code = idx >= 0 ? parseInt(res.text.slice(idx + sep.length).trim(), 10) || 0 : 0
    const bodyText = idx >= 0 ? res.text.slice(0, idx) : res.text
    let body = null
    try { body = JSON.parse(bodyText) } catch (e) {
      return Object.assign({}, base, { error: '响应解析失败(HTTP ' + code + ')', transient: code === 0 })
    }
    if (code >= 400) {
      const transient = code >= 500 || code === 429
      const msg = (body && body.error && (body.error.message || body.error)) || ('HTTP ' + code)
      return Object.assign({}, base, { error: String(msg), transient })
    }
    const extracted = extract(tmpl.kind, body)
    if (!extracted) return Object.assign({}, base, { error: '响应格式无法识别', transient: true })
    return Object.assign({}, base, extracted)
  }
  async function balanceData(args) {
    const force = !!(args && args.force === true)
    const now = Date.now()
    if (!force && lastBalance && now - lastBalance.at < BALANCE_CACHE_TTL) return lastBalance.result
    const routes = collectRoutes()
    const results = []
    for (const route of routes) {
      const res = await queryRoute(route)
      if (!res.error) {
        lastGoodByRoute.set(route.route, { result: res, at: now })
        results.push(res)
      } else if (res.transient && lastGoodByRoute.has(route.route)) {
        const prev = lastGoodByRoute.get(route.route)
        if (now - prev.at < LAST_GOOD_TTL) results.push(Object.assign({}, prev.result, { stale: true, error: res.error }))
        else results.push(res)
      } else {
        if (!res.transient) lastGoodByRoute.delete(route.route)
        results.push(res)
      }
    }
    const result = { routes: results, at: now }
    lastBalance = { at: now, result }
    return result
  }

  function dayKey(ms) {
    const d = new Date(ms)
    const p = (n) => String(n).padStart(2, '0')
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate())
  }
  async function trendsData(args) {
    await ensureBackfilled()
    if (args && args.days === 'today') {
      const now = new Date()
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
      const buckets = []
      for (let i = 0; i < 24; i++) {
        const key = todayStart + i * 3600000
        buckets.push({ hour: i, date: dayKey(key), calls: 0, input: 0, output: 0, cacheRead: 0, cacheWrite: 0, reasoning: 0, cost: {} })
      }
      for (const r of records) {
        if (r.time < todayStart || r.time >= todayStart + 86400000) continue
        const b = buckets[new Date(r.time).getHours()]
        if (!b) continue
        b.calls += 1
        b.input += r.input
        b.output += r.output
        b.cacheRead += r.cacheRead
        b.cacheWrite += r.cacheWrite
        b.reasoning += r.reasoning
        addCost(b.cost, costOf(r))
      }
      const trends = []
      for (const b of buckets) {
        b.tokens = b.input + b.output + b.cacheRead + b.cacheWrite
        b.totalInput = b.input + b.cacheRead
        b.cost = displayCost(b.cost)
        trends.push(b)
      }
      return { days: 'today', trends }
    }
    const days = (args && (args.days === 7 || args.days === 14 || args.days === 30 || args.days === 31)) ? args.days : 30
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const start = todayStart - (days - 1) * 86400000
    const end = todayStart + 86400000 - 1
    const map = new Map()
    for (let i = 0; i < days; i++) {
      const key = dayKey(start + i * 86400000)
      map.set(key, { date: key, calls: 0, input: 0, output: 0, cacheRead: 0, cacheWrite: 0, reasoning: 0, cost: {} })
    }
    for (const r of records) {
      if (r.time < start || r.time > end) continue
      const d = map.get(dayKey(r.time))
      if (!d) continue
      d.calls += 1
      d.input += r.input
      d.output += r.output
      d.cacheRead += r.cacheRead
      d.cacheWrite += r.cacheWrite
      d.reasoning += r.reasoning
      addCost(d.cost, costOf(r))
    }
    const trends = []
    for (const d of map.values()) {
      d.tokens = d.input + d.output + d.cacheRead + d.cacheWrite
      d.totalInput = d.input + d.cacheRead
      d.cost = displayCost(d.cost)
      trends.push(d)
    }
    return { days, trends }
  }

  // ---------- business RPC ----------
  function pricingView(ok) {
    return { pricing, persisted: ok === undefined ? pricingPersisted : ok, displayCurrency, usdCnyRate }
  }
  async function summaryData(args) {
    await ensureBackfilled()
    const rangeDays = (args && (args.rangeDays === 1 || args.rangeDays === 7 || args.rangeDays === 14 || args.rangeDays === 30)) ? args.rangeDays : 0
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const startMs = rangeDays > 0 ? todayStart.getTime() - (rangeDays - 1) * 86400000 : 0
    const list = rangeDays > 0 ? records.filter((r) => r.time >= startMs) : records
    const totals = aggList(list)
    totals.cost = displayCost(totals.cost)
    const modelMap = new Map()
    for (const r of list) {
      const k = (r.provider || '?') + '\u0000' + (r.model || '?')
      let m = modelMap.get(k)
      if (!m) {
        m = { provider: r.provider, model: r.model, calls: 0, input: 0, output: 0, cacheRead: 0, cacheWrite: 0, reasoning: 0, cost: {} }
        modelMap.set(k, m)
      }
      m.calls += 1
      m.input += r.input
      m.output += r.output
      m.cacheRead += r.cacheRead
      m.cacheWrite += r.cacheWrite
      m.reasoning += r.reasoning
      addCost(m.cost, costOf(r))
    }
    const byModel = Array.from(modelMap.values()).sort((a, b) => (b.input + b.output) - (a.input + a.output))
    for (const m of byModel) m.cost = displayCost(m.cost)
    const sessionMap = new Map()
    for (const r of list) {
      let s = sessionMap.get(r.sessionId)
      if (!s) {
        s = { sessionId: r.sessionId, calls: 0, input: 0, output: 0, cacheRead: 0, cacheWrite: 0, reasoning: 0, cost: {}, lastTime: 0 }
        sessionMap.set(r.sessionId, s)
      }
      s.calls += 1
      s.input += r.input
      s.output += r.output
      s.cacheRead += r.cacheRead
      s.cacheWrite += r.cacheWrite
      s.reasoning += r.reasoning
      if (r.time > s.lastTime) s.lastTime = r.time
      addCost(s.cost, costOf(r))
    }
    const bySession = Array.from(sessionMap.values()).sort((a, b) => (b.input + b.output) - (a.input + a.output)).slice(0, 10)
    for (const s of bySession) {
      s.cost = displayCost(s.cost)
      s.title = await titleOf(s.sessionId)
    }
    const recent = list.slice(-20).reverse().map((r) => ({
      time: r.time, sessionId: r.sessionId, provider: r.provider, model: r.model,
      input: r.input, output: r.output, cacheRead: r.cacheRead, cacheWrite: r.cacheWrite, reasoning: r.reasoning,
      cost: displayCost(costMapOf(costOf(r)))
    }))
    for (const r of recent) r.title = await titleOf(r.sessionId)
    return { backfilling, done: backfillDone, total: backfillTotal, rangeDays, totals, byModel, bySession, recent, callCount: list.length }
  }
  async function sessionData(args) {
    const sid = args && args.sessionId ? String(args.sessionId) : null
    if (!sid) return { count: 0, totals: emptyAgg(), today: emptyAgg() }
    const list = records.filter((r) => r.sessionId === sid)
    const totals = aggList(list)
    totals.cost = displayCost(totals.cost)
    const today = aggList(list.filter((r) => isToday(r.time)))
    today.cost = displayCost(today.cost)
    return { count: totals.calls, totals, today }
  }
  function exportData() {
    return { count: records.length, records: records.slice(-5000) }
  }
  async function pricingOp(args) {
    if (!args || !args.action) return pricingView()
    if (args.action === 'reset') {
      pricing = cloneJson(DEFAULT_PRICING)
      return pricingView(await savePricing())
    }
    if (args.action === 'config') {
      const cfg = args.config && typeof args.config === 'object' ? args.config : {}
      if (cfg.displayCurrency === 'auto' || cfg.displayCurrency === 'USD' || cfg.displayCurrency === 'CNY') displayCurrency = cfg.displayCurrency
      const rate = Number(cfg.usdCnyRate)
      if (Number.isFinite(rate) && rate > 0) usdCnyRate = rate
      return pricingView(await savePricing())
    }
    const entry = args.entry && typeof args.entry === 'object' ? args.entry : null
    if (!entry || !entry.model) return Object.assign({ error: '缺少 model' }, pricingView())
    if (args.action === 'set') {
      const clean = {
        provider: entry.provider ? String(entry.provider) : '*',
        model: String(entry.model),
        currency: entry.currency === 'USD' ? 'USD' : 'CNY',
        inputMiss: Number(entry.inputMiss) || 0,
        inputHit: Number(entry.inputHit) || 0,
        output: Number(entry.output) || 0,
        effectiveFrom: typeof entry.effectiveFrom === 'number' ? entry.effectiveFrom : 0
      }
      if (entry.offPeak) {
        clean.peakHoursUTC = DEEPSEEK_PEAK
        clean.offPeak = {
          inputMiss: Number(entry.offPeak.inputMiss) || 0,
          inputHit: Number(entry.offPeak.inputHit) || 0,
          output: Number(entry.offPeak.output) || 0
        }
      }
      const idx = pricing.findIndex((x) => x.provider === clean.provider && x.model === clean.model && (x.effectiveFrom || 0) === clean.effectiveFrom)
      if (idx >= 0) pricing[idx] = clean
      else pricing.push(clean)
      return pricingView(await savePricing())
    }
    if (args.action === 'delete') {
      const provider = entry.provider ? String(entry.provider) : '*'
      const model = String(entry.model)
      const eff = typeof entry.effectiveFrom === 'number' ? entry.effectiveFrom : 0
      pricing = pricing.filter((x) => !(x.provider === provider && x.model === model && (x.effectiveFrom || 0) === eff))
      return pricingView(await savePricing())
    }
    return pricingView()
  }

  // ---------- HTTP routes for the client half ----------
  // bundle 挂载时序:webServer 服务可能尚未就绪,用 ctx.inject 等待注入后注册;
  // 若运行环境不支持 inject 则回退为直接获取。
  function registerRoutes(wctx) {
    wctx.effect(() => wctx.webServer.register({
      kind: 'exact',
      path: '/api/token-stats/trends',
      handler: async (req, res) => {
        let days = 30
        try {
          const raw = new URL(req.url || '/', 'http://x').searchParams.get('days')
          days = raw === 'today' ? 'today' : (Number(raw) || 30)
        } catch (e) { /* default */ }
        sendJson(res, 200, await trendsData({ days }))
      }
    }))
    wctx.effect(() => wctx.webServer.register({
      kind: 'exact',
      path: '/api/token-stats/summary',
      handler: async (req, res) => {
        let rangeDays = 0
        try { rangeDays = Number(new URL(req.url || '/', 'http://x').searchParams.get('rangeDays') || 0) } catch (e) { /* default */ }
        sendJson(res, 200, await summaryData({ rangeDays }))
      }
    }))
    wctx.effect(() => wctx.webServer.register({
      kind: 'exact',
      path: '/api/token-stats/session',
      handler: async (req, res) => {
        let sessionId = null
        try { sessionId = new URL(req.url || '/', 'http://x').searchParams.get('sessionId') } catch (e) { /* default */ }
        sendJson(res, 200, await sessionData({ sessionId }))
      }
    }))
    wctx.effect(() => wctx.webServer.register({
      kind: 'exact',
      path: '/api/token-stats/export',
      handler: (req, res) => sendJson(res, 200, exportData())
    }))
    wctx.effect(() => wctx.webServer.register({
      kind: 'exact',
      path: '/api/token-stats/pricing',
      handler: async (req, res) => {
        if (req.method === 'POST') {
          const body = await readBody(req, 64 * 1024)
          let args = null
          try { args = JSON.parse(body) } catch (e) { /* invalid */ }
          sendJson(res, 200, await pricingOp(args))
          return
        }
        sendJson(res, 200, pricingView())
      }
    }))
    wctx.effect(() => wctx.webServer.register({
      kind: 'exact',
      path: '/api/token-stats/balance',
      handler: async (req, res) => {
        let force = false
        try { force = new URL(req.url || '/', 'http://x').searchParams.get('force') === '1' } catch (e) { /* default */ }
        sendJson(res, 200, await balanceData({ force }))
      }
    }))
  }
  if (typeof ctx.inject === 'function') {
    ctx.inject(['webServer'], registerRoutes)
  } else {
    const webServer = ctx.get('webServer')
    if (webServer) registerRoutes(ctx)
  }

  // ---------- lifecycle ----------
  void loadPricing().then(() => {
    if (!pricing.length) pricing = cloneJson(DEFAULT_PRICING)
    return backfill()
  }).then(() => {
    if (!liveStarted) {
      liveStarted = true
      ctx.on('session/event', (session, event) => {
        const id = session && session.id
        if (!id || !event) return
        fold(String(id), event.time, event.type, event.data)
      })
    }
    if (records.length === 0) scheduleBackfillRetry()
  }).catch((err) => {
    console.error('[token-usage] init failed:', err)
    if (!liveStarted) {
      liveStarted = true
      ctx.on('session/event', (session, event) => {
        const id = session && session.id
        if (!id || !event) return
        fold(String(id), event.time, event.type, event.data)
      })
    }
    if (records.length === 0) scheduleBackfillRetry()
  })
}

export { name, apply }
export default { name, apply }
