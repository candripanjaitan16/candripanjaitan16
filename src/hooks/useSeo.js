import { useEffect } from "react";

export const SITE = "https://chanthecno.co";

export function useSeo({
  title,
  description,
  path,
  type = "website",
  image,
  noindex = false,
  jsonLd,
}) {
  const ld = jsonLd ? JSON.stringify(jsonLd) : "";

  useEffect(() => {
    if (!title) return;
    const undo = [];
    const url = `${SITE}${path}`;

    const meta = (attr, key, content) => {
      if (!content) return;
      let el = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (el) {
        const previous = el.getAttribute("content") ?? "";
        undo.push(() => el.setAttribute("content", previous));
      } else {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
        undo.push(() => el.remove());
      }
      el.setAttribute("content", content);
    };

    const previousTitle = document.title;
    document.title = title;
    undo.push(() => {
      document.title = previousTitle;
    });

    meta("name", "description", description);
    meta("property", "og:title", title);
    meta("property", "og:description", description);
    meta("property", "og:type", type);
    meta("property", "og:url", url);
    meta("property", "og:image", image);
    meta("name", "robots", noindex ? "noindex" : "");

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (canonical) {
      const previous = canonical.getAttribute("href") ?? "";
      undo.push(() => canonical.setAttribute("href", previous));
    } else {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
      undo.push(() => canonical.remove());
    }
    canonical.setAttribute("href", url);

    if (ld) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.textContent = ld;
      document.head.appendChild(script);
      undo.push(() => script.remove());
    }

    return () => undo.forEach((fn) => fn());
  }, [title, description, path, type, image, noindex, ld]);
}
