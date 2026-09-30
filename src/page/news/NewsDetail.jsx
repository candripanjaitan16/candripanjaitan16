import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ChanThecnoIcon from "../../assets/chanthecno.png"
import { SpiderCursor } from "../../components/SpiderCursor";
import NewsNavbar from "../../components/NewsNavbar";
import NewsCard from "../../components/NewsCard";
import ArticleContent from "../../components/ArticleContent";
import Comments from "../../components/Comments";
import Footer from "../../components/Footer";
import { fetchArticle, fetchArticles, formatDate } from "../../data/news";
import { firstImage } from "../../lib/blocks";
import { SITE, useSeo } from "../../hooks/useSeo";

function withoutLeadingTitle(markdown, title) {
  const match = markdown.match(/^\s*#{1,6}\s+(.+?)\s*(?:\n|$)/);
  if (match && match[1].trim().toLowerCase() === title.trim().toLowerCase()) {
    return markdown.slice(match[0].length).trimStart();
  }
  return markdown;
}

function NewsDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [others, setOthers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const articleRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchArticle(slug), fetchArticles()])
      .then(([current, all]) => {
        setArticle(current);
        setOthers(all);
      })
      .catch(() => setArticle(null))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!article) return;
    const update = () => {
      const el = articleRef.current;
      const bar = barRef.current;
      if (!el || !bar) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.6;
      const ratio = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      bar.style.transform = `scaleX(${ratio})`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [article]);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const image = article ? firstImage(article.body) : undefined;

  let title;
  if (article) title = `${article.title} | ChanThecno`;
  else if (!loading) title = "Berita tidak ditemukan | ChanThecno";

  useSeo({
    title,
    description: article?.excerpt,
    path: `/news/${slug}`,
    type: "article",
    image,
    noindex: !loading && !article,
    jsonLd: article
      ? {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: article.title,
          description: article.excerpt,
          datePublished: article.date,
          ...(image && { image }),
          author: { "@type": "Person", name: "Candri Panjaitan" },
          publisher: { "@type": "Organization", name: "ChanThecno", url: SITE },
          mainEntityOfPage: `${SITE}/news/${slug}`,
        }
      : undefined,
  });

  const related = article
    ? others
        .filter((item) => item.slug !== article.slug)
        .sort(
          (a, b) =>
            Number(b.category === article.category) -
            Number(a.category === article.category),
        )
        .slice(0, 2)
    : [];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      <div
        ref={barRef}
        aria-hidden="true"
        style={{ transform: "scaleX(0)" }}
        className="fixed left-0 top-0 z-[60] h-0.5 w-full origin-left bg-white/80"
      />

      <SpiderCursor />
      <NewsNavbar />

      <main className="relative z-10 mx-auto w-full max-w-3xl px-6 pt-32 pb-24 sm:px-10">
        <Link
          to="/news"
          className="mb-10 inline-flex items-center rounded-lg border border-white/10 px-4 py-2 text-sm text-white/45 transition-all duration-300 hover:border-white/20 hover:bg-white/5 hover:text-white/80"
        >
          Kembali ke News
        </Link>

        {loading && <p className="text-white/60">Memuat berita...</p>}

        {!loading && !article && (
          <div className="rounded-2xl bg-neutral-950 p-10 text-center ring-1 ring-white/10">
            <h1 className="mb-3 text-2xl font-bold text-white">
              Berita tidak ditemukan
            </h1>
            <p className="text-white/60">
              Berita yang kamu cari mungkin sudah dipindahkan atau dihapus.
            </p>
          </div>
        )}

        {article && (
          <>
            <article ref={articleRef} className="flex flex-col">
              <header className="mb-12">
                <div className="mb-6 flex flex-wrap items-center gap-3 text-xs uppercase tracking-wider text-white/50">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-white/80">
                    {article.category}
                  </span>
                  <time dateTime={article.date}>
                    {formatDate(article.date)}
                  </time>
                  <span>{article.readTime} menit baca</span>
                </div>

                <h1 className="mb-6 text-balance text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
                  {article.title}
                </h1>

                <p className="mb-8 text-lg leading-relaxed text-white/60 sm:text-xl">
                  {article.excerpt}
                </p>

                <div className="flex items-center justify-between gap-4 border-y border-white/10 py-5">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white"
                    >
                      <img
                        src={ChanThecnoIcon}
                        alt="Candri Panjaitan"
                        aria-hidden="true"
                        className="flex h-11 w-11 items-center justify-center rounded-full object-cover"
                      />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-white">
                        ChanThecno
                      </p>
                      <p className="text-xs text-white/50">
                        Founder ChanThecno
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopy}
                    className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white transition-all duration-300 hover:border-white/50 hover:bg-white/10"
                  >
                    {copied ? "Tautan disalin" : "Bagikan"}
                  </button>
                </div>
              </header>

              <ArticleContent
                source={withoutLeadingTitle(article.body, article.title)}
              />
            </article>

            <Comments newsId={article.id} />
          </>
        )}

        {related.length > 0 && (
          <section className="mt-20 border-t border-white/10 pt-12">
            <h2 className="mb-6 text-sm font-medium uppercase tracking-wider text-white/60">
              Berita lainnya
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {related.map((item) => (
                <NewsCard key={item.slug} article={item} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default NewsDetail;
