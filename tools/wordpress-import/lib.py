import pickle,re,base64,json,collections,phpserialize,html
from bs4 import BeautifulSoup
import os
# db.pkl is written by parse.py from the WordPress SQL dump; WORK points at the folder holding it, x/ (the
# extracted backup) and props.json (a saved copy of the map's Apps Script response).
WORK = os.environ.get('WORK', '.')
d=pickle.load(open(os.path.join(WORK, 'db.pkl'),'rb'))
def T(t): c=d[t]['cols']; return [dict(zip(c,r)) for r in d[t]['rows']]
P=T('wp_posts'); byid={int(p['ID']):p for p in P}
M=collections.defaultdict(dict)
for m in T('wp_postmeta'): M[int(m['post_id'])][m['meta_key']]=m['meta_value']
uid2file={m['brizy_attachment_uid']:m['_wp_attached_file'] for m in M.values() if 'brizy_attachment_uid' in m and '_wp_attached_file' in m}
def img(v):
  if not v: return None
  return uid2file.get(v.split('.')[0]) or uid2file.get(v) or ('?'+v)
def ed(pid):
  raw=M[pid]['brizy'].encode('utf-8','surrogateescape')
  v=phpserialize.loads(raw,decode_strings=True)['brizy-post']
  return json.loads(base64.b64decode(v['editor_data']))
def txt(h): return ' '.join(BeautifulSoup(h,'lxml').get_text(' ').split())
def dump(o,depth=0,out=None):
  out=[] if out is None else out
  if isinstance(o,dict):
    t=o.get('type'); v=o.get('value',{}) if isinstance(o.get('value'),dict) else {}
    pad='  '*min(depth,12)
    if t:
      line=None
      if t=='RichText': 
        h=v.get('text','');tag=re.match(r'<(\w+)',h); line=f"TEXT<{tag.group(1) if tag else ''}> {txt(h)}"
      elif t=='Image': line=f"IMAGE {img(v.get('imageSrc'))} link={v.get('linkExternal') or v.get('linkPopup') or ''}"
      elif t=='Button': line=f"BUTTON '{v.get('text')}' -> {v.get('linkExternal') or v.get('linkPopup') or v.get('linkAnchor') or ''}"
      elif t=='Counter': line=f"COUNTER {v.get('prefixLabel','')}{v.get('end')}{v.get('suffixLabel','')}"
      elif t=='IconText': line="ICONTEXT"
      elif t in('Section','SectionItem','Column','Row','SectionPopup2','Accordion','AccordionItem','Tabs','Tab','Carousel','WPPosts','Posts','Menu','EmbedCode','Map','WPShortcode','Wrapper'):
        bits=[]
        if v.get('bgImageSrc'): bits.append('bg='+str(img(v['bgImageSrc'])))
        for k in ('labelText','anchorName','address','code','shortcode','popupId','cssClass','category','type','source','querySource','id'):
          if v.get(k) and t not in('Column','Row','Wrapper'): bits.append(f"{k}={str(v[k])[:120]}")
        if t not in('Column','Row','Wrapper') or bits: line=f"[{t}] "+' '.join(bits)
      if line: out.append(pad+line)
    for k,x in o.items():
      if k in('items','value','popups','_blocks') or isinstance(x,(dict,list)): dump(x,depth+(1 if t else 0),out)
  elif isinstance(o,list):
    for x in o: dump(x,depth,out)
  return out

# ---- rich text with structure: Brizy RichText values hold HTML; keep paragraphs, links and emphasis ----
def richtexts(pid):
    out = {}
    def walk(o):
        if isinstance(o, dict):
            if o.get('type') == 'RichText' and isinstance(o.get('value'), dict):
                h = o['value'].get('text', '')
                out.setdefault(txt(h), h)
            for x in o.values(): walk(x)
        elif isinstance(o, list):
            for x in o: walk(x)
    walk(ed(pid))
    return out

def brizy_href(a):
    """(url, opens_in_new_tab) for a link in Brizy rich text: a plain href, or Brizy's URL-encoded JSON in data-href."""
    import urllib.parse
    if a.get('href') and not a['href'].startswith(('#', 'javascript')): return a['href'], a.get('target') == '_blank'
    d = a.get('data-href')
    if not d: return None
    try: j = json.loads(urllib.parse.unquote(d))
    except Exception: return None
    t = j.get('type')
    if t == 'external' and j.get('external'): return j['external'], j.get('externalBlank') == 'on'
    if t == 'upload' and j.get('upload'):
        f = j['upload'].split('|||')[0]
        return '/wp-content/uploads/' + f.lstrip('/'), True
    if t == 'anchor' and j.get('anchor'): return '#' + j['anchor'].lstrip('#'), False
    if t in ('internal', 'page') and j.get('internal'):
        pid = int(str(j['internal']).split(':')[0]) if str(j['internal']).split(':')[0].isdigit() else None
        if pid and pid in byid: return '/' + byid[pid]['post_name'] + '/', j.get('internalBlank') == 'on'
    return None

def paragraphs(h, link=lambda u: u):
    """HTML from a Brizy RichText -> list of paragraph HTML strings, keeping only <a href>, <strong>, <em>, <br>."""
    soup = BeautifulSoup(h, 'lxml')
    def inner(el):
        parts = []
        for c in el.children:
            if isinstance(c, str):
                parts.append(html.escape(str(c), quote=False))
            elif c.name == 'br':
                parts.append('<br>')
            elif c.name == 'a' and brizy_href(c):
                href, blank = brizy_href(c)
                attrs = ' target="_blank" rel="noopener"' if blank else ''
                parts.append(f'<a href="{html.escape(link(href))}"{attrs}>{inner(c)}</a>')
            elif c.name in ('strong', 'b'):
                t = inner(c); parts.append(f'<strong>{t}</strong>' if t.strip() else t)
            elif c.name in ('em', 'i'):
                t = inner(c); parts.append(f'<em>{t}</em>' if t.strip() else t)
            else:
                parts.append(inner(c))
        return ''.join(parts)
    # Brizy writes one <p> per line and an empty <p><br></p> as the gap between paragraphs. Lines between gaps form one
    # paragraph: a line ending a sentence is followed by a line break (as it showed), a line cut mid-sentence by a space.
    blocks = [b for b in (soup.find_all(['p', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']) or [soup.body or soup]) if not b.find(['p', 'li'])]
    res, group = [], []
    def flush():
        if group:
            out = group[0]
            for prev, line in zip(group, group[1:]):
                plain = re.sub('<[^>]+>', '', prev).rstrip()
                out += ('<br>' if plain.endswith(('.', '!', '?', ')', ':')) else ' ') + line
            res.append(out); group.clear()
    for b in blocks:
        s2 = re.sub(r'\s+', ' ', inner(b)).replace('﻿', '').replace('​', '').strip()
        s2 = re.sub(r'^(<br>)+|(<br>)+$', '', s2).strip()
        if re.sub('<[^>]+>', '', s2).strip(): group.append(s2)
        else: flush()
    flush()
    return res
