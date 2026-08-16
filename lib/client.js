// dsh-token-usage Client half (static bundle form)
// Loaded by dsh-client-modules as the package's browser face; communicates with
// the host half through /api/token-stats/* routes registered on webServer.

window.__ModuleLoader__.load({
  id: 'dsh-token-usage',
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    const React = require('react');

    const CSS_ID = 'dsh-token-usage/dashboard.css';
    const CSS = '.tsu-root{display:flex;flex-direction:column;gap:22px;max-width:760px;padding:6px 2px 28px}.tsu-seg{display:inline-flex;align-self:flex-start;gap:2px;padding:3px;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:999px}.tsu-seg button{border:0;background:transparent;color:var(--dsw-alias-label-secondary);font-size:12.5px;font-family:inherit;line-height:1;padding:7px 14px;border-radius:999px;cursor:pointer;transition:color .15s ease,background .15s ease,box-shadow .15s ease}.tsu-seg button:hover{color:var(--dsw-alias-label-primary)}.tsu-seg button.on{background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-primary);box-shadow:0 1px 3px rgba(0,0,0,.12),0 0 0 1px var(--dsw-alias-border-l1) inset}.tsu-hero{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;flex-wrap:wrap;animation:tsuRise .4s ease both}.tsu-hero-main{display:flex;flex-direction:column;gap:6px}.tsu-hero-cost{font-size:42px;font-weight:650;letter-spacing:-.025em;line-height:1;color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums}.tsu-hero-cap{font-size:12px;color:var(--dsw-alias-label-secondary);letter-spacing:.05em}.tsu-hero-side{display:flex;flex-direction:column;align-items:flex-end;gap:6px;text-align:right}.tsu-hero-side .tsu-hero-num{font-size:18px;font-weight:600;color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums;line-height:1}.tsu-metrics{display:grid;grid-template-columns:repeat(auto-fit,minmax(104px,1fr));gap:10px;animation:tsuRise .4s .05s ease both}.tsu-metric{display:flex;flex-direction:column;gap:4px;padding:12px 14px;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:14px;transition:border-color .15s ease,transform .15s ease}.tsu-metric:hover{border-color:var(--dsw-alias-border-l2);transform:translateY(-1px)}.tsu-metric .v{font-size:15px;font-weight:600;color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.tsu-metric .l{font-size:11.5px;color:var(--dsw-alias-label-secondary);line-height:1.3}.tsu-sec{display:flex;flex-direction:column;gap:10px;animation:tsuRise .4s .1s ease both}.tsu-sec-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.tsu-sec-title{font-size:13.5px;font-weight:600;color:var(--dsw-alias-label-primary);letter-spacing:.02em}.tsu-sec-note{font-size:12px;color:var(--dsw-alias-label-secondary)}.tsu-card{background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:14px;padding:14px 16px}.tsu-bal{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}.tsu-bal-info{display:flex;flex-direction:column;gap:5px;min-width:0}.tsu-bal-name{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;color:var(--dsw-alias-label-primary)}.tsu-dot{width:7px;height:7px;border-radius:50%;background:var(--dsw-alias-state-success-primary);flex:none}.tsu-dot.off{background:var(--dsw-alias-state-error-primary)}.tsu-bal-nums{display:flex;gap:14px;flex-wrap:wrap;font-size:12.5px;color:var(--dsw-alias-label-secondary)}.tsu-bal-nums b{font-weight:600;color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums}.tsu-bal-err{font-size:12px;color:var(--dsw-alias-state-error-primary)}.tsu-stale{font-size:11px;color:var(--dsw-alias-state-warn-primary)}.tsu-table{width:100%;border-collapse:collapse;font-size:12.5px}.tsu-table th{text-align:left;color:var(--dsw-alias-label-secondary);font-weight:500;font-size:11.5px;letter-spacing:.04em;padding:8px 10px;border-bottom:1px solid var(--dsw-alias-border-l1);white-space:nowrap}.tsu-table td{padding:9px 10px;border-bottom:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-primary);vertical-align:top}.tsu-table tr:last-child td{border-bottom:0}.tsu-table tbody tr{transition:background .12s ease}.tsu-table tbody tr:hover{background:var(--dsw-alias-bg-base)}.tsu-table .num{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}.tsu-table .sub{color:var(--dsw-alias-label-secondary)}.tsu-empty{padding:18px;text-align:center;color:var(--dsw-alias-label-secondary);font-size:12.5px}.tsu-btn{background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-primary);border-radius:999px;padding:6px 14px;font-size:12px;cursor:pointer;font-family:inherit;transition:background .15s ease,border-color .15s ease;white-space:nowrap}.tsu-btn:hover{background:var(--dsw-alias-bg-overlay);border-color:var(--dsw-alias-border-l2)}.tsu-btn.ghost{background:transparent}.tsu-input{background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-primary);border-radius:10px;padding:7px 10px;font-size:12.5px;font-family:inherit;min-width:0;width:110px;transition:border-color .15s ease;outline:none}.tsu-input:focus{border-color:var(--dsw-alias-brand-primary)}.tsu-input.wide{width:170px}.tsu-select{background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-primary);border-radius:10px;padding:7px 10px;font-size:12.5px;font-family:inherit}.tsu-mono{font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:12px;color:var(--dsw-alias-label-secondary)}.tsu-readout{font-size:12px;color:var(--dsw-alias-label-secondary);line-height:20px}.tsu-hint{font-size:11.5px;color:var(--dsw-alias-label-secondary)}.tsu-msg{font-size:12px;color:var(--dsw-alias-label-secondary)}.tsu-form{display:flex;flex-wrap:wrap;gap:8px;align-items:center}.tsu-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;min-width:0}.tsu-back{display:inline-flex;align-items:center;gap:8px;font-size:12px;color:var(--dsw-alias-label-secondary)}.tsu-back i{width:6px;height:6px;border-radius:50%;background:var(--dsw-alias-brand-primary);display:inline-block;animation:tsuPulse 2s ease infinite}.tsu-legend{display:flex;flex-wrap:wrap;gap:4px 14px;margin-bottom:8px}.tsu-legend button{display:inline-flex;align-items:center;gap:6px;border:0;background:transparent;cursor:pointer;font-family:inherit;font-size:12px;color:var(--dsw-alias-label-secondary);padding:2px 4px;border-radius:6px;transition:opacity .15s ease,background .15s ease}.tsu-legend button:hover{background:var(--dsw-alias-bg-base)}.tsu-legend button.off{opacity:.35}.tsu-legend button.off i{box-shadow:inset 0 0 0 1px var(--dsw-alias-border-l1)}.tsu-legend i{width:8px;height:8px;border-radius:50%;display:inline-block;flex:none}.tsu-today-tag{color:var(--dsw-alias-brand-primary);font-weight:600}.tsu-heat{display:flex;flex-direction:column;gap:8px;align-items:center}.tsu-heat-svg{width:100%;height:auto;display:block}.tsu-heat-cell{transition:filter .15s ease}.tsu-heat-cell:hover{filter:brightness(1.18)}.tsu-heat-legend{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--dsw-alias-label-secondary)}.tsu-heat-legend i{width:10px;height:10px;border-radius:3px;display:inline-block}.tsu-pie-wrap{display:flex;align-items:center;gap:24px;flex-wrap:wrap}.tsu-pie-legend{display:flex;flex-direction:column;gap:6px;min-width:200px;flex:1}.tsu-pie-item{display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--dsw-alias-label-primary)}.tsu-pie-item i{width:10px;height:10px;border-radius:3px;flex:none}.tsu-pie-seg{transition:stroke-width .18s ease}.tsu-pie-item{transition:background .15s ease;border-radius:8px;padding:2px 6px;margin:0 -6px}.tsu-pie-item.on{background:var(--dsw-alias-bg-base)}.tsu-pie-item .nm{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tsu-pie-item .vl{margin-left:auto;font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-secondary);white-space:nowrap}.tsu-topup{background:var(--dsw-alias-brand-primary);border:0;color:#fff;border-radius:999px;padding:4px 12px;font-size:12px;cursor:pointer;font-family:inherit;margin-left:4px;transition:filter .15s ease}.tsu-topup:hover{filter:brightness(1.15)}@keyframes tsuPulse{0%,100%{opacity:1}50%{opacity:.35}}@keyframes tsuRise{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}';
    if (typeof document !== 'undefined' && document.querySelector('style[data-plugin-css="' + CSS_ID + '"]') === null) {
      const tag = document.createElement('style');
      tag.setAttribute('data-plugin-css', CSS_ID);
      tag.textContent = CSS;
      document.head.appendChild(tag);
    }

    // Host API helper (webServer routes).
    async function api(path, args) {
      let url = '/api/token-stats/' + path;
      const init = { headers: { accept: 'application/json' } };
      if (path === 'summary' && args) url += '?rangeDays=' + (args.rangeDays || 0);
      else if (path === 'trends' && args) url += '?days=' + encodeURIComponent(String(args.days || 30));
      else if (path === 'session' && args) url += '?sessionId=' + encodeURIComponent(String(args.sessionId));
      else if (path === 'balance' && args) url += '?force=' + (args.force ? '1' : '0');
      else if (path === 'pricing' && args && args.action) {
        init.method = 'POST';
        init.headers['content-type'] = 'application/json';
        init.body = JSON.stringify(args);
      }
      const res = await fetch(url, init);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    }

    const h = React.createElement;
    const fmt = (n) => (typeof n === 'number' ? n.toLocaleString('en-US') : '0');
    const fmtShort = (n) => {
      if (typeof n !== 'number') return '0';
      if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
      if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
      if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
      return String(n);
    };
    const sym = (c) => (c === 'CNY' ? '¥' : c === 'USD' ? '$' : c + ' ');
    const fmtCost = (cost) => {
      if (!cost) return '—';
      const keys = Object.keys(cost);
      if (!keys.length) return '—';
      return keys.map((k) => sym(k) + Number(cost[k]).toFixed(4).replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '')).join(' + ');
    };
    const fmtTime = (t) => { try { return new Date(t).toLocaleString(); } catch (e) { return ''; } };
    const short = (s, n) => { const str = String(s || ''); const len = n || 22; return str.length > len ? str.slice(0, len) + '…' : str; };
    const tokensOf = (a) => (a ? a.input + a.output + a.cacheRead + a.cacheWrite : 0);
    const RANGES = [{ d: 1, label: '今天' }, { d: 7, label: '近7天' }, { d: 14, label: '近14天' }, { d: 30, label: '近30天' }, { d: 0, label: '全部' }];

    function Metric(props) {
      return h('div', { className: 'tsu-metric' },
        h('div', { className: 'v', title: props.value }, props.value),
        h('div', { className: 'l' }, props.label));
    }

    function smoothPath(pts) {
      if (!pts.length) return '';
      let d = 'M' + pts[0].x + ' ' + pts[0].y;
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i], b = pts[i + 1];
        const mx = (a.x + b.x) / 2;
        d += ' C' + mx + ' ' + a.y + ',' + mx + ' ' + b.y + ',' + b.x + ' ' + b.y;
      }
      return d;
    }

    function pad2(n) { return String(n).padStart(2, '0'); }
    function dateKey(d) { return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }

    // 当月日历热力图:7 列(周一~周日)横向铺满,格子显示日期与当日 tokens,蓝色系深浅
    function HeatmapBlock() {
      const [data, setData] = React.useState(null);
      React.useEffect(() => {
        let alive = true;
        const load = () => {
          api('trends', { days: 31 }).then((r) => { if (alive) setData(r); }).catch(() => {});
        };
        load();
        const t = setInterval(load, 60000);
        return () => { alive = false; clearInterval(t); };
      }, []);
      const trends = data && data.trends ? data.trends : [];
      const byDate = {};
      let maxV = 0;
      for (const t of trends) {
        byDate[t.date] = t;
        if (t.tokens > maxV) maxV = t.tokens;
      }
      const today = new Date();
      const y = today.getFullYear(), m = today.getMonth();
      const daysInMonth = new Date(y, m + 1, 0).getDate();
      const startDow = (new Date(y, m, 1).getDay() + 6) % 7; // 周一=0
      const rows = Math.ceil((startDow + daysInMonth) / 7);
      const cell = 40, gap = 6, headH = 20;
      const viewW = 7 * (cell + gap) - gap;
      const viewH = headH + rows * (cell + gap);
      const levels = ['rgba(255,255,255,.05)', 'rgba(59,130,246,.22)', 'rgba(59,130,246,.4)', 'rgba(59,130,246,.62)', '#3b82f6'];
      const lvlOf = (v) => {
        if (!v || !maxV) return 0;
        const r = v / maxV;
        return r >= 0.8 ? 4 : r >= 0.55 ? 3 : r >= 0.3 ? 2 : 1;
      };
      const todayKey = dateKey(today);
      const cells = [];
      for (let d = 1; d <= daysInMonth; d++) {
        const day = new Date(y, m, d);
        const k = dateKey(day);
        const t = byDate[k];
        const lvl = t ? lvlOf(t.tokens) : 0;
        const idx = startDow + d - 1;
        const col = idx % 7, row = Math.floor(idx / 7);
        const x = col * (cell + gap), cy = headH + row * (cell + gap);
        const isToday = k === todayKey;
        const isFuture = day > today;
        cells.push(h('rect', {
          key: k,
          className: 'tsu-heat-cell',
          x, y: cy, width: cell, height: cell, rx: 10,
          fill: isFuture ? 'rgba(255,255,255,.03)' : (lvl ? levels[lvl] : 'rgba(255,255,255,.05)'),
          stroke: isToday ? 'var(--dsw-alias-brand-primary)' : (isFuture ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.08)'),
          strokeWidth: isToday ? 2 : 1,
          strokeDasharray: isFuture && !isToday ? '4 4' : undefined
        }));
        cells.push(h('text', { key: 'd' + k, x: x + cell / 2, y: cy + cell / 2 + 3.5, fontSize: 11.5, fontWeight: isToday ? 700 : 600, textAnchor: 'middle', fill: isFuture ? 'rgba(255,255,255,.22)' : (lvl >= 3 ? '#fff' : 'var(--dsw-alias-label-primary)') }, String(d)));
        cells.push(h('rect', {
          key: 'hit' + k,
          className: 'tsu-heat-cell',
          x, y: cy, width: cell, height: cell, rx: 10,
          fill: 'transparent'
        }, h('title', null, k + (t ? ' · ' + fmtShort(t.tokens) + ' tokens · ' + fmt(t.calls) + ' 次调用' : (isFuture ? ' · 未到' : ' · 无用量')))));
      }
      const headCells = ['一', '二', '三', '四', '五', '六', '日'].map((lb, i) =>
        h('text', { key: 'hd' + i, x: i * (cell + gap) + cell / 2, y: 14, fontSize: 9.5, fontWeight: 600, fill: 'var(--dsw-alias-label-secondary)', textAnchor: 'middle' }, lb));
      const monthTitle = y + '年' + (m + 1) + '月';
      const legend = h('div', { className: 'tsu-heat-legend' },
        h('span', null, '少'),
        levels.map((c, i) => h('i', { key: i, style: { background: c } })),
        h('span', null, '多'));
      return h('div', { className: 'tsu-sec' },
        h('div', { className: 'tsu-sec-head' },
          h('span', { className: 'tsu-sec-title' }, '活跃热力图'),
          h('div', { className: 'tsu-row' },
            h('span', { className: 'tsu-sec-note' }, monthTitle),
            legend)),
        h('div', { className: 'tsu-card' },
          trends.length === 0 ? h('div', { className: 'tsu-empty' }, '暂无数据')
            : h('svg', { viewBox: '0 0 ' + viewW + ' ' + viewH, style: { width: viewW, height: viewH, display: 'block', margin: '0 auto' } },
                headCells,
                cells)));
    }

    // 模型占比环图(仿 Zcode 模型用量环图,按 tokens 占比,悬停联动)
    function ModelPieBlock(props) {
      const models = props.models || [];
      const [hoverIdx, setHoverIdx] = React.useState(null);
      const PALETTE = ['#fb923c', '#22d3ee', '#a3e635', '#f43f5e', '#a78bfa', '#f59e0b', '#38bdf8', '#34d399', '#e879f9', '#94a3b8'];
      const items = models.map((m, i) => ({
        key: (m.provider || '?') + '/' + (m.model || '?'),
        label: short(m.model || '?', 20),
        value: tokensOf(m),
        color: PALETTE[i % PALETTE.length]
      })).filter((it) => it.value > 0);
      const total = items.reduce((s, it) => s + it.value, 0);
      const R = 52, CX = 70, CY = 70, SW = 15;
      const C = 2 * Math.PI * R;
      let acc = 0;
      const segs = items.map((it, i) => {
        const frac = total > 0 ? it.value / total : 0;
        const dash = frac * C;
        const isHover = hoverIdx === i;
        const el = h('circle', {
          key: it.key,
          className: 'tsu-pie-seg',
          cx: CX, cy: CY, r: R,
          fill: 'none',
          stroke: it.color,
          strokeWidth: isHover ? 20 : SW,
          strokeDasharray: Math.max(dash - 1.5, 0.5) + ' ' + C,
          strokeDashoffset: -acc * C,
          transform: 'rotate(-90 ' + CX + ' ' + CY + ')',
          style: { cursor: 'pointer' },
          onMouseEnter: () => setHoverIdx(i),
          onMouseLeave: () => setHoverIdx(null)
        }, h('title', null, it.label + ' · ' + fmtShort(it.value) + ' tokens · ' + (frac * 100).toFixed(1) + '%'));
        acc += frac;
        return el;
      });
      const centerItem = hoverIdx != null && items[hoverIdx] ? items[hoverIdx] : null;
      const centerVal = centerItem ? (centerItem.value / total * 100).toFixed(1) + '%' : fmtShort(total);
      const centerLabel = centerItem ? centerItem.label : 'tokens';
      const legend = items.map((it, i) =>
        h('div', { key: it.key, className: 'tsu-pie-item' + (hoverIdx === i ? ' on' : ''), style: { cursor: 'pointer' }, onMouseEnter: () => setHoverIdx(i), onMouseLeave: () => setHoverIdx(null) },
          h('i', { style: { background: it.color } }),
          h('span', { className: 'nm' }, it.label),
          h('span', { className: 'vl' }, (total > 0 ? (it.value / total * 100).toFixed(1) : '0') + '% · ' + fmtShort(it.value))));
      return h('div', { className: 'tsu-sec' },
        h('div', { className: 'tsu-sec-head' },
          h('span', { className: 'tsu-sec-title' }, '模型占比'),
          h('span', { className: 'tsu-sec-note' }, '按 tokens')),
        h('div', { className: 'tsu-card' },
          items.length === 0 ? h('div', { className: 'tsu-empty' }, '暂无数据')
            : h('div', { className: 'tsu-pie-wrap' },
                h('svg', { viewBox: '0 0 140 140', style: { width: 148, height: 148, flex: 'none' } },
                  h('circle', { key: 'track', cx: CX, cy: CY, r: R, fill: 'none', stroke: 'rgba(255,255,255,.06)', strokeWidth: SW, transform: 'rotate(-90 ' + CX + ' ' + CY + ')' }),
                  segs,
                  h('text', { key: 'cv', x: CX, y: CY - 1, textAnchor: 'middle', fontSize: 18, fontWeight: 700, fill: 'var(--dsw-alias-label-primary)' }, centerVal),
                  h('text', { key: 'cl', x: CX, y: CY + 15, textAnchor: 'middle', fontSize: 9.5, fill: 'var(--dsw-alias-label-secondary)' }, centerLabel)),
                h('div', { className: 'tsu-pie-legend' }, legend))));
    }

    function TrendsBlock() {
      const [days, setDays] = React.useState('today');
      const [data, setData] = React.useState(null);
      const [hover, setHover] = React.useState(null);
      const [hidden, setHidden] = React.useState({});
      React.useEffect(() => {
        let alive = true;
        const load = () => {
          api('trends', { days: days }).then((r) => { if (alive) setData(r); }).catch(() => {});
        };
        load();
        const t = setInterval(load, 15000);
        return () => { alive = false; clearInterval(t); };
      }, [days]);
      const trends = data && data.trends ? data.trends : [];
      const isToday = String(days) === 'today';
      const INPUT_COLOR = '#fb923c';
      const OUTPUT_COLOR = '#22d3ee';
      const CACHE_COLOR = '#a3e635';
      const COST_COLOR = '#f43f5e';
      const costOfDay = (t) => {
        if (!t || !t.cost) return 0;
        const vals = Object.keys(t.cost).map((k) => t.cost[k]);
        return vals.length ? vals[0] : 0;
      };
      const W = 640, H = 250, padL = 46, padR = 46, padT = 12, padB = 26;
      const plotW = W - padL - padR, plotH = H - padT - padB;
      const n = trends.length;
      const lastIdx = isToday ? new Date().getHours() : n - 1;
      const xOf = (i) => (n <= 1 ? padL + plotW / 2 : padL + (i / (n - 1)) * plotW);
      const SERIES = [
        { key: 'totalInput', label: '输入(总)', color: INPUT_COLOR },
        { key: 'output', label: '输出', color: OUTPUT_COLOR },
        { key: 'cacheRead', label: '缓存命中', color: CACHE_COLOR }
      ];
      const visibleTok = SERIES.filter((s) => !hidden[s.key]);
      // 输入(总)最后渲染,盖在缓存命中之上,避免 99% 重合时被遮住
      const renderTok = visibleTok.filter((s) => s.key !== 'totalInput').concat(visibleTok.filter((s) => s.key === 'totalInput'));
      let maxTok = 0;
      for (const t of trends) for (const s of visibleTok) if (t[s.key] > maxTok) maxTok = t[s.key];
      const showCost = !hidden.cost;
      let maxCost = 0;
      if (showCost) for (const t of trends) { const v = costOfDay(t); if (v > maxCost) maxCost = v; }
      const yTok = (v) => padT + plotH - (v / (maxTok || 1)) * plotH;
      const yCost = (v) => padT + plotH - (v / (maxCost || 1)) * plotH;
      const baseY = padT + plotH;
      const activeIdx = hover != null && hover >= 0 && hover < n ? hover : lastIdx;
      const active = activeIdx >= 0 && trends[activeIdx] ? trends[activeIdx] : null;

      const legend = h('div', { className: 'tsu-legend' },
        SERIES.map((s) => h('button', { key: s.key, className: hidden[s.key] ? 'off' : '', onClick: () => setHidden(Object.assign({}, hidden, { [s.key]: !hidden[s.key] })) },
          h('i', { style: { background: s.color } }), s.label)),
        h('button', { key: 'cost', className: hidden.cost ? 'off' : '', onClick: () => setHidden(Object.assign({}, hidden, { cost: !hidden.cost })) },
          h('i', { style: { background: COST_COLOR } }), '费用'));

      const infoLine = active
        ? h('div', { className: 'tsu-hint' },
            h('span', { className: 'tsu-today-tag' }, (isToday ? String(active.hour).padStart(2, '0') + ':00' : active.date) + (activeIdx === lastIdx && !isToday ? ' (今天)' : '')) +
            ' · 输入 ' + fmtShort(active.totalInput) + ' · 输出 ' + fmtShort(active.output) +
            ' · 缓存命中 ' + fmtShort(active.cacheRead) +
            (active.cost && Object.keys(active.cost).length ? ' · 费用 ' + fmtCost(active.cost) : ''))
        : h('div', { className: 'tsu-hint' }, '悬停查看每日明细,点击图例切换曲线');

      const gridLines = [0, 1, 2, 3].map((g) => {
        const y = padT + (plotH / 3) * g;
        const val = maxTok - (maxTok / 3) * g;
        return [
          h('line', { key: 'gl' + g, x1: padL, y1: y, x2: W - padR, y2: y, stroke: 'var(--dsw-alias-border-l1)', strokeDasharray: '3 3' }),
          h('text', { key: 'gt' + g, x: padL - 6, y: y + 3, fontSize: 9, fill: 'var(--dsw-alias-label-secondary)', textAnchor: 'end' }, fmtShort(val))
        ];
      });
      const costTicks = showCost ? [0, 1, 2].map((g) => {
        const y = padT + (plotH / 2) * g;
        const val = maxCost - (maxCost / 2) * g;
        return h('text', { key: 'ct' + g, x: W - padR + 6, y: y + 3, fontSize: 9, fill: 'var(--dsw-alias-label-secondary)' }, val.toFixed(2));
      }) : null;

      const paths = renderTok.map((s) => {
        const pts = trends.map((t, i) => ({ x: xOf(i), y: yTok(t[s.key]) }));
        const line = smoothPath(pts);
        let area = '';
        if (pts.length) {
          area = line + ' L' + pts[pts.length - 1].x + ' ' + baseY + ' L' + pts[0].x + ' ' + baseY + ' Z';
        }
        const gid = 'tsuGrad' + s.key;
        return [
          h('defs', { key: 'd' + s.key },
            h('linearGradient', { id: gid, x1: 0, y1: 0, x2: 0, y2: 1 },
              h('stop', { offset: '0%', stopColor: s.color, stopOpacity: 0.22 }),
              h('stop', { offset: '100%', stopColor: s.color, stopOpacity: 0 }))),
          h('path', { key: 'a' + s.key, d: area, fill: 'url(#' + gid + ')' }),
          h('path', { key: 'l' + s.key, d: line, fill: 'none', stroke: s.color, strokeWidth: 2 })
        ];
      });
      const costPath = showCost
        ? h('path', { key: 'cp', d: smoothPath(trends.map((t, i) => ({ x: xOf(i), y: yCost(costOfDay(t)) }))), fill: 'none', stroke: COST_COLOR, strokeWidth: 2, strokeDasharray: '4 4' })
        : null;
      const hoverLine = activeIdx >= 0
        ? h('line', { key: 'hl', x1: xOf(activeIdx), y1: padT, x2: xOf(activeIdx), y2: baseY, stroke: 'var(--dsw-alias-label-secondary)', strokeWidth: 1, opacity: 0.5 })
        : null;
      const xLabels = trends.map((t, i) => {
        if (isToday) {
          if (i % 4 !== 0 && i !== lastIdx) return null;
          const isLast = i === lastIdx;
          return h('text', { key: 'xl' + i, x: xOf(i), y: H - 8, fontSize: isLast ? 11 : 9, fontWeight: isLast ? 700 : 400, fill: isLast ? 'var(--dsw-alias-brand-primary)' : 'var(--dsw-alias-label-secondary)', textAnchor: 'middle' }, String(t.hour).padStart(2, '0') + '时');
        }
        if (i % 5 !== 0 && i !== n - 1) return null;
        const isLast = i === n - 1;
        return h('text', { key: 'xl' + i, x: xOf(i), y: H - 8, fontSize: isLast ? 11 : 9, fontWeight: isLast ? 700 : 400, fill: isLast ? 'var(--dsw-alias-brand-primary)' : 'var(--dsw-alias-label-secondary)', textAnchor: 'middle' }, String(t.date).slice(5) + (isLast ? ' (今)' : ''));
      });
      const todayDots = visibleTok.map((s) => {
        if (!trends[lastIdx] || !trends[lastIdx][s.key]) return null;
        return h('circle', { key: 'td' + s.key, cx: xOf(lastIdx), cy: yTok(trends[lastIdx][s.key]), r: 3.5, fill: s.color, stroke: 'var(--dsw-alias-bg-base)', strokeWidth: 1.5 });
      });
      const cells = trends.map((t, i) => {
        const w = n > 1 ? plotW / n : plotW;
        return h('rect', {
          key: 'c' + i,
          x: xOf(i) - w / 2, y: padT, width: w, height: plotH,
          fill: 'transparent',
          onMouseEnter: () => setHover(i),
          onMouseLeave: () => setHover(null)
        });
      });

      return h('div', { className: 'tsu-sec' },
        h('div', { className: 'tsu-sec-head' },
          h('span', { className: 'tsu-sec-title' }, '使用趋势'),
          h('div', { className: 'tsu-seg' }, [['today', '今天'], [7, '近7天'], [14, '近14天'], [30, '近30天']].map((d) =>
            h('button', { key: d[0], className: String(days) === String(d[0]) ? 'on' : '', onClick: () => { setHover(null); setDays(d[0]); } }, d[1])))),
        h('div', { className: 'tsu-card' },
          trends.length === 0 ? h('div', { className: 'tsu-empty' }, '暂无数据')
            : h('div', null,
                infoLine,
                legend,
                h('svg', { viewBox: '0 0 ' + W + ' ' + H, style: { width: '100%', height: 'auto', display: 'block' } },
                  gridLines,
                  costTicks,
                  paths,
                  costPath,
                  hoverLine,
                  todayDots,
                  xLabels,
                  cells))));
    }

    function Dashboard() {
      const [range, setRange] = React.useState(1);
      const [summary, setSummary] = React.useState(null);
      const [balance, setBalance] = React.useState(null);
      const [pricing, setPricing] = React.useState(null);
      const [exportText, setExportText] = React.useState('');

      React.useEffect(() => {
        let alive = true;
        const loadSummary = () => {
          api('summary', { rangeDays: range }).then((r) => { if (alive) setSummary(r); }).catch(() => {});
        };
        const loadAll = () => {
          api('pricing').then((r) => { if (alive) setPricing(r); }).catch(() => {});
        };
        const loadBalance = (force) => {
          api('balance', force ? { force: true } : null).then((r) => { if (alive) setBalance(r); }).catch(() => {});
        };
        loadSummary();
        loadAll();
        loadBalance(false);
        const t1 = setInterval(loadSummary, 5000);
        const t2 = setInterval(loadAll, 5000);
        const t3 = setInterval(() => loadBalance(false), 60000);
        return () => { alive = false; clearInterval(t1); clearInterval(t2); clearInterval(t3); };
      }, [range]);

      const refreshBalance = () => {
        api('balance', { force: true }).then((r) => setBalance(r)).catch(() => {});
      };
      const doExport = () => {
        api('export').then((r) => setExportText(JSON.stringify(r, null, 2))).catch(() => setExportText('导出失败'));
      };

      const s = summary || { totals: null, byModel: [], bySession: [], recent: [], backfilling: false, done: 0, total: 0 };
      const totals = s.totals || { calls: 0, input: 0, output: 0, cacheRead: 0, cacheWrite: 0, reasoning: 0, cost: {} };
      const costText = fmtCost(totals.cost);
      const backRow = s.backfilling ? h('div', { className: 'tsu-back' }, h('i', null), '正在回填历史用量 ' + fmt(s.done) + '/' + fmt(s.total)) : null;

      const metrics = [
        h(Metric, { key: 'calls', label: '调用次数', value: fmt(totals.calls) }),
        h(Metric, { key: 'total', label: 'tokens', value: fmtShort(tokensOf(totals)) }),
        h(Metric, { key: 'input', label: '输入未命中', value: fmtShort(totals.input) }),
        h(Metric, { key: 'out', label: '输出', value: fmtShort(totals.output) }),
        h(Metric, { key: 'cache', label: '缓存命中', value: fmtShort(totals.cacheRead) }),
        h(Metric, { key: 'reason', label: '推理', value: fmtShort(totals.reasoning) })
      ];

      const balanceRows = (balance && balance.routes ? balance.routes : []).map((r) => {
        const dotClass = r.error ? 'tsu-dot off' : 'tsu-dot';
        return h('div', { key: r.route, className: 'tsu-card tsu-bal' },
          h('div', { className: 'tsu-bal-info' },
            h('div', { className: 'tsu-bal-name' },
              h('span', { className: dotClass }),
              r.label,
              r.route === 'deepseek-official' ? h('button', { className: 'tsu-topup', title: '前往 DeepSeek 开放平台充值', onClick: () => { try { window.open('https://platform.deepseek.com/top_up', '_blank', 'noopener'); } catch (e) { /* ignore */ } } }, '充值') : null,
              r.stale ? h('span', { className: 'tsu-stale' }, '旧值') : null),
            r.error ? h('div', { className: 'tsu-bal-err' }, r.error)
              : h('div', { className: 'tsu-bal-nums' },
                  (r.balances || []).map((b) => h('span', { key: b.currency },
                    b.currency + ' 总额 ',
                    h('b', null, b.total != null ? b.total : '—'),
                    b.granted != null && b.granted !== '0.00' ? ' · 赠送 ' + b.granted : '',
                    b.toppedUp != null && b.toppedUp !== '0.00' ? ' · 充值 ' + b.toppedUp : '',
                    b.used != null ? ' · 已用 ' + b.used : '')))),
          h('div', { className: 'tsu-row' },
            h('span', { className: 'tsu-hint' }, r.fetchedAt ? fmtTime(r.fetchedAt) : ''),
            h('span', { className: 'tsu-sec-note' }, r.is_available === false ? '余额不足' : (r.is_available ? '可调用' : ''))));
      });

      const modelRows = s.byModel.map((m) =>
        h('tr', { key: (m.provider || '?') + '/' + (m.model || '?') },
          h('td', null, short(m.provider)),
          h('td', null, short(m.model)),
          h('td', { className: 'num' }, fmt(m.calls)),
          h('td', { className: 'num' }, fmtShort(tokensOf(m))),
          h('td', { className: 'num' }, fmtCost(m.cost))));

      const sessionRows = s.bySession.map((x) =>
        h('tr', { key: x.sessionId },
          h('td', null, x.title ? short(x.title, 26) : short(x.sessionId, 26)),
          h('td', { className: 'num' }, fmt(x.calls)),
          h('td', { className: 'num' }, fmtShort(tokensOf(x))),
          h('td', { className: 'num' }, fmtCost(x.cost)),
          h('td', { className: 'num sub' }, fmtTime(x.lastTime))));

      const recentRows = s.recent.map((r, i) =>
        h('tr', { key: 'r' + i },
          h('td', { className: 'sub' }, fmtTime(r.time)),
          h('td', null, r.title ? short(r.title, 16) : short(r.sessionId, 16)),
          h('td', null, short(r.model, 18)),
          h('td', { className: 'num' }, fmtShort(r.input)),
          h('td', { className: 'num' }, fmtShort(r.output)),
          h('td', { className: 'num' }, fmtCost(r.cost))));

      return h('div', { className: 'tsu-root' },
        backRow,
        h('div', { className: 'tsu-seg' }, RANGES.map((r) => h('button', { key: r.d, className: range === r.d ? 'on' : '', onClick: () => setRange(r.d) }, r.label))),
        h('div', { className: 'tsu-hero' },
          h('div', { className: 'tsu-hero-main' },
            h('div', { className: 'tsu-hero-cost' }, costText),
            h('div', { className: 'tsu-hero-cap' }, '统计范围内费用估算')),
          h('div', { className: 'tsu-hero-side' },
            h('div', { className: 'tsu-hero-num' }, fmt(totals.calls)),
            h('div', { className: 'tsu-hero-cap' }, '次调用'))),
        h('div', { className: 'tsu-metrics' }, metrics),
        h('div', { className: 'tsu-sec' },
          h('div', { className: 'tsu-sec-head' },
            h('span', { className: 'tsu-sec-title' }, '账户余额'),
            h('button', { className: 'tsu-btn ghost', onClick: refreshBalance }, '刷新')),
          balance === null ? h('div', { className: 'tsu-card tsu-hint' }, '余额查询中…') : (balanceRows.length ? balanceRows : h('div', { className: 'tsu-card tsu-hint' }, '未发现已配置的模型路由'))),
        h(TrendsBlock, null),
        h(HeatmapBlock, null),
        h(ModelPieBlock, { models: s.byModel }),
        h('div', { className: 'tsu-sec' },
          h('div', { className: 'tsu-sec-title' }, '按模型'),
          h('div', { className: 'tsu-card' }, h('table', { className: 'tsu-table' },
            h('thead', null, h('tr', null,
              h('th', null, 'Provider'), h('th', null, '模型'), h('th', { className: 'num' }, '调用'), h('th', { className: 'num' }, 'Tokens'), h('th', { className: 'num' }, '费用'))),
            h('tbody', null, modelRows.length ? modelRows : h('tr', null, h('td', { colSpan: 5, className: 'tsu-empty' }, '暂无数据')))))),
        h('div', { className: 'tsu-sec' },
          h('div', { className: 'tsu-sec-title' }, '按会话'),
          h('div', { className: 'tsu-card' }, h('table', { className: 'tsu-table' },
            h('thead', null, h('tr', null,
              h('th', null, '会话'), h('th', { className: 'num' }, '调用'), h('th', { className: 'num' }, 'Tokens'), h('th', { className: 'num' }, '费用'), h('th', { className: 'num' }, '最后活动'))),
            h('tbody', null, sessionRows.length ? sessionRows : h('tr', null, h('td', { colSpan: 5, className: 'tsu-empty' }, '暂无数据')))))),
        h('div', { className: 'tsu-sec' },
          h('div', { className: 'tsu-sec-title' }, '最近调用'),
          h('div', { className: 'tsu-card' }, h('table', { className: 'tsu-table' },
            h('thead', null, h('tr', null,
              h('th', null, '时间'), h('th', null, '会话'), h('th', null, '模型'), h('th', { className: 'num' }, '输入'), h('th', { className: 'num' }, '输出'), h('th', { className: 'num' }, '费用'))),
            h('tbody', null, recentRows.length ? recentRows : h('tr', null, h('td', { colSpan: 6, className: 'tsu-empty' }, '暂无数据')))))),
        h(PricingBlock, { pricing: pricing, onChanged: (r) => setPricing(r) }),
        h('div', { className: 'tsu-sec' },
          h('div', { className: 'tsu-sec-head' },
            h('span', { className: 'tsu-sec-title' }, '导出'),
            h('button', { className: 'tsu-btn ghost', onClick: doExport }, '加载导出 JSON')),
          exportText ? h('textarea', { className: 'tsu-mono', readOnly: true, rows: 10, style: { width: '100%', boxSizing: 'border-box', background: 'var(--dsw-alias-bg-base)', border: '1px solid var(--dsw-alias-border-l1)', borderRadius: 12, padding: 10 }, value: exportText }) : null)
      );
    }

    function PricingBlock(props) {
      const [provider, setProvider] = React.useState('*');
      const [model, setModel] = React.useState('');
      const [currency, setCurrency] = React.useState('CNY');
      const [miss, setMiss] = React.useState('');
      const [hit, setHit] = React.useState('');
      const [out, setOut] = React.useState('');
      const [msg, setMsg] = React.useState('');
      const [dispCur, setDispCur] = React.useState((props.pricing && props.pricing.displayCurrency) || 'CNY');
      const [rate, setRate] = React.useState(props.pricing && props.pricing.usdCnyRate ? String(props.pricing.usdCnyRate) : '7.2');
      const p = props.pricing;
      const persisted = p ? p.persisted : false;
      const entries = p && p.pricing ? p.pricing : [];

      const submit = async () => {
        if (!model.trim()) { setMsg('请填写模型名'); return; }
        const entry = {
          provider: provider.trim() || '*',
          model: model.trim(),
          currency: currency,
          inputMiss: Number(miss) || 0,
          inputHit: Number(hit) || 0,
          output: Number(out) || 0,
          effectiveFrom: 0
        };
        try {
          const res = await api('pricing', { action: 'set', entry: entry });
          props.onChanged(res);
          setMsg(res && res.persisted ? '已保存' : '已更新(本次运行内有效)');
        } catch (e) { setMsg('保存失败'); }
      };
      const remove = async (e) => {
        try {
          const res = await api('pricing', { action: 'delete', entry: { provider: e.provider, model: e.model, effectiveFrom: e.effectiveFrom || 0 } });
          props.onChanged(res);
        } catch (e) { /* ignore */ }
      };
      const reset = async () => {
        try {
          const res = await api('pricing', { action: 'reset' });
          props.onChanged(res);
          setMsg(res && res.persisted ? '已恢复默认价目表' : '已恢复默认(本次运行内有效)');
        } catch (e) { /* ignore */ }
      };
      const saveConfig = async () => {
        try {
          const res = await api('pricing', { action: 'config', config: { displayCurrency: dispCur, usdCnyRate: Number(rate) || 0 } });
          props.onChanged(res);
          if (res && res.displayCurrency) setDispCur(res.displayCurrency);
          if (res && res.usdCnyRate) setRate(String(res.usdCnyRate));
          setMsg(res && res.persisted ? '显示设置已保存' : '显示设置已更新(本次运行内有效)');
        } catch (e) { setMsg('保存失败'); }
      };
      const sym = (c) => (c === 'CNY' ? '¥' : c === 'USD' ? '$' : c);
      const effText = (e) => (e && e.effectiveFrom ? '自 ' + fmtTime(e.effectiveFrom) : '全时段');
      const rateText = (e) => {
        if (!e) return '';
        const base = '未命中 ' + sym(e.currency) + e.inputMiss + ' / 命中 ' + sym(e.currency) + e.inputHit + ' / 输出 ' + sym(e.currency) + e.output;
        return (e.offPeak ? base + '(谷段半价)' : base) + ' · ' + effText(e);
      };

      return h('div', { className: 'tsu-sec' },
        h('div', { className: 'tsu-sec-head' },
          h('span', { className: 'tsu-sec-title' }, '价目表'),
          h('div', { className: 'tsu-row' },
            h('span', { className: 'tsu-hint' }, persisted ? '已持久化' : '仅本次运行有效'),
            h('button', { className: 'tsu-btn ghost', onClick: reset }, '恢复默认'))),
        h('div', { className: 'tsu-card' },
          h('div', { className: 'tsu-row', style: { marginBottom: 10 } },
            h('span', { className: 'tsu-sec-note' }, '费用显示:'),
            h('select', { className: 'tsu-select', value: dispCur, onChange: (e) => setDispCur(e.target.value) },
              h('option', { value: 'CNY' }, 'CNY (¥,官方价)'),
              h('option', { value: 'USD' }, 'USD ($,按汇率)'),
              h('option', { value: 'auto' }, '自动')),
            h('input', { className: 'tsu-input', value: rate, onChange: (e) => setRate(e.target.value), placeholder: '汇率', title: 'USD→CNY 汇率,仅用于 USD 显示' }),
            h('button', { className: 'tsu-btn', onClick: saveConfig }, '保存')),
          h('div', { className: 'tsu-hint', style: { marginBottom: 10 } }, '内置 DeepSeek 官方人民币价:8-17 前旧价,8-17 起峰谷价(北京时间 9:00–12:00、14:00–18:00 高峰,谷段半价)。其他模型在此添加。'),
          h('table', { className: 'tsu-table' },
            h('thead', null, h('tr', null,
              h('th', null, 'Provider'), h('th', null, '模型'), h('th', null, '价格(元/百万 tokens)'), h('th', null, ''))),
            h('tbody', null, entries.map((e, i) =>
              h('tr', { key: i },
                h('td', null, e.provider || '*'),
                h('td', null, e.model),
                h('td', { className: 'sub' }, rateText(e)),
                h('td', { style: { textAlign: 'right' } }, h('button', { className: 'tsu-btn ghost', onClick: () => remove(e) }, '删除')))))),
          h('div', { className: 'tsu-hint', style: { marginTop: 14, marginBottom: 8 } }, '添加价格条目(固定价,元/百万 tokens):'),
          h('div', { className: 'tsu-form' },
            h('input', { className: 'tsu-input', placeholder: 'provider(*)', value: provider, onChange: (e) => setProvider(e.target.value) }),
            h('input', { className: 'tsu-input wide', placeholder: '模型名', value: model, onChange: (e) => setModel(e.target.value) }),
            h('select', { className: 'tsu-select', value: currency, onChange: (e) => setCurrency(e.target.value) },
              h('option', { value: 'CNY' }, 'CNY'), h('option', { value: 'USD' }, 'USD')),
            h('input', { className: 'tsu-input', placeholder: '未命中价', value: miss, onChange: (e) => setMiss(e.target.value) }),
            h('input', { className: 'tsu-input', placeholder: '命中价', value: hit, onChange: (e) => setHit(e.target.value) }),
            h('input', { className: 'tsu-input', placeholder: '输出价', value: out, onChange: (e) => setOut(e.target.value) }),
            h('button', { className: 'tsu-btn', onClick: submit }, '添加 / 更新'),
            msg ? h('span', { className: 'tsu-msg' }, msg) : null))
      );
    }

    function Readout(props) {
      const [data, setData] = React.useState(null);
      React.useEffect(() => {
        let alive = true;
        const sid = props.sessionId;
        if (!sid) return;
        const load = () => {
          api('session', { sessionId: sid }).then((r) => { if (alive) setData(r); }).catch(() => {});
        };
        load();
        const t = setInterval(load, 10000);
        return () => { alive = false; clearInterval(t); };
      }, [props.sessionId]);
      if (!props.sessionId) return null;
      if (!data || !data.totals) return h('span', { className: 'tsu-readout' }, 'Token 用量:…');
      const total = tokensOf(data.totals);
      return h('span', { className: 'tsu-readout' },
        '本会话 ' + fmt(total) + ' tokens' +
        (data.totals.cost && Object.keys(data.totals.cost).length ? ' · 本会话费用 ' + fmtCost(data.totals.cost) : '') +
        (data.today && data.today.cost && Object.keys(data.today.cost).length ? ' · 今日费用 ' + fmtCost(data.today.cost) : ''));
    }

    function apply(ctx) {
      const slots = ctx.get('slots');
      if (slots === undefined) return;
      slots.inject('settings.section', () => slots.register(
        { name: 'settings.section', id: 'token-stats', order: 35, label: () => 'Token 用量' },
        () => h(Dashboard)
      ));
      slots.inject('conversation.composer.dock', () => slots.register(
        { name: 'conversation.composer.dock', id: 'token-stats', order: 10 },
        (props) => h(Readout, { sessionId: props.sessionId })
      ));
    }

    exports.apply = apply;
    return exports;
  }
});
