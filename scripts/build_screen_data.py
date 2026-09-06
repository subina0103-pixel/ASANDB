import json, os, time, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
KEY=os.environ['DART_API_KEY']
PERIODS=[('2024','11013','24 Q1'),('2024','11012','24 Q2'),('2024','11014','24 Q3'),('2024','11011','24 Q4'),('2025','11013','25 Q1'),('2025','11012','25 Q2'),('2025','11014','25 Q3'),('2025','11011','25 Q4'),('2026','11013','26 Q1'),('2026','11012','26 Q2')]
universe=json.loads((ROOT/'public/corp-universe.json').read_text(encoding='utf-8-sig'))
batches=[universe[i:i+50] for i in range(0,len(universe),50)]

def number(v):
    s=str(v or '0').replace(',','').strip(); neg=s.startswith('(')
    try: n=float(s.strip('()'))/100_000_000
    except: return 0
    return -n if neg else n

def fetch(args):
    bi,year,report,label=args; batch=batches[bi]
    query=urllib.parse.urlencode({'crtfc_key':KEY,'corp_code':','.join(x['corpCode'] for x in batch),'bsns_year':year,'reprt_code':report})
    req=urllib.request.Request('https://opendart.fss.or.kr/api/fnlttMultiAcnt.json?'+query,headers={'User-Agent':'Mozilla/5.0'})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req,timeout=60) as r: data=json.load(r)
            break
        except Exception:
            if attempt==4: raise
            time.sleep(5*(attempt+1))
    if data.get('status') not in ('000','013'): raise RuntimeError(data.get('message',data.get('status')))
    return bi,year,report,label,data.get('list',[])

grouped={i:[] for i in range(len(batches))}
jobs=[(i,*p) for i in range(len(batches)) for p in PERIODS]
with ThreadPoolExecutor(max_workers=3) as pool:
    futures=[pool.submit(fetch,j) for j in jobs]
    for n,f in enumerate(as_completed(futures),1):
        bi,year,report,label,rows=f.result()
        for x in rows: x.update(year=year,report=report,period=label)
        grouped[bi].extend(rows)
        if n%20==0: print(f'{n}/{len(jobs)} requests')

results=[]
for bi,batch in enumerate(batches):
    by={}
    for x in grouped[bi]: by.setdefault(x['corp_code'],[]).append(x)
    for meta in batch:
        rows=by.get(meta['corpCode'],[]); raw=[]
        for year,report,label in PERIODS:
            rs=[x for x in rows if x['year']==year and x['report']==report and x.get('fs_div')=='CFS']
            rev=next((x for x in rs if x.get('account_nm') in ('매출액','영업수익')),None)
            op=next((x for x in rs if x.get('account_nm','').startswith('영업이익')),None)
            if not rev or not op: break
            raw.append({'period':label,'year':year,'report':report,'revenue':number(rev.get('thstrm_amount')),'operatingProfit':number(op.get('thstrm_amount'))})
        if len(raw)!=10: continue
        for i in range(len(raw)-1,-1,-1):
            x=raw[i]
            if x['report']=='11011':
                first_three=[y for y in raw if y['year']==x['year'] and y['report'] in ('11013','11012','11014')]
                x['revenue']-=sum(y['revenue'] for y in first_three); x['operatingProfit']-=sum(y['operatingProfit'] for y in first_three)
            x['margin']=x['operatingProfit']/x['revenue']*100 if x['revenue'] else 0
        q=raw[2:]
        if not sum(x['revenue'] for x in q[:4]) or not sum(x['revenue'] for x in q[4:]): continue
        margin=lambda a:sum(x['operatingProfit'] for x in a)/sum(x['revenue'] for x in a)*100
        prior,recent=margin(q[:4]),margin(q[4:]); profitable=sum(x['operatingProfit']>0 for x in q)
        if profitable==8 and recent>prior:
            results.append({**meta,'quarters':[{k:x[k] for k in ('period','revenue','operatingProfit','margin')} for x in q],'priorMargin':prior,'recentMargin':recent,'profitableQuarters':profitable,'qualifies':True})
results.sort(key=lambda x:x['recentMargin']-x['priorMargin'],reverse=True)
(ROOT/'public/screen-results.json').write_text(json.dumps({'generatedAt':'2026-09-06','universeCount':len(universe),'companies':results},ensure_ascii=False,separators=(',',':')),encoding='utf-8')
print(f'completed: {len(results)} qualifying companies')
