import { useEffect, useRef, useState } from "react";
import ArticleContent from "./ArticleContent";
import BlockArranger from "./BlockArranger";
import { uploadImage } from "../data/media";
import { imageMarkdown } from "../lib/blocks";

const HEADINGS = [1, 2, 3, 4, 5];
const MENU_WIDTH = 224;
const MENU_HEIGHT = 320;
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const TABS = [
  ["write", "Tulis"],
  ["arrange", "Susun"],
  ["preview", "Pratinjau"],
];

function lineBounds(text, position) {
  const start = position === 0 ? 0 : text.lastIndexOf("\n", position - 1) + 1;
  const newline = text.indexOf("\n", position);
  return [start, newline === -1 ? text.length : newline];
}

function spacing(before, after) {
  const lead =
    before === "" || before.endsWith("\n\n")
      ? ""
      : before.endsWith("\n")
        ? "\n"
        : "\n\n";
  const trail = after.startsWith("\n\n")
    ? ""
    : after.startsWith("\n")
      ? "\n"
      : "\n\n";
  return [lead, trail];
}

function hasFiles(e) {
  return Array.from(e.dataTransfer.types).includes("Files");
}

function MenuItem({ children, onClick, indent = false }) {
  return (
    <button
      type="button"
      role="menuitem"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`flex w-full items-center rounded-lg py-2 pr-3 text-left text-sm text-white/80 transition-colors duration-200 hover:bg-white/10 hover:text-white ${
        indent ? "pl-8" : "pl-3"
      }`}
    >
      {children}
    </button>
  );
}

function RichEditor({ value, onChange }) {
  const textareaRef = useRef(null);
  const fileRef = useRef(null);
  const menuRef = useRef(null);
  const valueRef = useRef(value);
  const selectionRef = useRef({ start: 0, end: 0 });
  const [tab, setTab] = useState("write");
  const [menu, setMenu] = useState(null);
  const [headingOpen, setHeadingOpen] = useState(false);
  const [uploading, setUploading] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    if (!menu) return;
    const close = (e) => {
      if (menuRef.current?.contains(e.target)) return;
      setMenu(null);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setMenu(null);
    };
    window.addEventListener("mousedown", close);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", close);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
      window.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  useEffect(() => {
    if (!dragging) return;
    const stop = () => setDragging(false);
    window.addEventListener("dragend", stop);
    window.addEventListener("drop", stop);
    return () => {
      window.removeEventListener("dragend", stop);
      window.removeEventListener("drop", stop);
    };
  }, [dragging]);

  const commit = (next, start, end = start) => {
    onChange(next);
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(start, end);
    });
  };

  const replaceLine = (buildText, placeholder) => {
    const { start } = selectionRef.current;
    const [lineStart, lineEnd] = lineBounds(value, start);
    const plain = value
      .slice(lineStart, lineEnd)
      .replace(/^#{1,6}\s+/, "")
      .trim();
    const content = plain || placeholder;
    const before = value.slice(0, lineStart);
    const after = value.slice(lineEnd);
    const [lead, trail] = spacing(before, after);
    const text = buildText(content);
    const textStart = before.length + lead.length;
    const selectStart = textStart + (text.length - content.length);
    const selectEnd = textStart + text.length;
    const next = before + lead + text + trail + after;
    if (plain) commit(next, selectEnd);
    else commit(next, selectStart, selectEnd);
  };

  const setHeading = (level) =>
    replaceLine((content) => `${"#".repeat(level)} ${content}`, "Judul");

  const setParagraph = () =>
    replaceLine((content) => content, "Tulis paragraf di sini");

  const toggleBold = () => {
    const { start, end } = selectionRef.current;
    const selected = value.slice(start, end);

    if (
      start >= 2 &&
      value.slice(start - 2, start) === "**" &&
      value.slice(end, end + 2) === "**"
    ) {
      commit(
        value.slice(0, start - 2) + selected + value.slice(end + 2),
        start - 2,
        end - 2,
      );
      return;
    }

    if (
      selected.length >= 4 &&
      selected.startsWith("**") &&
      selected.endsWith("**")
    ) {
      const inner = selected.slice(2, -2);
      commit(
        value.slice(0, start) + inner + value.slice(end),
        start,
        start + inner.length,
      );
      return;
    }

    const text = selected || "teks tebal";
    commit(
      `${value.slice(0, start)}**${text}**${value.slice(end)}`,
      start + 2,
      start + 2 + text.length,
    );
  };

  const insertImages = async (fileList, position) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    const valid = files.filter(
      (file) => IMAGE_TYPES.includes(file.type) && file.size <= MAX_IMAGE_SIZE,
    );
    setNotice(
      valid.length < files.length
        ? "Sebagian file dilewati. Hanya JPG, PNG, WebP, atau GIF maksimal 2 MB yang diterima."
        : "",
    );
    if (valid.length === 0) return;

    setUploading(valid.length);
    const results = await Promise.allSettled(
      valid.map((file) => uploadImage(file)),
    );
    setUploading(0);

    const urls = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);
    if (urls.length < valid.length) {
      setNotice(
        "Sebagian gambar gagal diunggah. Pastikan kamu login sebagai admin.",
      );
    }
    if (urls.length === 0) return;

    const current = valueRef.current;
    const start = Math.min(position.start, current.length);
    const end = Math.min(position.end, current.length);
    const selectedAlt =
      start !== end
        ? current.slice(start, end).replace(/\s+/g, " ").trim()
        : "";
    const markdown = urls
      .map((src, index) =>
        imageMarkdown({ alt: index === 0 ? selectedAlt : "", src }),
      )
      .join("\n\n");
    const before = current.slice(0, start);
    const after = current.slice(end);
    const [lead, trail] = spacing(before, after);
    const cursor = before.length + lead.length + markdown.length + trail.length;
    commit(before + lead + markdown + trail + after, cursor);
  };

  const currentPosition = () => {
    const el = textareaRef.current;
    if (tab === "write" && el) {
      return { start: el.selectionStart, end: el.selectionEnd };
    }
    const length = valueRef.current.length;
    return { start: length, end: length };
  };

  const handleDragOver = (e) => {
    if (!hasFiles(e)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false);
  };

  const handleDrop = (e) => {
    if (!hasFiles(e)) return;
    e.preventDefault();
    setDragging(false);
    insertImages(e.dataTransfer.files, currentPosition());
  };

  const handlePaste = (e) => {
    const files = Array.from(e.clipboardData.files).filter((file) =>
      file.type.startsWith("image/"),
    );
    if (files.length === 0) return;
    e.preventDefault();
    insertImages(files, {
      start: e.target.selectionStart,
      end: e.target.selectionEnd,
    });
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    const el = textareaRef.current;
    selectionRef.current = { start: el.selectionStart, end: el.selectionEnd };
    setHeadingOpen(false);
    setMenu({
      x: Math.max(8, Math.min(e.clientX, window.innerWidth - MENU_WIDTH - 8)),
      y: Math.max(8, Math.min(e.clientY, window.innerHeight - MENU_HEIGHT - 8)),
    });
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
      e.preventDefault();
      const el = textareaRef.current;
      selectionRef.current = { start: el.selectionStart, end: el.selectionEnd };
      toggleBold();
    }
  };

  const run = (action) => {
    setMenu(null);
    action();
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          {TABS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              aria-pressed={tab === id}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-300 ${
                tab === id
                  ? "border-white/40 bg-white/10 text-white"
                  : "border-white/10 text-white/60 hover:border-white/30 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {uploading > 0 && (
          <span className="text-xs text-white/50">
            Mengunggah {uploading} gambar...
          </span>
        )}
      </div>

      <div
        className="relative"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {tab === "write" && (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onContextMenu={handleContextMenu}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            aria-label="Isi berita"
            spellCheck
            className="h-[28rem] min-h-64 w-full resize-y overflow-y-auto rounded-lg border border-white/10 bg-neutral-950 px-4 py-3 font-mono text-sm leading-relaxed text-white outline-none transition-all duration-300 placeholder:text-white/40 focus:border-white/40"
            placeholder="Tulis isi berita di sini. Klik kanan untuk menu format, atau seret gambar ke kolom ini."
          />
        )}

        {tab === "arrange" && (
          <BlockArranger value={value} onChange={onChange} />
        )}

        {tab === "preview" && (
          <div className="h-[28rem] w-full overflow-y-auto overscroll-contain rounded-lg border border-white/10 bg-neutral-950 px-6 py-5">
            {value.trim() ? (
              <ArticleContent source={value} />
            ) : (
              <p className="text-sm text-white/40">Belum ada isi.</p>
            )}
          </div>
        )}

        {dragging && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-lg border-2 border-dashed border-white/50 bg-black/70 backdrop-blur-sm">
            <div className="text-center">
              <p className="text-base font-semibold text-white">
                Lepas gambar di sini
              </p>
              <p className="mt-1 text-xs text-white/60">
                JPG, PNG, WebP, GIF · maksimal 2 MB
              </p>
            </div>
          </div>
        )}
      </div>

      {notice && <p className="text-sm text-red-400">{notice}</p>}

      <p className="text-xs leading-relaxed text-white/40">
        Seret atau tempel (Ctrl+V) gambar ke kolom tulis. Klik kanan untuk menu
        format, Ctrl+B untuk tebal. Tab Susun untuk menggeser urutan gambar dan
        paragraf.
      </p>

      <input
        ref={fileRef}
        type="file"
        accept={IMAGE_TYPES.join(",")}
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = "";
          insertImages(files, selectionRef.current);
        }}
      />

      {menu && (
        <div
          ref={menuRef}
          role="menu"
          aria-label="Format teks"
          onContextMenu={(e) => e.preventDefault()}
          style={{
            left: menu.x,
            top: menu.y,
            width: MENU_WIDTH,
            maxHeight: MENU_HEIGHT,
          }}
          className="fixed z-[60] overflow-y-auto overscroll-contain rounded-xl border border-white/15 bg-neutral-900 p-1.5 shadow-2xl shadow-black"
        >
          <MenuItem onClick={() => setHeadingOpen((open) => !open)}>
            Heading {headingOpen ? "▾" : "▸"}
          </MenuItem>
          {headingOpen &&
            HEADINGS.map((level) => (
              <MenuItem
                key={level}
                indent
                onClick={() => run(() => setHeading(level))}
              >
                Heading {level}
              </MenuItem>
            ))}
          <MenuItem onClick={() => run(toggleBold)}>Tebal</MenuItem>
          <MenuItem onClick={() => run(() => fileRef.current?.click())}>
            Gambar...
          </MenuItem>
          <MenuItem onClick={() => run(setParagraph)}>Paragraf</MenuItem>
        </div>
      )}
    </div>
  );
}

export default RichEditor;
