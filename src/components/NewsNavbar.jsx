import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

const links = [
  { to: "/", label: "Beranda", end: true },
  { to: "/news", label: "News" },
];

const desktopLink = ({ isActive }) =>
  `rounded-full px-4 py-1.5 text-sm font-medium tracking-wide transition-all duration-300 ${
    isActive
      ? "bg-white/10 text-white"
      : "text-white/60 hover:bg-white/5 hover:text-white"
  }`;

const mobileLink = ({ isActive }) =>
  `block rounded-xl px-4 py-3 text-base font-medium tracking-wide transition-all duration-300 ${
    isActive
      ? "bg-white/10 text-white"
      : "text-white/60 hover:bg-white/5 hover:text-white"
  }`;

function NewsNavbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Tutup menu saat pindah halaman
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Tutup dengan Escape + kunci scroll halaman saat menu terbuka
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Tutup otomatis jika layar dibesarkan ke ukuran desktop
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (e) => e.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur-md">
        <nav
          aria-label="Navigasi news"
          className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 sm:px-10 md:px-16"
        >
          <Link
            to="/"
            className="flex items-center gap-2"
            aria-label="Ke beranda"
          >
            <img src="/chanthecno.svg" alt="ChanThecno" className="h-7 w-7" />
            <span className="text-sm font-semibold tracking-wide text-white">
              ChanThecno
            </span>
          </Link>

          {/* Desktop */}
          <ul className="hidden items-center gap-2 md:flex">
            {links.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end} className={desktopLink}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Tombol hamburger (mobile) */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="news-mobile-menu"
            aria-label="Buka menu"
            className="-mr-2 flex h-10 w-10 items-center justify-center rounded-full text-white transition-all duration-300 hover:bg-white/10 md:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </nav>
      </header>

      {/*
        Backdrop dan drawer sengaja berada di luar <header>, karena
        backdrop-blur pada header membuat elemen fixed di dalamnya
        ikut terikat ke header (bukan ke layar).
      */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        id="news-mobile-menu"
        aria-label="Menu navigasi"
        aria-hidden={!open}
        className={`fixed top-0 right-0 z-[60] flex h-full w-72 max-w-[80%] flex-col border-l border-white/10 bg-neutral-950 shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-6">
          <span className="text-sm font-semibold tracking-wide text-white">
            Menu
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Tutup menu"
            tabIndex={open ? 0 : -1}
            className="-mr-2 flex h-10 w-10 items-center justify-center rounded-full text-white transition-all duration-300 hover:bg-white/10"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <ul className="flex flex-col gap-1 p-4">
          {links.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={mobileLink}
                tabIndex={open ? 0 : -1}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}

export default NewsNavbar;
