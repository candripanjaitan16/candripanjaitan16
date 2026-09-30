import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useSession } from "../hooks/useSession";
import { useIsAdmin } from "../hooks/useIsAdmin";
import { formatDate } from "../data/news";
import {
  addComment,
  deleteComment,
  fetchComments,
  signInWithGoogle,
} from "../data/comments";

const MAX_LENGTH = 1000;

function Avatar({ name, src }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        referrerPolicy="no-referrer"
        className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-white/10"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white"
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

function Comments({ newsId }) {
  const session = useSession();
  const isAdmin = useIsAdmin(session);
  const user = session?.user;

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(
    () =>
      fetchComments(newsId)
        .then(setComments)
        .catch(() => setError("Gagal memuat komentar."))
        .finally(() => setLoading(false)),
    [newsId],
  );

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = text.trim();
    if (!content) return;
    setSubmitting(true);
    setError("");
    try {
      await addComment(newsId, content);
      setText("");
      await load();
    } catch {
      setError("Gagal mengirim komentar.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus komentar ini?")) return;
    try {
      await deleteComment(id);
      setComments((current) => current.filter((item) => item.id !== id));
    } catch {
      setError("Gagal menghapus komentar.");
    }
  };

  return (
    <section
      aria-labelledby="komentar-judul"
      className="mt-20 border-t border-white/10 pt-12"
    >
      <h2
        id="komentar-judul"
        className="mb-8 text-sm font-medium uppercase tracking-wider text-white/60"
      >
        Komentar ({comments.length})
      </h2>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-10 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4 text-sm text-white/60">
            <span>
              Masuk sebagai{" "}
              <span className="text-white">
                {user.user_metadata?.full_name ?? user.user_metadata?.name}
              </span>
            </span>
            <button
              type="button"
              onClick={() => supabase.auth.signOut()}
              className="text-white/50 transition-colors duration-300 hover:text-white"
            >
              Keluar
            </button>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={MAX_LENGTH}
            rows={4}
            required
            placeholder="Tulis komentar..."
            aria-label="Tulis komentar"
            className="w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/40 focus:border-white/40"
          />

          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40">
              {text.length}/{MAX_LENGTH}
            </span>
            <button
              type="submit"
              disabled={submitting || !text.trim()}
              className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-black transition-all duration-300 hover:bg-white/80 disabled:opacity-40"
            >
              {submitting ? "Mengirim..." : "Kirim"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-10 flex flex-col items-start gap-4 rounded-2xl bg-neutral-950 p-6 ring-1 ring-white/10">
          <p className="text-sm text-white/70">
            Masuk dengan akun Google untuk ikut berkomentar.
          </p>
          <button
            type="button"
            onClick={signInWithGoogle}
            className="flex items-center gap-3 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-all duration-300 hover:bg-white/80"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3a7.2 7.2 0 0 1-10.7-3.78H1.34v3.1A12 12 0 0 0 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.36 14.31a7.2 7.2 0 0 1 0-4.62v-3.1H1.34a12 12 0 0 0 0 10.82l4.02-3.1Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44A11.93 11.93 0 0 0 12 0 12 12 0 0 0 1.34 6.59l4.02 3.1A7.15 7.15 0 0 1 12 4.77Z"
              />
            </svg>
            Masuk dengan Google
          </button>
        </div>
      )}

      {error && <p className="mb-6 text-sm text-red-400">{error}</p>}
      {loading && <p className="text-sm text-white/50">Memuat komentar...</p>}

      {!loading && comments.length === 0 && !error && (
        <p className="text-sm text-white/50">
          Belum ada komentar. Jadilah yang pertama.
        </p>
      )}

      <ul className="flex flex-col gap-6">
        {comments.map((comment) => (
          <li key={comment.id} className="flex gap-4">
            <Avatar name={comment.author_name} src={comment.author_avatar} />
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-sm font-semibold text-white">
                  {comment.author_name}
                </span>
                <time
                  dateTime={comment.created_at}
                  className="text-xs text-white/40"
                >
                  {formatDate(comment.created_at)}
                </time>
                {(user?.id === comment.user_id || isAdmin) && (
                  <button
                    type="button"
                    onClick={() => handleDelete(comment.id)}
                    className="ml-auto text-xs text-red-400/70 transition-colors duration-300 hover:text-red-400"
                  >
                    Hapus
                  </button>
                )}
              </div>
              <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-white/75">
                {comment.content}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Comments;
