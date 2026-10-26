#!/usr/bin/env python3
"""Check that every address the old iamcapital.com was known by still works on the new site.

old-urls.txt was built in October 2026 from the Wayback Machine's crawl of iamcapital.com, the old site's Yoast SEO
records and its last archived sitemaps (about 600 addresses: pages, PDFs, images). Each one should now answer 200,
directly or after redirects. Run it against the live domain after the DNS change:

    python3 tools/seo/check-urls.py https://iamcapital.com
    python3 tools/seo/check-urls.py http://localhost:8799        # npx wrangler pages dev dist --port 8799

Known and expected failures are listed in EXPECTED_404 (pre-WordPress images that no longer exist, hacking probes).
"""
import re, sys, urllib.parse, http.client, collections, os

# ... and photos of people removed from the Team page at iAM's request (Alessandro Rossi, October 2026)
EXPECTED_404 = re.compile(r'^/(assets|media|images|photos)/|\.php$|^/captcha/|^/min/|^/burak-test/|\.mp4$|Alessandro-Rossi')

def fetch(base, path, hops=0):
    u = urllib.parse.urlparse(base)
    conn = (http.client.HTTPSConnection if u.scheme == 'https' else http.client.HTTPConnection)(u.netloc, timeout=30)
    conn.request('GET', urllib.parse.quote(path, safe='/?=&%'), headers={'User-Agent': 'iamcapital-url-check'})
    r = conn.getresponse(); r.read(0); conn.close()
    loc = r.getheader('Location')
    if r.status in (301, 302, 307, 308) and loc and hops < 6:
        nu = urllib.parse.urlparse(urllib.parse.urljoin(base + path, loc))
        if nu.netloc and nu.netloc != u.netloc and not nu.netloc.endswith('iamcapital.com'):
            return 200, hops + 1, 'external'
        return fetch(f'{nu.scheme}://{nu.netloc}', urllib.parse.unquote(nu.path) + ('?' + nu.query if nu.query else ''), hops + 1)
    return r.status, hops, path

def main():
    base = (sys.argv[1] if len(sys.argv) > 1 else 'https://iamcapital.com').rstrip('/')
    urls = [l for l in open(os.path.join(os.path.dirname(__file__), 'old-urls.txt')).read().split('\n') if l]
    bad, expected, hops = [], 0, collections.Counter()
    for path in urls:
        try: status, n, final = fetch(base, path)
        except Exception as e: status, n, final = f'ERR {e}', 0, ''
        hops[n] += 1
        if status != 200:
            if EXPECTED_404.search(path): expected += 1
            else: bad.append((path, status))
    print(f'{len(urls)} addresses checked against {base}')
    print(f'redirect hops: {dict(sorted(hops.items()))}  expected 404s: {expected}')
    for p, s in bad: print(f'  BROKEN {s} {p}')
    print('OK: nothing unexpected is broken' if not bad else f'{len(bad)} broken')
    sys.exit(1 if bad else 0)

if __name__ == '__main__':
    main()
