const SITE = "https://chanthecno.co";

export default async function handler(req, res) {
  const base = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  let rows = [];
  try {
    const response = await fetch(
      `${base}/rest/v1/news?select=slug,created_at&order=created_at.desc`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } },
    );
    if (response.ok) rows = await response.json();
  } catch {
    rows = [];
  }

  const pages = [
    { loc: `${SITE}/` },
    { loc: `${SITE}/news`, lastmod: rows[0]?.created_at },
    ...rows.map((row) => ({
      loc: `${SITE}/news/${row.slug}`,
      lastmod: row.created_at,
    })),
  ];

  const body = pages
    .map(
      ({ loc, lastmod }) =>
        `  <url>\n    <loc>${loc}</loc>${
          lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""
        }\n  </url>`,
    )
    .join("\n");

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
  res
    .status(200)
    .send(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`,
    );
}
