import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");
const sourcePath = path.join(rootDir, "public", "screen-results.json");
const outputPath = path.join(rootDir, "index.html");
const data = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const embedded = JSON.stringify(data).replaceAll("</script", "<\\/script");

const html = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="DART 8분기 영업이익·영업이익률 성장 기업 스크리너" />
  <title>DART 8분기 성장 기업 스크리너</title>
  <style>
    :root{--bg:#07110e;--panel:#0d1b16;--panel2:#12231c;--line:#234236;--text:#eef7f2;--muted:#94aa9f;--mint:#53e0a1;--lime:#c7f06b;--red:#ff8b80;--shadow:0 18px 50px rgba(0,0,0,.28)}
    *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(circle at 85% 0,#153b2b 0,transparent 30rem),var(--bg);color:var(--text);font-family:Pretendard,"Noto Sans KR",system-ui,-apple-system,sans-serif;line-height:1.5}
    button,input,select{font:inherit}.wrap{width:min(1440px,calc(100% - 36px));margin:auto}.topbar{display:flex;align-items:center;justify-content:space-between;padding:22px 0}.brand{display:flex;gap:11px;align-items:center;font-weight:800}.brand-mark{display:grid;place-items:center;width:34px;height:34px;border-radius:10px;background:var(--mint);color:#092016}.snapshot{font-size:12px;color:var(--muted);border:1px solid var(--line);border-radius:999px;padding:6px 10px}
    .hero{display:flex;justify-content:space-between;align-items:end;gap:24px;padding:52px 0 30px}.eyebrow{color:var(--mint);font-size:13px;font-weight:800;letter-spacing:.12em}.hero h1{font-size:clamp(34px,5vw,64px);line-height:1.06;letter-spacing:-.055em;margin:12px 0 18px;max-width:870px}.hero p{color:var(--muted);font-size:16px;max-width:720px;margin:0}.button{border:0;border-radius:12px;padding:13px 17px;background:var(--mint);color:#062116;font-weight:800;cursor:pointer;white-space:nowrap}.button:hover{filter:brightness(1.08)}
    .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:22px 0}.stat{background:linear-gradient(145deg,var(--panel2),var(--panel));border:1px solid var(--line);padding:19px;border-radius:16px}.stat .label{font-size:12px;color:var(--muted)}.stat strong{display:block;font-size:27px;margin-top:5px;letter-spacing:-.03em}.stat strong.green{color:var(--mint)}
    .criteria{display:flex;gap:12px;flex-wrap:wrap;margin:0 0 26px}.criterion{display:flex;align-items:center;gap:8px;color:#bdd0c6;font-size:13px}.check{display:grid;place-items:center;width:21px;height:21px;border-radius:50%;background:#183a2c;color:var(--mint);font-weight:900}
    .toolbar{display:grid;grid-template-columns:minmax(240px,1fr) 220px auto;gap:10px;margin-bottom:14px}.control{width:100%;height:46px;border:1px solid var(--line);border-radius:12px;background:#0c1914;color:var(--text);padding:0 14px;outline:none}.control:focus{border-color:var(--mint)}.result-count{display:flex;align-items:center;justify-content:end;color:var(--muted);font-size:13px}
    .workspace{display:grid;grid-template-columns:minmax(630px,1.25fr) minmax(390px,.75fr);gap:14px;align-items:start;margin-bottom:58px}.card{background:rgba(13,27,22,.93);border:1px solid var(--line);border-radius:17px;box-shadow:var(--shadow);overflow:hidden}.card-head{padding:17px 19px;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;align-items:center}.card-head h2{font-size:15px;margin:0}.hint{font-size:12px;color:var(--muted)}
    .table-wrap{max-height:730px;overflow:auto}table{border-collapse:collapse;width:100%}th{position:sticky;top:0;z-index:2;background:#102019;color:#8fa69b;font-size:11px;text-align:right;padding:12px 13px;border-bottom:1px solid var(--line);white-space:nowrap}th:first-child,td:first-child{text-align:left}td{font-size:13px;text-align:right;padding:13px;border-bottom:1px solid rgba(35,66,54,.64);white-space:nowrap}.company-row{cursor:pointer;transition:.15s}.company-row:hover,.company-row.active{background:#142b21}.company{font-weight:750}.ticker{display:block;color:var(--muted);font-size:11px;margin-top:1px}.gain{color:var(--mint);font-weight:800}.pill{display:inline-block;border-radius:999px;padding:3px 7px;background:#17352a;color:#8df0be;font-size:11px}
    .detail{position:sticky;top:12px}.detail-body{padding:18px}.detail-title{display:flex;justify-content:space-between;gap:12px;align-items:start}.detail-title h2{margin:0;font-size:23px}.detail-code{color:var(--muted);font-size:12px}.delta{background:#17392c;color:var(--mint);font-weight:900;border-radius:11px;padding:9px 11px;white-space:nowrap}.compare{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:center;margin:18px 0}.metric{padding:13px;background:#0a1712;border:1px solid var(--line);border-radius:13px}.metric span{display:block;font-size:11px;color:var(--muted)}.metric strong{font-size:21px}.arrow{color:var(--mint);font-size:19px}.quarter-table th,.quarter-table td{padding:11px 8px}.quarter-table th{position:static}.quarter-table tr.recent{background:rgba(83,224,161,.045)}.divider td{border-top:2px solid #3f765f}.group-label{margin:18px 0 7px;color:var(--muted);font-size:11px}.empty{padding:70px 20px;text-align:center;color:var(--muted)}.footnote{color:#738c80;font-size:11px;padding:0 2px 30px}
    @media(max-width:1000px){.workspace{grid-template-columns:1fr}.detail{position:static}.stats{grid-template-columns:repeat(2,1fr)}}
    @media(max-width:700px){.wrap{width:min(100% - 22px,1440px)}.hero{align-items:start;flex-direction:column;padding-top:30px}.hero h1{font-size:38px}.stats{grid-template-columns:1fr 1fr}.toolbar{grid-template-columns:1fr}.result-count{justify-content:start}.workspace{display:block}.results{margin-bottom:14px}.table-wrap{max-height:580px}.results th:nth-child(2),.results td:nth-child(2){display:none}.topbar{padding:15px 0}.snapshot{display:none}.stat strong{font-size:21px}}
  </style>
</head>
<body>
  <header class="wrap topbar"><div class="brand"><span class="brand-mark">↗</span>DART Growth Finder</div><span class="snapshot">정적 데이터 스냅샷 · <span id="dateTop"></span></span></header>
  <main class="wrap">
    <section class="hero">
      <div><div class="eyebrow">8-QUARTER PROFIT SCREEN</div><h1>큰 기업만 말고,<br />숨어 있는 우상향 기업까지.</h1><p>전체 상장기업을 대상으로 8개 분기 모두 영업흑자이며, 최근 1년의 가중 영업이익률이 직전 1년보다 개선된 기업을 한눈에 비교합니다.</p></div>
      <button class="button" id="downloadCsv">현재 목록 CSV</button>
    </section>
    <section class="stats">
      <div class="stat"><span class="label">전체 분석 대상</span><strong id="universe">-</strong></div>
      <div class="stat"><span class="label">조건 충족 기업</span><strong class="green" id="qualified">-</strong></div>
      <div class="stat"><span class="label">8분기 연속 흑자</span><strong>필수</strong></div>
      <div class="stat"><span class="label">최근 1년 수익률</span><strong>개선</strong></div>
    </section>
    <div class="criteria"><span class="criterion"><i class="check">✓</i>8개 분기 영업이익이 모두 0 초과</span><span class="criterion"><i class="check">✓</i>최근 4분기 가중 영업이익률 &gt; 직전 4분기</span><span class="criterion"><i class="check">✓</i>대형주로 제한하지 않음</span></div>
    <section class="toolbar">
      <input class="control" id="search" type="search" placeholder="기업명 또는 종목코드 검색" autocomplete="off" />
      <select class="control" id="sort"><option value="gain">이익률 개선폭 순</option><option value="recent">최근 이익률 순</option><option value="revenue">최근 1년 매출 순</option><option value="name">기업명 순</option></select>
      <div class="result-count" id="resultCount"></div>
    </section>
    <section class="workspace">
      <article class="card results"><div class="card-head"><h2>스크리닝 기업</h2><span class="hint">행을 누르면 8분기 값 표시</span></div><div class="table-wrap"><table><thead><tr><th>기업</th><th>흑자</th><th>직전 4Q</th><th>최근 4Q</th><th>개선폭</th></tr></thead><tbody id="rows"></tbody></table><div class="empty" id="empty" hidden>검색 결과가 없습니다.</div></div></article>
      <article class="card detail" id="detail"></article>
    </section>
    <p class="footnote">단위: 억원 · 수익률은 4개 분기 매출 합계 대비 영업이익 합계로 계산한 가중 영업이익률입니다. 투자 판단의 참고용이며 데이터 누락·정정공시 여부를 별도로 확인하세요.</p>
  </main>
  <script id="screenData" type="application/json">${embedded}</script>
  <script>
    const data=JSON.parse(document.getElementById('screenData').textContent);
    const state={query:'',sort:'gain',selected:data.companies[0]?.stockCode||'',filtered:[]};
    const el={rows:document.getElementById('rows'),detail:document.getElementById('detail'),search:document.getElementById('search'),sort:document.getElementById('sort'),count:document.getElementById('resultCount'),empty:document.getElementById('empty')};
    const esc=(v)=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]));
    const pct=(v)=>Number(v).toLocaleString('ko-KR',{minimumFractionDigits:1,maximumFractionDigits:1})+'%';
    const num=(v)=>Number(v).toLocaleString('ko-KR',{maximumFractionDigits:0});
    const recentRevenue=(c)=>c.quarters.slice(4).reduce((s,q)=>s+q.revenue,0);
    document.getElementById('dateTop').textContent=data.generatedAt;
    document.getElementById('universe').textContent=num(data.universeCount)+'개';
    document.getElementById('qualified').textContent=num(data.companies.length)+'개';
    function apply(){
      const q=state.query.trim().toLowerCase();
      state.filtered=data.companies.filter(c=>!q||c.name.toLowerCase().includes(q)||c.stockCode.includes(q));
      state.filtered.sort((a,b)=>state.sort==='recent'?b.recentMargin-a.recentMargin:state.sort==='revenue'?recentRevenue(b)-recentRevenue(a):state.sort==='name'?a.name.localeCompare(b.name,'ko'):(b.recentMargin-b.priorMargin)-(a.recentMargin-a.priorMargin));
      if(!state.filtered.some(c=>c.stockCode===state.selected))state.selected=state.filtered[0]?.stockCode||'';
      renderRows();renderDetail();
    }
    function renderRows(){
      el.count.textContent='조건 충족 '+num(state.filtered.length)+'개 기업';el.empty.hidden=state.filtered.length>0;
      el.rows.innerHTML=state.filtered.map(c=>{const gain=c.recentMargin-c.priorMargin;return '<tr class="company-row '+(c.stockCode===state.selected?'active':'')+'" data-code="'+esc(c.stockCode)+'"><td><span class="company">'+esc(c.name)+'</span><span class="ticker">'+esc(c.stockCode)+'</span></td><td><span class="pill">'+c.profitableQuarters+'/8</span></td><td>'+pct(c.priorMargin)+'</td><td>'+pct(c.recentMargin)+'</td><td class="gain">+'+pct(gain)+'</td></tr>'}).join('');
      el.rows.querySelectorAll('tr').forEach(row=>row.addEventListener('click',()=>{state.selected=row.dataset.code;renderRows();renderDetail();if(innerWidth<1000)el.detail.scrollIntoView({behavior:'smooth',block:'start'})}));
    }
    function renderDetail(){
      const c=state.filtered.find(x=>x.stockCode===state.selected);if(!c){el.detail.innerHTML='<div class="empty">표시할 기업이 없습니다.</div>';return}
      const gain=c.recentMargin-c.priorMargin;
      const quarterRows=c.quarters.map((q,i)=>'<tr class="'+(i>=4?'recent ':'')+(i===4?'divider':'')+'"><td>'+esc(q.period)+'</td><td>'+num(q.revenue)+'</td><td>'+num(q.operatingProfit)+'</td><td class="'+(q.margin>0?'gain':'')+'">'+pct(q.margin)+'</td></tr>').join('');
      el.detail.innerHTML='<div class="card-head"><h2>8분기 상세</h2><span class="hint">최근 분기까지</span></div><div class="detail-body"><div class="detail-title"><div><h2>'+esc(c.name)+'</h2><span class="detail-code">'+esc(c.stockCode)+' · DART '+esc(c.corpCode)+'</span></div><span class="delta">+'+pct(gain)+'</span></div><div class="compare"><div class="metric"><span>직전 4분기 가중 이익률</span><strong>'+pct(c.priorMargin)+'</strong></div><span class="arrow">→</span><div class="metric"><span>최근 4분기 가중 이익률</span><strong class="gain">'+pct(c.recentMargin)+'</strong></div></div><div class="group-label">분기별 실적 · 단위 억원</div><div class="table-wrap"><table class="quarter-table"><thead><tr><th>분기</th><th>매출</th><th>영업이익</th><th>이익률</th></tr></thead><tbody>'+quarterRows+'</tbody></table></div></div>';
    }
    function csv(){
      const head=['기업명','종목코드','8분기 흑자','직전4분기 이익률','최근4분기 이익률','개선폭'];
      const rows=state.filtered.map(c=>[c.name,c.stockCode,c.profitableQuarters,c.priorMargin,c.recentMargin,c.recentMargin-c.priorMargin]);
      const quote=v=>'"'+String(v).replaceAll('"','""')+'"';const body=[head,...rows].map(r=>r.map(quote).join(',')).join('\r\n');
      const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+body],{type:'text/csv;charset=utf-8'}));a.download='dart-growth-screen-'+data.generatedAt+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500);
    }
    el.search.addEventListener('input',e=>{state.query=e.target.value;apply()});el.sort.addEventListener('change',e=>{state.sort=e.target.value;apply()});document.getElementById('downloadCsv').addEventListener('click',csv);apply();
  </script>
</body>
</html>`;

fs.writeFileSync(outputPath, html, "utf8");
console.log(`Created ${outputPath} (${data.companies.length} companies, ${data.universeCount} screened)`);
