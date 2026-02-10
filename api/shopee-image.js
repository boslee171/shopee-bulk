export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ image: null, error: 'URL kosong' });
  }

  try {
    let shopid = null;
    let itemid = null;

    // FORMAT: /product/shopid/itemid
    const productMatch = url.match(/product\/(\d+)\/(\d+)/);

    // FORMAT: -i.shopid.itemid
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

    // ⚠️ PAKAI HOST & HEADER YANG BENAR
    const apiUrl = `https://shopee.co.id/api/v4/item/get?itemid=${itemid}&shopid=${shopid}`;

    const r = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json',
        'Accept-Language': 'id-ID,id;q=0.9',
        'Referer': 'https://shopee.co.id/',
        'Origin': 'https://shopee.co.id'
      }
    });

    const json = await r.json();
    const data = json?.data;

    if (!data) {
      return res.json({ image: null, error: 'Data kosong dari Shopee' });
    }

    // 🔥 LOGIC FINAL (INI KUNCINYA)
    let imageId = null;

    if (data.images && data.images.length > 0) {
      imageId = data.images[0];
    } else if (data.image) {
      imageId = data.image;
    }

    if (!imageId) {
      return res.json({
        image: null,
        error: 'Image ID tidak tersedia di response',
        debug: Object.keys(data)
      });
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
      error: 'Internal server error'
    });
  }
}
