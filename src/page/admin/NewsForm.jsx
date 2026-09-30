import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import RichEditor from "../../components/RichEditor";
import {
  categories,
  createArticle,
  fetchArticleById,
  slugify,
  updateArticle,
} from "../../data/news";

const inputClass =
  "w-full rounded-lg border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/40 focus:border-white/40";

const options = categories.slice(1);

function NewsForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [category, setCategory] = useState(options[0]);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(editing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = editing
      ? "Edit Berita | ChanThecno"
      : "Berita Baru | ChanThecno";
    if (!editing) return;
    fetchArticleById(id)
      .then((article) => {
        if (!article) {
          setError("Berita tidak ditemukan.");
          return;
        }
        setTitle(article.title);
        setSlug(article.slug);
        setSlugTouched(true);
        setCategory(article.category);
        setExcerpt(article.excerpt);
        setContent(article.body);
      })
      .catch(() => setError("Gagal memuat berita."))
      .finally(() => setLoading(false));
  }, [id, editing]);

  const handleTitle = (value) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("Isi berita wajib diisi.");
      return;
    }
    setSubmitting(true);
    setError("");
    const values = {
      title: title.trim(),
      slug: slugify(slug),
      category,
      excerpt: excerpt.trim(),
      content: content.trim(),
    };
    try {
      if (editing) await updateArticle(id, values);
      else await createArticle(values);
      navigate("/admin/news", { replace: true });
    } catch (err) {
      setError(
        err.code === "23505"
          ? "Slug sudah dipakai berita lain."
          : "Gagal menyimpan berita.",
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black">
      <main className="mx-auto w-full max-w-3xl px-6 py-12 sm:px-10">
        <Link
          to="/admin/news"
          className="mb-8 inline-flex text-sm text-white/60 transition-colors duration-300 hover:text-white"
        >
          ← Kembali
        </Link>

        <h1 className="mb-8 text-3xl font-bold tracking-tight text-white">
          {editing ? "Edit Berita" : "Berita Baru"}
        </h1>

        {loading ? (
          <p className="text-white/60">Memuat...</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <label className="flex flex-col gap-2 text-sm text-white/70">
              Judul
              <input
                value={title}
                onChange={(e) => handleTitle(e.target.value)}
                required
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-white/70">
              Slug (alamat URL)
              <input
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugTouched(true);
                }}
                required
                className={inputClass}
              />
              <span className="text-xs text-white/40">
                /news/{slugify(slug) || "slug-berita"}
              </span>
            </label>

            <label className="flex flex-col gap-2 text-sm text-white/70">
              Kategori
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputClass}
              >
                {options.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm text-white/70">
              Ringkasan (tampil juga sebagai deskripsi di Google)
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                required
                maxLength={160}
                rows={3}
                className={inputClass}
              />
              <span className="text-xs text-white/40">
                {excerpt.length}/160
              </span>
            </label>

            <div className="flex flex-col gap-2 text-sm text-white/70">
              <span>Isi berita</span>
              <RichEditor value={content} onChange={setContent} />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition-all duration-300 hover:bg-white/80 disabled:opacity-50"
              >
                {submitting ? "Menyimpan..." : "Simpan"}
              </button>
              <Link
                to="/admin/news"
                className="rounded-full border border-white/20 px-6 py-2.5 text-sm text-white transition-all duration-300 hover:border-white/50 hover:bg-white/10"
              >
                Batal
              </Link>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

export default NewsForm;
