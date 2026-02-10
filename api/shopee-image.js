export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.json({ image: null });

  try {
    // Ambil itemid & shopid dari URL Shopee
    const match = url.match(/i\.(\d+)\.(\d+)/);
    if (!match) return res.json({ image: null });

    const shopid = match[1];
    const itemid = match[2];

    // Shopee API (public, no auth)
    const apiUrl = `https://shopee.co.id/api/v4/item/get?itemid=${itemid}&shopid=${shopid}`;

    const r = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
      }
    });

    const data = await r.json();

    const imageId = data?.data?.image;
    if (!imageId) return res.json({ image: null });

    const imageUrl = `https://down-id.img.susercontent.com/file/${imageId}`;

    res.json({ image: imageUrl });

  } catch (e) {
    res.json({ image: null });
  }
}
