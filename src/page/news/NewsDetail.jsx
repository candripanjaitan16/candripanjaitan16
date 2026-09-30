import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SpiderCursor } from "../../components/SpiderCursor";
import NewsNavbar from "../../components/NewsNavbar";
import NewsCard from "../../components/NewsCard";
import Comments from "../../components/Comments";
import Footer from "../../components/Footer";
import { fetchArticle, fetchArticles, formatDate } from "../../data/news";

function NewsDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [others, setOthers] = useState([]);
  const [loading, setLoading] = useState(true);

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
    document.title = article
      ? `${article.title} | ChanThecno`
      : "Berita | ChanThecno";
  }, [article]);

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
      <SpiderCursor />
      <NewsNavbar />

      <main className="relative z-10 mx-auto w-full max-w-3xl px-6 pt-32 pb-24 sm:px-10">
        <Link
          to="/news"
          className="mb-10 inline-flex items-center gap-2 text-sm font-medium tracking-wide text-white/60 transition-colors duration-300 hover:text-white"
        >
          ← Kembali ke News
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
            <article
              itemScope
              itemType="https://schema.org/BlogPosting"
              className="flex flex-col"
            >
              <div className="mb-5 flex flex-wrap items-center gap-3 text-xs uppercase tracking-wider text-white/50">
                <span className="rounded-full bg-white/10 px-3 py-1 text-white/80">
                  {article.category}
                </span>
                <time dateTime={article.date} itemProp="datePublished">
                  {formatDate(article.date)}
                </time>
                <span>{article.readTime} menit baca</span>
              </div>

              <h1
                itemProp="headline"
                className="mb-6 text-3xl font-bold leading-[1.15] tracking-tight text-white sm:text-4xl md:text-5xl"
              >
                {article.title}
              </h1>

              <p
                itemProp="author"
                itemScope
                itemType="https://schema.org/Person"
                className="mb-10 border-b border-white/10 pb-8 text-sm text-white/50"
              >
                Ditulis oleh <span itemProp="name">Candri Panjaitan</span>
              </p>

              <div
                itemProp="articleBody"
                className="flex flex-col gap-6 text-base leading-relaxed text-white/75 sm:text-lg"
              >
                {article.content.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
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
