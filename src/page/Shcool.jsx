import { SpiderCursor } from "../components/SpiderCursor";

function School() {
  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">
      <SpiderCursor />

      <section
        id="school"
        className="relative z-10 flex flex-col items-center justify-center w-full min-h-screen px-6 sm:px-10 md:px-16 py-20 gap-10 scroll-mt-20"
        itemScope
        itemType="https://schema.org/EducationalOrganization"
      >
        <header className="text-center max-w-2xl">
          <h2
            className="text-white text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
            itemProp="name"
          >
            SMAN 2 Siborongborong
          </h2>
          <p className="text-white/70 text-base sm:text-lg leading-relaxed">
            Saya, <span itemProp="alumni">Candri Panjaitan</span>, saat ini
            menempuh pendidikan di SMAN 2 Siborongborong dan akan menyelesaikan
            studi pada tahun 2027. Selama masa sekolah ini, saya mulai membangun
            ChanThecno sebagai langkah awal mewujudkan mimpi di bidang
            teknologi.
          </p>
        </header>

        <div className="w-full max-w-3xl rounded-2xl overflow-hidden ring-1 ring-white/10">
          <iframe
            title="Lokasi SMAN 2 Siborongborong"
            src="https://www.google.com/maps?q=SMA+Negeri+2+Siborongborong&output=embed"
            className="w-full h-[350px] sm:h-[450px] border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <dl className="flex flex-nowrap justify-center gap-4 sm:gap-16 border-t border-white/10 pt-8 w-full max-w-2xl overflow-x-auto">
          <div className="text-center shrink-0">
            <dt className="sr-only">Tahun Lulus</dt>
            <dd className="text-white text-xl sm:text-3xl font-bold mb-1">
              2027
            </dd>
            <p className="text-white/50 text-xs sm:text-sm uppercase tracking-wider">
              Tahun Lulus
            </p>
          </div>
          <div className="text-center shrink-0">
            <dt className="sr-only">Kelas</dt>
            <dd className="text-white text-xl sm:text-3xl font-bold mb-1">
              XII
            </dd>
            <p className="text-white/50 text-xs sm:text-sm uppercase tracking-wider">
              Kelas
            </p>
          </div>
          <div className="text-center shrink-0">
            <dt className="sr-only">Nama Sekolah</dt>
            <dd className="text-white text-xl sm:text-3xl font-bold mb-1">
              SMA
            </dd>
            <p className="text-white/50 text-xs sm:text-sm uppercase tracking-wider">
              Negeri 2
            </p>
          </div>
        </dl>

        <meta
          itemProp="address"
          content="Siborongborong, Tapanuli Utara, Sumatera Utara"
        />
      </section>
    </div>
  );
}

export default School;
