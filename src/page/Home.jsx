import { useRef } from "react";
import GambarCandri15351025 from "../assets/candri 1535 × 1025.png";
import { SpiderCursor } from "../components/SpiderCursor";

function Home() {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mx", `${x}px`);
    card.style.setProperty("--my", `${y}px`);
  };

  return (
    <div className="relative flex items-center justify-center w-full min-h-screen bg-black px-6 sm:px-10 md:px-16 overflow-hidden">
      <SpiderCursor />

      <section
        id="home"
        className="relative z-10 flex flex-col md:flex-row w-full max-w-7xl gap-10 md:gap-16 items-center justify-between scroll-mt-20"
        itemScope
        itemType="https://schema.org/Person"
      >
        <div className="w-full md:w-auto flex flex-col items-start justify-center text-left order-2 md:order-1">
          <h1
            className="text-white text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-5"
            itemProp="name"
          >
            Candri Panjaitan
          </h1>
          <p
            className="text-white/60 text-base sm:text-lg font-medium uppercase tracking-wider mb-8"
            itemProp="jobTitle"
          >
            Founder Chantecno | AI Automation
          </p>

          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer me"
            itemProp="sameAs"
            aria-label="Kunjungi profil GitHub Candri Panjaitan"
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 text-white/80 text-sm font-medium tracking-wide transition-all duration-300 hover:border-white/40 hover:text-white hover:bg-white/5"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 fill-current transition-transform duration-300 group-hover:rotate-12"
              aria-hidden="true"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.04-3.34.72-4.04-1.61-4.04-1.61-.55-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.76.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.29 0 .32.22.7.83.58C20.56 21.79 24 17.3 24 12c0-6.63-5.37-12-12-12Z" />
            </svg>
            GitHub
          </a>

          <meta itemProp="worksFor" content="ChanThecno" />
        </div>

        <div className="w-full md:w-auto flex items-center justify-center order-1 md:order-2">
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            style={{
              "--mx": "50%",
              "--my": "50%",
              backgroundImage:
                "radial-gradient(300px circle at var(--mx) var(--my), rgba(255,255,255,0.12), transparent 70%)",
            }}
            className="relative p-2 rounded-2xl bg-neutral-950 ring-1 ring-white/10 transition-shadow duration-300 hover:ring-white/20"
          >
            <img
              src={GambarCandri15351025}
              alt="Candri Panjaitan, Founder ChanThecno"
              itemProp="image"
              className="w-full h-auto max-w-sm sm:max-w-md md:max-w-2xl max-h-[85vh] rounded-xl object-contain relative z-10"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;