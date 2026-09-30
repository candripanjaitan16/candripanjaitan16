import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { signInWithGoogle } from "../../data/comments";
import { useSession } from "../../hooks/useSession";
import { useIsAdmin } from "../../hooks/useIsAdmin";

function AdminLogin() {
  const session = useSession();
  const isAdmin = useIsAdmin(session);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isAdmin) return <Navigate to="/admin/news" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setSubmitting(false);
    if (signInError) {
      setError("Email atau password salah.");
      return;
    }
    navigate("/admin/news", { replace: true });
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black px-6">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-neutral-950 p-8 ring-1 ring-white/10">
        <h1 className="text-2xl font-bold text-white">Login Admin</h1>

        {session && isAdmin === false && (
          <p className="rounded-lg bg-red-400/10 p-3 text-sm text-red-300">
            Akun {session.user.email} bukan admin.
          </p>
        )}

        <button
          type="button"
          onClick={signInWithGoogle}
          className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-all duration-300 hover:bg-white/80"
        >
          Masuk dengan Google
        </button>

        <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-white/30">
          <span className="h-px flex-1 bg-white/10" />
          atau
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            aria-label="Email"
            required
            className="rounded-lg border border-white/10 bg-black px-4 py-2.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/40 focus:border-white/40"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            aria-label="Password"
            required
            className="rounded-lg border border-white/10 bg-black px-4 py-2.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/40 focus:border-white/40"
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:border-white/50 hover:bg-white/10 disabled:opacity-50"
          >
            {submitting ? "Masuk..." : "Masuk dengan email"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
