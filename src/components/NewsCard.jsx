import { Link } from "react-router-dom";
import { formatDate } from "../data/news";
import { firstImage } from "../lib/blocks";

function NewsCard({ article, featured = false }) {
  const cover = firstImage(article.body);

  return (
    <article
      itemProp="blogPost"
      itemScope
      itemType="https://schema.org/BlogPosting"
      className="h-full"
    >
      <Link
        to={`/news/${article.slug}`}
        className={`group flex h-full flex-col overflow-hidden rounded-2xl bg-neutral-950 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1 hover:ring-white/30 ${
          featured ? "md:flex-row" : ""
        }`}
      >
        {cover && (
          <div
            className={`overflow-hidden bg-neutral-900 ${
              featured
                ? "aspect-[16/9] md:aspect-auto md:w-1/2"
                : "aspect-[16/9]"
            }`}
          >
            <img
              src={cover}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        <div
          className={`flex flex-1 flex-col ${featured ? "p-8 md:p-12" : "p-6"}`}
        >
          <div className="mb-4 flex flex-wrap items-center gap-3 text-xs uppercase tracking-wider text-white/50">
            <span className="rounded-full bg-white/10 px-3 py-1 text-white/80">
              {article.category}
            </span>
            <time dateTime={article.date} itemProp="datePublished">
              {formatDate(article.date)}
            </time>
          </div>

          <h2
            itemProp="headline"
            className={`font-bold text-white ${
              featured
                ? "mb-4 text-2xl leading-tight sm:text-3xl md:text-4xl"
                : "mb-3 text-xl"
            }`}
          >
            {article.title}
          </h2>

          <p
            itemProp="description"
            className={`leading-relaxed text-white/70 ${
              featured ? "max-w-3xl text-base sm:text-lg" : "mb-6 text-sm"
            }`}
          >
            {article.excerpt}
          </p>

          <div
            className={`mt-auto flex items-center justify-between text-xs uppercase tracking-wider text-white/40 ${
              featured ? "pt-8" : ""
            }`}
          >
            <span>{article.readTime} menit baca</span>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-white/60 transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/[0.06] group-hover:text-white">
              Baca
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default NewsCard;
