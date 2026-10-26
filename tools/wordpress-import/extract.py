import sys, os, shutil, json, re, html, collections
sys.path.insert(0, os.path.dirname(__file__))
from lib import *

PROJ = sys.argv[1]
UP = os.path.join(WORK, 'x/wordpress/wp-content/uploads')
DATA = os.path.join(PROJ, 'src/data'); os.makedirs(DATA, exist_ok=True)
ASSETS = os.path.join(PROJ, 'src/assets/uploads')
PUBUP = os.path.join(PROJ, 'public/wp-content/uploads')

used_images, used_files = set(), set()

def H(s): return html.unescape(s or '').replace('\ufeff', '').strip()
def rel_upload(url):
    """iamcapital.com upload URL -> path relative to uploads, else None"""
    m = re.search(r'iamcapital\.com/wp-content/uploads/(.+)$', url or '')
    return m.group(1) if m else None
def link(url):
    """Normalise a link: own uploads become /wp-content/uploads/... (kept at the same path), own pages become paths."""
    r = rel_upload(url)
    if r:
        used_files.add(r); return '/wp-content/uploads/' + r
    m = re.match(r'https?://(www\.)?iamcapital\.com(/.*)?$', url or '')
    if m: return m.group(2) or '/'
    return url
def image(rel):
    if not rel or rel.startswith('?'): return None
    used_images.add(rel); return rel

def dump_lines(pid): return dump(ed(pid))
def parse(line):
    s = line.strip(); m = re.match(r'TEXT<(\w*)> (.*)', s)
    if m: return ('text', m.group(1), m.group(2))
    m = re.match(r'IMAGE (\S+)', s)
    if m: return ('image', None, m.group(1))
    m = re.match(r"BUTTON '(.*)' -> (.*)", s)
    if m: return ('button', m.group(1), m.group(2))
    m = re.match(r'\[(\w+)\] ?(.*)', s)
    if m: return ('block', m.group(1), m.group(2))
    return ('other', None, s)

# ---------- categories ----------
tt = {t['term_taxonomy_id']: t for t in T('wp_term_taxonomy')}
terms = {t['term_id']: t for t in T('wp_terms')}
cats = collections.defaultdict(list); sliders = collections.defaultdict(list)
for r in T('wp_term_relationships'):
    t = tt.get(r['term_taxonomy_id'])
    if not t: continue
    if t['taxonomy'] == 'category': cats[int(r['object_id'])].append(H(terms[t['term_id']]['name']))
    if t['taxonomy'] == 'ml-slider': sliders[terms[t['term_id']]['name']].append(int(r['object_id']))
posts = [p for p in P if p['post_type'] == 'post' and p['post_status'] == 'publish']

# ---------- documents (IR, press, events) ----------
def doc(p):
    lt = M[int(p['ID'])].get('_links_to', '')
    url = link(lt) if lt else '/' + p['post_name'] + '/'
    return {'title': H(p['post_title']), 'date': p['post_date'][:10], 'url': url,
            'kind': 'pdf' if url.lower().endswith('.pdf') else ('page' if not lt else 'external')}
documents = {k: [] for k in ('shareholderNotices', 'annualReports', 'press', 'events')}
catmap = {'Shareholder Notices': 'shareholderNotices', 'Annual Reports': 'annualReports', 'Press': 'press',
          'Events': 'events', 'Uncategorized': 'annualReports'}  # the 2008 Annual Report sits in Uncategorized
for p in posts:
    for c in cats[int(p['ID'])]:
        if c in catmap: documents[catmap[c]].append(doc(p))
for k in documents: documents[k].sort(key=lambda d: d['date'], reverse=True)
# NOTE: since October 2026 the site keeps these lists in four files in the Pages CMS shape ({title, date, pdf | link})
# and iAM edits them; don't re-run this over src/data, or it will undo their changes.
json.dump(documents, open(f'{DATA}/documents.json', 'w'), indent=2, ensure_ascii=False)

# ---------- events with their own pages ----------
events = []
for p in posts:
    if 'Events' in cats[int(p['ID'])] and not M[int(p['ID'])].get('_links_to'):
        c = p['post_content']
        c = re.sub(r'<h2><a href="/events/">Events</a></h2>', '', c)
        imgs = [image(rel_upload(u)) for u in re.findall(r'<img[^>]+src="([^"]+)"', c)]
        videos = re.findall(r'youtube\.com/watch\?v=([\w-]{11})', c)
        soup = BeautifulSoup(c, 'lxml')
        head = soup.find('strong'); headline = H(head.get_text(' ', strip=True)) if head else ''
        captions = [t.strip() for t in soup.get_text('\n').split('\n') if t.strip() and t.strip() != headline and 'youtube.com' not in t]
        events.append({'slug': p['post_name'], 'title': H(p['post_title']), 'date': p['post_date'][:10],
                       'headline': headline, 'images': [i for i in imgs if i], 'captions': captions, 'videos': videos})
json.dump(events, open(f'{DATA}/events.json', 'w'), indent=2, ensure_ascii=False)

# ---------- timeline ----------
timeline = []
for p in P:
    if p['post_type'] == 'wp-timeline' and p['post_status'] == 'publish':
        m = M[int(p['ID'])]
        timeline.append({'year': m.get('wpex_date'), 'title': H(p['post_title']),
                         'points': [H(re.sub('<[^>]+>', '', x)) for x in re.split(r'(?:<br\s*/?>\s*)+', p['post_excerpt']) if x.strip()]})
timeline.sort(key=lambda t: t['year'])
json.dump(timeline, open(f'{DATA}/timeline.json', 'w'), indent=2, ensure_ascii=False)

# ---------- funds (About page) ----------
page = {p['post_name']: p for p in P if p['post_type'] == 'page' and p['post_status'] == 'publish'}
lines = [parse(l) for l in dump_lines(int(page['about']['ID']))]
RT_ABOUT = richtexts(int(page['about']['ID']))
def paras(pid_rt, b): return paragraphs(pid_rt[b], link) if b in pid_rt else [html.escape(b)]
funds, portfolio, category = [], None, None
cur = None; mode = None; pending = None; intros = {}
for kind, a, b in lines:
    if kind == 'text' and a == 'h2' and b in ('Active Portfolio', 'Exited Portfolio'):
        portfolio = 'active' if b.startswith('Active') else 'exited'; continue
    if kind == 'text' and a == 'h2': portfolio = None; continue
    if not portfolio: continue
    if kind == 'text' and a == 'h3':
        category = b; mode = 'intro'; continue
    if kind == 'text' and a == 'p' and mode == 'intro':
        intros[f'{portfolio}:{category}'] = b; mode = None; continue
    if kind == 'block' and a == 'Column' and 'bg=' in b:
        cur = {'portfolio': portfolio, 'category': category, 'image': image(b.split('bg=')[1].split()[0]),
               'name': None, 'launched': None, 'summary': None, 'facts': []}
        funds.append(cur); mode = 'fund'; continue
    if not cur or mode != 'fund': continue
    if kind == 'text' and a == 'h4': cur['name'] = re.sub(r'\(\s*“\s*(\w+)\s*”\s*\)', r'(“\1”)', b); continue
    if kind == 'text' and a == 'p':
        if b.startswith('Launched') and not cur['launched']: cur['launched'] = b.replace('Launched', '').strip(); continue
        if not cur['summary']: cur['summary'] = paras(RT_ABOUT, b); continue
        if pending is None and b.isupper(): pending = b; continue
        if pending: cur['facts'].append({'label': pending.title(), 'value': b.replace(' ,', ',')}); pending = None
json.dump({'intros': intros, 'funds': funds}, open(f'{DATA}/funds.json', 'w'), indent=2, ensure_ascii=False)

# ---------- team ----------
lines = [parse(l) for l in dump_lines(int(page['team']['ID']))]
groups = {'directors': 'Board of Directors', 'investments': 'Investments & Fundraising', 'operations': 'Operations'}
team, group, person, in_popup, last_img = [], None, None, False, None
RT_TEAM = richtexts(int(page['team']['ID']))
for raw in dump_lines(int(page['team']['ID'])):
    kind, a, b = parse(raw)
    if kind == 'block' and a == 'Section':
        m = re.search(r'anchorName=(\w+)', b); group = groups.get(m.group(1)) if m else None; continue
    if not group: continue
    if kind == 'image': last_img = b; continue
    if kind == 'text' and a == 'h6':
        person = {'group': group, 'name': b, 'role': None, 'title': None, 'photo': image(last_img), 'bio': []}
        team.append(person); in_popup = False; continue
    if not person: continue
    if kind == 'block' and a == 'SectionPopup2': in_popup = True; continue
    if kind == 'text' and a == 'p' and not in_popup and person['role'] is None: person['role'] = b; continue
    if in_popup and kind == 'text' and a == 'h3': continue
    if in_popup and kind == 'text' and a == 'p':
        if person['title'] is None: person['title'] = b
        else: person['bio'].extend(paras(RT_TEAM, b))
for t in team:  # carousels repeat slides; keep each real paragraph once
    bio = []
    for b in t['bio']:
        if len(re.sub('<[^>]+>', '', b)) > 60 and b not in bio: bio.append(b)
    t['bio'] = bio
seen, uniq = set(), []
for t in team:  # the old page lists one person twice in the same section
    key = (t['group'], t['name'])
    if key in seen: continue
    seen.add(key); uniq.append(t)
json.dump(uniq, open(f'{DATA}/team.json', 'w'), indent=2, ensure_ascii=False)

# ---------- legal disclosures ----------
soup = BeautifulSoup(page['responsibility']['post_content'], 'lxml')
legal = []
for a in soup.find_all('a'):
    if a.get_text(strip=True) == 'VIEW':
        # the document's name is the nearest preceding rich-text
        name = a.find_previous(class_='brz-rich-text').get_text(' ', strip=True)
        legal.append({'title': H(name), 'url': link(a['href'])})
json.dump(legal, open(f'{DATA}/legal.json', 'w'), indent=2, ensure_ascii=False)

# ---------- properties ----------
props_live = {}
try:
    for x in json.load(open(os.path.join(WORK, 'props.json')))['properties']:
        props_live.setdefault(x['portfolioUrl'].rstrip('/').split('/')[-1], []).append(x)
except Exception: pass
old_slugs = {}
for pid, m in M.items():
    if '_wp_old_slug' in m and pid in byid: old_slugs[m['_wp_old_slug']] = byid[pid]['post_name']
for old, new in list(old_slugs.items()):
    if old in props_live: props_live.setdefault(new, []).extend(props_live[old])

PROPCATS = ('Hospitality', 'Residential', 'Commercial', 'Renewable Energy')
properties = []
for p in posts:
    pc = [c for c in cats[int(p['ID'])] if c in PROPCATS]
    if not pc or 'brizy' not in M[int(p['ID'])]: continue
    lines = [parse(l) for l in dump_lines(int(p['ID']))]
    RT = richtexts(int(p['ID']))
    name, desc, facts, pending, slider = H(p['post_title']), [], [], None, None
    for kind, a, b in lines:
        if kind == 'text' and a == 'h1': name = b; continue
        if kind == 'block' and a == 'EmbedCode':
            m = re.search(r'metaslider id="(\d+)"', b); slider = m.group(1) if m else slider; continue
        if kind == 'text' and a == 'p':
            if pending is None and b.isupper() and len(b) < 40: pending = b; continue
            if pending: facts.append({'label': pending.replace('\ufeff', '').strip().title().replace('/City', '/city').replace('# Of', '# of'), 'value': b}); pending = None; continue
            if not facts: desc.extend(paras(RT, b))
    # the published page's heading, which is what visitors saw (e.g. "Galerie St. Marc" where the post title has no stop)
    h = BeautifulSoup(p['post_content'], 'lxml').find(['h1', 'h2'])
    if h and h.get_text(strip=True): name = H(h.get_text(' ', strip=True))
    gallery = []
    if slider:
        slides = sorted([i for i in sliders.get(slider, []) if byid.get(i, {}).get('post_status') == 'publish'],
                        key=lambda i: int(byid[i]['menu_order']))
        for i in slides:
            th = M[i].get('_thumbnail_id')
            f = M.get(int(th), {}).get('_wp_attached_file') if th else None
            if f and os.path.exists(os.path.join(UP, f)): gallery.append(image(f))
    thumb = M[int(p['ID'])].get('_thumbnail_id')
    cover = M.get(int(thumb), {}).get('_wp_attached_file') if thumb else None
    if cover and not os.path.exists(os.path.join(UP, cover)): cover = None
    live = props_live.get(p['post_name'], [])
    properties.append({'slug': p['post_name'], 'name': name, 'category': pc[0], 'date': p['post_date'][:10],
                       'description': desc, 'facts': facts, 'gallery': gallery,
                       'cover': image(cover) or (gallery[0] if gallery else None),
                       'status': (live[0]['status'] if live else None),
                       'city': (live[0].get('city') if live else None), 'country': (live[0].get('country') if live else None)})
properties.sort(key=lambda x: x['name'])
# NOTE: since October 2026 each property is its own file in src/data/properties (page and map pin together), edited
# by iAM in Pages CMS; don't re-run this over src/data.
json.dump(properties, open(f'{DATA}/properties.json', 'w'), indent=2, ensure_ascii=False)

# ---------- redirects from renamed posts ----------
live_slugs = {p['post_name'] for p in posts} | set(page)
redirects = {old: new for old, new in old_slugs.items()
             if new in live_slugs and old not in live_slugs and not old.isdigit() and old != new}
json.dump(redirects, open(f'{DATA}/redirects.json', 'w'), indent=2, ensure_ascii=False)

# ---------- page images (hero backgrounds etc.) ----------
for slug in ('homepage', 'about', 'team', 'responsibility', 'contact', 'investor-relations', 'latest-news'):
    for l in dump_lines(int(page[slug]['ID'])):
        m = re.search(r'bg=(\S+)', l)
        if m: image(m.group(1))
for f in ('2023/01/logo.png', '2022/12/iAMCapital.png', '2026/03/LEED-logo-scaled.png', '2026/03/well-gold-solid-new.png'):
    image(f)
# images the live map loads from iamcapital.com
for x in sum(props_live.values(), []):
    r = rel_upload(x.get('imageUrl', ''))
    if r: used_files.add(r)

# ---------- copy files ----------
missing = []
for rel in sorted(used_images):
    src = os.path.join(UP, rel)
    if not os.path.exists(src): missing.append(rel); continue
    dst = os.path.join(ASSETS, rel); os.makedirs(os.path.dirname(dst), exist_ok=True); shutil.copy2(src, dst)
for rel in sorted(used_files):
    src = os.path.join(UP, rel)
    if not os.path.exists(src): missing.append(rel); continue
    dst = os.path.join(PUBUP, rel); os.makedirs(os.path.dirname(dst), exist_ok=True); shutil.copy2(src, dst)

print('documents', {k: len(v) for k, v in documents.items()}, 'events', len(events), 'timeline', len(timeline))
print('funds', len(funds), 'team', len(uniq), 'legal', len(legal), 'properties', len(properties), 'redirects', len(redirects))
print('images', len(used_images), 'files', len(used_files), 'missing', missing)
