// Serves /video/* with HTTP Range support. Cloudflare Pages answers every request for a static file with the whole
// file (200), but Safari on iPhone and Mac will only play a <video> whose server returns partial content (206) for
// Range requests. This function fetches the file from the site's own assets and streams just the requested bytes.
// Cloudflare builds anything in /functions with the site; `npx wrangler pages dev dist` runs it locally.

const CACHE = 'public, max-age=604800';

export async function onRequest({ request, env }) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
  }
  let asset = await env.ASSETS.fetch(new Request(request.url));
  if (!asset.ok || !asset.body) return asset;

  // Cloudflare sends the file's size; when it doesn't (e.g. some local servers), read the file once to measure it
  let size = Number(asset.headers.get('Content-Length'));
  if (!size && request.headers.get('Range')) {
    const bytes = await asset.arrayBuffer();
    size = bytes.byteLength;
    asset = new Response(bytes, { headers: asset.headers });
  }
  const headers = new Headers({
    'Content-Type': asset.headers.get('Content-Type') || 'video/mp4',
    'Accept-Ranges': 'bytes',
    'Cache-Control': CACHE,
    'X-Content-Type-Options': 'nosniff',
  });
  const etag = asset.headers.get('ETag');
  if (etag) headers.set('ETag', etag);

  const range = parseRange(request.headers.get('Range'), size);
  if (!range) {
    // No (usable) Range header, or the size is unknown: send the whole file
    if (size) headers.set('Content-Length', String(size));
    return new Response(request.method === 'HEAD' ? null : asset.body, { status: 200, headers });
  }
  if (range === 'unsatisfiable') {
    asset.body.cancel();
    headers.set('Content-Range', `bytes */${size}`);
    return new Response(null, { status: 416, headers });
  }

  const [start, end] = range;
  headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
  headers.set('Content-Length', String(end - start + 1));
  if (request.method === 'HEAD') {
    asset.body.cancel();
    return new Response(null, { status: 206, headers });
  }
  return new Response(slice(asset.body, start, end), { status: 206, headers });
}

// "bytes=START-END", "bytes=START-" or "bytes=-SUFFIX" (a single range); null when absent or not usable
function parseRange(header, size) {
  if (!header || !size) return null;
  const m = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!m || (m[1] === '' && m[2] === '')) return null;
  let start, end;
  if (m[1] === '') {
    start = Math.max(0, size - Number(m[2]));
    end = size - 1;
  } else {
    start = Number(m[1]);
    end = m[2] === '' ? size - 1 : Math.min(Number(m[2]), size - 1);
  }
  if (start >= size || start > end) return 'unsatisfiable';
  return [start, end];
}

// Passes on only bytes start..end (inclusive) of the stream, without copying chunks, and stops reading at the end
function slice(stream, start, end) {
  const reader = stream.getReader();
  let pos = 0;
  return new ReadableStream({
    async pull(controller) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) return controller.close();
        const chunkStart = pos;
        pos += value.byteLength;
        if (pos <= start) continue;
        const from = Math.max(0, start - chunkStart);
        const to = Math.min(value.byteLength, end - chunkStart + 1);
        controller.enqueue(value.subarray(from, to));
        if (pos > end) {
          reader.cancel();
          return controller.close();
        }
        return;
      }
    },
    cancel(reason) {
      return reader.cancel(reason);
    },
  });
}
