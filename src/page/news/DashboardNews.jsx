import { useEffect, useMemo, useState } from "react";
import { SpiderCursor } from "../../components/SpiderCursor";
import NewsNavbar from "../../components/NewsNavbar";
import NewsCard from "../../components/NewsCard";
import Footer from "../../components/Footer";
import { categories, fetchArticles } from "../../data/news";

const PAGE_SIZE = 6;

function DashboardNews() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    document.title = "News | ChanThecno";
    fetchArticles()
      .then(setArticles)
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return articles.filter((article) => {
      const matchCategory =
        category === "Semua" || article.category === category;
      const matchQuery =
        !keyword ||
        article.title.toLowerCase().includes(keyword) ||
        article.excerpt.toLowerCase().includes(keyword);
      return matchCategory && matchQuery;
    });
  }, [articles, query, category]);

  const [featured, ...rest] = filtered;
  const visible = rest.slice(0, visibleCount);
  const hasMore = rest.length > visibleCount;

  const handleCategory = (item) => {
    setCategory(item);
    setVisibleCount(PAGE_SIZE);
  };

  const handleQuery = (value) => {
    setQuery(value);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      <SpiderCursor />
      <NewsNavbar />

      <main
        className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-32 pb-24 sm:px-10 md:px-16"
        itemScope
        itemType="https://schema.org/Blog"
      >
        <header className="mb-10">
          <h1 className="mb-4 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl">
            News
          </h1>
          <p className="text-base font-medium uppercase tracking-wider text-white/60 sm:text-lg">
            Kabar terbaru ChanThecno
          </p>
        </header>

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleCategory(item)}
                aria-pressed={category === item}
                className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium tracking-wide transition-all duration-300 ${
                  category === item
                    ? "border-white/40 bg-white/10 text-white"
                    : "border-white/10 text-white/60 hover:border-white/30 hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <input
            type="search"
            value={query}
            onChange={(e) => handleQuery(e.target.value)}
            placeholder="Cari berita..."
            aria-label="Cari berita"
            className="w-full rounded-full border border-white/10 bg-neutral-950 px-5 py-2 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/40 focus:border-white/40 md:w-72"
          />
        </div>

        <p
          className="mb-6 text-xs uppercase tracking-wider text-white/40"
          aria-live="polite"
        >
          {loading ? "Memuat berita..." : `${filtered.length} berita`}
        </p>

        {!loading && filtered.length === 0 && (
          <div className="rounded-2xl bg-neutral-950 p-10 text-center ring-1 ring-white/10">
            <p className="text-white/60">
              {failed ? "Gagal memuat berita." : "Tidak ada berita yang cocok."}
            </p>
          </div>
        )}

        {featured && (
          <div className="mb-6">
            <NewsCard article={featured} featured />
          </div>
        )}

        {visible.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((article) => (
              <NewsCard key={article.slug} article={article} />
            ))}
          </div>
        )}

        {hasMore && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              className="rounded-full border border-white/20 px-6 py-2.5 text-sm font-medium tracking-wide text-white transition-all duration-300 hover:border-white/50 hover:bg-white/10"
            >
              Muat lebih banyak
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default DashboardNews;
