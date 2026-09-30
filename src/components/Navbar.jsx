import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const links = [
  { id: "home", label: "Home" },
  { id: "about", label: "Tentang" },
  { id: "chanthecno", label: "ChanThecno" },
  { id: "school", label: "Sekolah" },
];

function Navbar() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState("about");

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

  const handleClick = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
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
          <span className="hidden text-sm font-semibold tracking-wide text-white sm:block">
            ChanThecno
          </span>
        </a>

        <ul className="flex items-center gap-1 sm:gap-2">
          {links.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={(e) => handleClick(e, link.id)}
                aria-current={active === link.id ? "page" : undefined}
                className={`rounded-full px-3 py-1.5 text-xs font-medium tracking-wide transition-all duration-300 sm:px-4 sm:text-sm ${
                  active === link.id
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Link
              to="/news"
              className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium tracking-wide text-white transition-all duration-300 hover:border-white/50 hover:bg-white/10 sm:px-4 sm:text-sm"
            >
              News
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
