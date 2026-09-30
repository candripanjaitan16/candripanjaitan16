import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

const IMAGE_SIZES = {
  penuh: { figure: "max-w-full", image: "max-h-[36rem]" },
  sedang: { figure: "max-w-md", image: "max-h-[26rem]" },
  kecil: { figure: "max-w-xs", image: "max-h-[16rem]" },
};

function heading(Tag, className) {
  return function Heading({ children }) {
    return <Tag className={className}>{children}</Tag>;
  };
}

function ArticleImage({ src, alt, title }) {
  const [open, setOpen] = useState(false);
  const size = IMAGE_SIZES[title] ?? IMAGE_SIZES.penuh;

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <figure
        className={`mx-auto my-2 flex w-full flex-col items-center ${size.figure}`}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Perbesar gambar"
          className="group block max-w-full cursor-zoom-in overflow-hidden rounded-2xl ring-1 ring-white/10 transition-all duration-300 hover:ring-white/30"
        >
          <img
            src={src}
            alt={alt ?? ""}
            loading="lazy"
            className={`block h-auto w-auto max-w-full object-contain transition-transform duration-500 group-hover:scale-[1.02] ${size.image}`}
          />
        </button>
        {alt && (
          <figcaption className="mt-3 max-w-full text-center text-sm leading-relaxed text-white/45">
            {alt}
          </figcaption>
        )}
      </figure>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt || "Gambar"}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-8"
        >
          <img
            src={src}
            alt={alt ?? ""}
            className="max-h-full max-w-full rounded-xl object-contain"
          />
        </div>
      )}
    </>
  );
}

const components = {
  h1: heading(
    "h2",
    "mt-10 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl",
  ),
  h2: heading(
    "h3",
    "mt-8 text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl",
  ),
  h3: heading(
    "h4",
    "mt-6 text-xl font-semibold leading-snug text-white sm:text-2xl",
  ),
  h4: heading("h5", "mt-5 text-lg font-semibold text-white sm:text-xl"),
  h5: heading(
    "h6",
    "mt-4 text-sm font-semibold uppercase tracking-widest text-white/70",
  ),
  p: ({ node, children }) => {
    const onlyImage =
      node?.children?.length === 1 && node.children[0].tagName === "img";
    return onlyImage ? <>{children}</> : <p>{children}</p>;
  },
  strong: ({ children }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-white underline decoration-white/30 underline-offset-4 transition-colors duration-300 hover:decoration-white"
    >
      {children}
    </a>
  ),
  img: ArticleImage,
  ul: ({ children }) => (
    <ul className="ml-6 flex list-disc flex-col gap-2 marker:text-white/40">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="ml-6 flex list-decimal flex-col gap-2 marker:text-white/40">
      {children}
    </ol>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-white/30 pl-6 italic text-white/70">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-4 border-white/10" />,
};

function ArticleContent({ source }) {
  return (
    <div className="flex flex-col gap-6 break-words text-[1.0625rem] leading-[1.85] text-white/75 sm:text-lg sm:leading-[1.85] [&>*:first-child]:mt-0 [&>p:first-child]:text-lg [&>p:first-child]:leading-relaxed [&>p:first-child]:text-white/90 sm:[&>p:first-child]:text-xl">
      <ReactMarkdown components={components}>{source}</ReactMarkdown>
    </div>
  );
}

export default ArticleContent;
