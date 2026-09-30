import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const links = [
  { id: "home", label: "Home" },
  { id: "about", label: "Tentang" },
  { id: "chanthecno", label: "ChanThecno" },
  { id: "school", label: "Sekolah" },
];

const desktopLink = (isActive) =>
  `rounded-full px-4 py-1.5 text-sm font-medium tracking-wide transition-all duration-300 ${
    isActive
      ? "bg-white/10 text-white"
      : "text-white/60 hover:bg-white/5 hover:text-white"
  }`;

const mobileLink = (isActive) =>
  `block rounded-xl px-4 py-3 text-base font-medium tracking-wide transition-all duration-300 ${
    isActive
      ? "bg-white/10 text-white"
      : "text-white/60 hover:bg-white/5 hover:text-white"
  }`;

function Navbar() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState("about");
  const [open, setOpen] = useState(false);

  // Navbar muncul setelah section #home lewat
  useEffect(() => {
    const home = document.getElementById("home");
    if (!home) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 },
    );

    observer.observe(home);
    return () => observer.disconnect();
  }, []);

  // Menandai section yang sedang aktif
  useEffect(() => {
    const targets = links
      .slice(1)
      .map((link) => document.getElementById(link.id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  // Tutup dengan Escape + kunci scroll halaman saat drawer terbuka
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

  const handleClick = (e, id) => {
    e.preventDefault();
    if (open) {
      setOpen(false);
      // Tunggu scroll-lock dilepas sebelum scroll halus berjalan
      setTimeout(
        () =>
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }),
        150,
      );
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur-md transition-all duration-300 ${
          visible
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <nav
          aria-label="Navigasi utama"
          className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 sm:px-10 md:px-16"
        >
          <a
            href="#home"
            onClick={(e) => handleClick(e, "home")}
            className="flex items-center gap-2"
            aria-label="Kembali ke atas"
          >
            <img src="/chanthecno.svg" alt="ChanThecno" className="h-7 w-7" />
            <span className="text-sm font-semibold tracking-wide text-white">
              ChanThecno
            </span>
          </a>

          {/* Desktop */}
          <ul className="hidden items-center gap-2 md:flex">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={(e) => handleClick(e, link.id)}
                  aria-current={active === link.id ? "page" : undefined}
                  className={desktopLink(active === link.id)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                to="/news"
                className="rounded-full border border-white/20 px-4 py-1.5 text-sm font-medium tracking-wide text-white transition-all duration-300 hover:border-white/50 hover:bg-white/10"
              >
                News
              </Link>
            </li>
          </ul>

          {/* Tombol hamburger (mobile) */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="main-mobile-menu"
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
        Backdrop dan drawer berada di luar <header>: header memakai
        backdrop-blur dan transform, yang membuat elemen fixed di
        dalamnya terikat ke header, bukan ke layar.
      */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        id="main-mobile-menu"
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
          {links.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={(e) => handleClick(e, link.id)}
                aria-current={active === link.id ? "page" : undefined}
                tabIndex={open ? 0 : -1}
                className={mobileLink(active === link.id)}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="mt-3 border-t border-white/10 pt-4">
            <Link
              to="/news"
              tabIndex={open ? 0 : -1}
              className="block rounded-xl border border-white/20 px-4 py-3 text-center text-base font-medium tracking-wide text-white transition-all duration-300 hover:border-white/50 hover:bg-white/10"
            >
              News
            </Link>
          </li>
        </ul>
      </aside>
    </>
  );
}

export default Navbar;
