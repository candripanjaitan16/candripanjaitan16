import { SpiderCursor } from "../components/SpiderCursor";
import TextArcEffect from "../components/TextArcEffect";

function Chanthecno() {
  return (
    <div className="relative w-full bg-black">
      <SpiderCursor />

      <section
        id="chanthecno"
        className="relative z-10 flex flex-col md:flex-row w-full px-6 sm:px-10 md:px-16 scroll-mt-20"
        itemScope
        itemType="https://schema.org/Organization"
      >
        <div className="md:sticky md:top-0 md:h-screen flex items-center justify-center md:w-1/2 py-16 md:py-0">
          <TextArcEffect />
        </div>

        <div className="md:w-1/2 flex flex-col justify-center py-12 md:py-40 gap-6 md:gap-8">
          <header>
            <h2
              className="text-white text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-4 md:mb-6"
              itemProp="name"
            >
              Tentang ChanThecno
            </h2>
            <p className="text-white/60 text-base sm:text-lg font-medium uppercase tracking-wider">
              AI Automation
            </p>
          </header>

          <div
            className="text-white/70 text-base sm:text-lg leading-relaxed flex flex-col gap-4"
            itemProp="description"
          >
            <p>
              ChanThecno adalah perusahaan teknologi yang berfokus pada
              pengembangan solusi automation, Artificial Intelligence, dan
              teknologi digital untuk membantu bisnis meningkatkan efisiensi,
              produktivitas, dan perkembangan operasional.
            </p>
            <p>
              ChanThecno akan memulai pengembangannya dengan menghadirkan solusi
              yang dapat membantu Usaha Mikro, Kecil, dan Menengah (UMKM) dalam
              memanfaatkan teknologi untuk mendukung kegiatan dan proses bisnis.
            </p>
            <p>
              Seiring dengan pertumbuhan perusahaan dan perkembangan teknologi,
              ChanThecno akan terus mengembangkan solusi yang dapat digunakan
              oleh berbagai skala bisnis, mulai dari UMKM, bisnis berkembang,
              hingga perusahaan dan organisasi yang lebih besar.
            </p>
            <p>
              Melalui pengembangan perangkat lunak, automation, dan Artificial
              Intelligence, ChanThecno bertujuan untuk menciptakan teknologi
              yang dapat membantu menyederhanakan pekerjaan, mengotomatisasi
              proses, dan meningkatkan produktivitas.
            </p>
            <p>
              ChanThecno dibangun secara bertahap dengan tujuan jangka panjang
              untuk menciptakan produk teknologi yang dapat digunakan oleh
              semakin banyak orang dan bisnis.
            </p>
            <p>
              Fokus ChanThecno bukan hanya membangun teknologi yang canggih,
              tetapi juga menciptakan teknologi yang mudah digunakan, relevan
              dengan kebutuhan pengguna, dan mampu berkembang sesuai dengan
              kebutuhan bisnis dari berbagai skala.
            </p>
          </div>

          <meta itemProp="foundingDate" content="2026" />
          <meta itemProp="founder" content="Candri Panjaitan" />
          <meta itemProp="url" content="https://chanthecno.co/" />
        </div>
      </section>
    </div>
  );
}

export default Chanthecno;
