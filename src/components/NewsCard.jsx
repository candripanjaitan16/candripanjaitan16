import { Link } from "react-router-dom";
import { formatDate } from "../data/news";

function NewsCard({ article, featured = false }) {
  return (
    <article
      itemProp="blogPost"
      itemScope
      itemType="https://schema.org/BlogPosting"
      className="h-full"
    >
      <Link
        to={`/news/${article.slug}`}
        className={`group flex h-full flex-col rounded-2xl bg-neutral-950 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1 hover:ring-white/30 ${
          featured ? "p-8 md:p-12" : "p-6"
        }`}
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
          <span className="text-white/60 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white">
            Baca →
          </span>
        </div>
      </Link>
    </article>
  );
}

export default NewsCard;
