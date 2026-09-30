import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { deleteArticle, fetchArticles, formatDate } from "../../data/news";

function AdminNews() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Kelola News | ChanThecno";
    fetchArticles()
      .then(setArticles)
      .catch(() => setError("Gagal memuat berita."))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (article) => {
    if (!window.confirm(`Hapus "${article.title}"?`)) return;
    try {
      await deleteArticle(article.id);
      setArticles((current) =>
        current.filter((item) => item.id !== article.id),
      );
    } catch {
      setError("Gagal menghapus berita.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-black">
      <header className="border-b border-white/10">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 sm:px-10">
          <span className="text-sm font-semibold tracking-wide text-white">
            Admin ChanThecno
          </span>
          <div className="flex items-center gap-2">
            <Link
              to="/news"
              className="rounded-full px-4 py-1.5 text-sm text-white/60 transition-all duration-300 hover:bg-white/5 hover:text-white"
            >
              Lihat situs
            </Link>
            <button
              type="button"
              onClick={() => supabase.auth.signOut()}
              className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white transition-all duration-300 hover:border-white/50 hover:bg-white/10"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Kelola News
          </h1>
          <Link
            to="/admin/news/new"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition-all duration-300 hover:bg-white/80"
          >
            + Berita baru
          </Link>
        </div>

        {error && <p className="mb-6 text-sm text-red-400">{error}</p>}
        {loading && <p className="text-white/60">Memuat...</p>}

        {!loading && articles.length === 0 && !error && (
          <div className="rounded-2xl bg-neutral-950 p-10 text-center ring-1 ring-white/10">
            <p className="text-white/60">Belum ada berita.</p>
          </div>
        )}

        <ul className="flex flex-col gap-3">
          {articles.map((article) => (
            <li
              key={article.id}
              className="flex flex-col gap-4 rounded-2xl bg-neutral-950 p-5 ring-1 ring-white/10 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-3 text-xs uppercase tracking-wider text-white/50">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-white/80">
                    {article.category}
                  </span>
                  <time dateTime={article.date}>
                    {formatDate(article.date)}
                  </time>
                </div>
                <h2 className="truncate text-lg font-semibold text-white">
                  {article.title}
                </h2>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  to={`/admin/news/${article.id}/edit`}
                  className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white transition-all duration-300 hover:border-white/50 hover:bg-white/10"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(article)}
                  className="rounded-full border border-red-400/30 px-4 py-1.5 text-sm text-red-400 transition-all duration-300 hover:border-red-400/60 hover:bg-red-400/10"
                >
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default AdminNews;
