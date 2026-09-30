import { Link, NavLink } from "react-router-dom";

function NewsNavbar() {
  return (
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
          <span className="hidden text-sm font-semibold tracking-wide text-white sm:block">
            ChanThecno
          </span>
        </Link>

        <ul className="flex items-center gap-1 sm:gap-2">
          <li>
            <NavLink
              to="/"
              end
              className="rounded-full px-3 py-1.5 text-xs font-medium tracking-wide text-white/60 transition-all duration-300 hover:bg-white/5 hover:text-white sm:px-4 sm:text-sm"
            >
              Beranda
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/news"
              className={({ isActive }) =>
                `rounded-full px-3 py-1.5 text-xs font-medium tracking-wide transition-all duration-300 sm:px-4 sm:text-sm ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              News
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default NewsNavbar;
