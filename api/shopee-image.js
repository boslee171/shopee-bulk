export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ image: null, error: 'URL kosong' });
  }

  try {
    let shopid = null;
    let itemid = null;

    // FORMAT 1: /product/shopid/itemid
    const productMatch = url.match(/product\/(\d+)\/(\d+)/);

    // FORMAT 2: -i.shopid.itemid
    const iMatch = url.match(/i\.(\d+)\.(\d+)/);

    if (productMatch) {
      shopid = productMatch[1];
      itemid = productMatch[2];
    } else if (iMatch) {
      shopid = iMatch[1];
      itemid = iMatch[2];
    }

    if (!shopid || !itemid) {
      return res.status(400).json({
        image: null,
        error: 'Format URL tidak dikenali'
      });
    }

    const apiUrl = `https://shopee.co.id/api/v4/item/get?itemid=${itemid}&shopid=${shopid}`;

    const r = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
      }
    });

    const json = await r.json();

    const imageId = json?.data?.image;
    if (!imageId) {
      return res.json({ image: null, error: 'Image ID tidak ditemukan' });
    }

    const imageUrl = `https://down-id.img.susercontent.com/file/${imageId}`;

    return res.json({
      image: imageUrl,
      shopid,
      itemid
    });

  } catch (err) {
    return res.status(500).json({
      image: null,
      error: 'Internal error'
    });
  }
}
