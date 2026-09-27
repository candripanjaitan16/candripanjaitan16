import { SpiderCursor } from "../components/SpiderCursor";

function About() {
  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">
      <SpiderCursor />

      <main
        id="about"
        className="relative z-10 flex items-center justify-center px-6 sm:px-10 md:px-16 pt-32 pb-24 scroll-mt-20"
        itemScope
        itemType="https://schema.org/AboutPage"
      >
        <div className="w-full max-w-6xl flex flex-col items-start text-left">
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            Tentang Chantecno
          </h1>

          <h2
            className="text-white/60 text-base sm:text-lg font-medium uppercase tracking-wider mb-5"
            itemProp="author"
            itemScope
            itemType="https://schema.org/Person"
          >
            <span itemProp="name">Candri Panjaitan</span> | Founder Chantecno |
            AI Automation
          </h2>

          <p
            className="text-white/70 text-base sm:text-lg leading-relaxed mb-4"
            itemProp="description"
          >
            Halo, saya <strong>Candri Panjaitan</strong>. Saya sedang membangun
            sebuah perusahaan teknologi yang berfokus pada pengembangan solusi
            automation, Artificial Intelligence, dan teknologi digital — untuk
            membantu bisnis meningkatkan efisiensi, produktivitas, dan
            perkembangan operasional mereka.
          </p>

          <h3 className="text-white/60 text-base sm:text-lg font-medium uppercase tracking-wider mb-3">
            Tentang Saya
          </h3>

          <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-10">
            Saya seorang siswa kelas 12 di SMAN 2 Siborongborong dan akan lulus
            pada tahun 2027. Ketertarikan saya pada teknologi bermula sejak
            kelas 4 SD, terinspirasi dari robot Emo. Setelah mengalami sebuah
            kecelakaan, saya justru kembali teringat pada hobi lama ini — dan
            sejak itu saya memutuskan untuk serius mendalaminya.
          </p>

          <dl className="overflow-x-auto no-scrollbar flex gap-6">
            <div>
              <dt className="sr-only">Tahun Didirikan</dt>
              <dd className="text-white text-2xl sm:text-3xl font-bold mb-1">
                2026
              </dd>
              <p className="text-white/50 text-sm uppercase tracking-wider">
                Didirikan
              </p>
            </div>

            <div>
              <dt className="sr-only">Teknologi Utama</dt>
              <dd className="text-white text-2xl sm:text-3xl font-bold mb-1">
                AI
              </dd>
              <p className="text-white/50 text-sm uppercase tracking-wider">
                Bantuan
              </p>
            </div>

            <div>
              <dt className="sr-only">Persentase Ide Orisinal</dt>
              <dd className="text-white text-2xl sm:text-3xl font-bold mb-1">
                100%
              </dd>
              <p className="text-white/50 text-sm uppercase tracking-wider">
                Ide
              </p>
            </div>
          </dl>
        </div>
      </main>
    </div>
  );
}

export default About;
