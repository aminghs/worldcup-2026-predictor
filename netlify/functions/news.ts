function extractTag(xml: string, tag: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, 'i'));
  if (!m) return '';
  return m[1]
    .trim()
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export default async () => {
  const res = await fetch('https://feeds.bbci.co.uk/sport/football/rss.xml', {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WorldCupPredictor/1.0)' },
  });

  if (!res.ok) return new Response('Upstream error', { status: 502 });

  const xml = await res.text();
  const items: { title: string; link: string; pubDate: string }[] = [];

  for (const [, itemXml] of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const title = extractTag(itemXml, 'title');
    const link = extractTag(itemXml, 'link') || extractTag(itemXml, 'guid');
    const pubDate = extractTag(itemXml, 'pubDate');
    if (title && link) items.push({ title, link, pubDate });
    if (items.length >= 6) break;
  }

  return Response.json(
    { items },
    { headers: { 'Cache-Control': 'public, max-age=600' } },
  );
};

export const config = { path: '/api/news' };
