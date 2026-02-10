export default async function handler(req, res) {
  const { url } = req.query;

  const html = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  }).then(r => r.text());

  const match = html.match(/property="og:image" content="(.*?)"/);

  res.json({
    image: match ? match[1] : null
  });
}
