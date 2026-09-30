import { useState } from "react";
import { IMAGE_SIZES, parseBlocks, serializeBlocks } from "../lib/blocks";

const SIZE_LABELS = { penuh: "Penuh", sedang: "Sedang", kecil: "Kecil" };

const iconButton =
  "flex h-7 w-7 items-center justify-center rounded-md text-sm text-white/50 transition-colors duration-200 hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-30";

function blockLabel(block) {
  if (block.type === "image") return "Gambar";
  if (block.type === "heading") return `Heading ${block.level}`;
  return "Teks";
}

function BlockArranger({ value, onChange }) {
  const blocks = parseBlocks(value);
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);

  const update = (next) => onChange(serializeBlocks(next));

  const move = (from, to) => {
    if (from === to || to < 0 || to >= blocks.length) return;
    const next = [...blocks];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    update(next);
  };

  const patch = (index, changes) =>
    update(
      blocks.map((block, i) =>
        i === index ? { ...block, ...changes } : block,
      ),
    );

  const remove = (index) => {
    if (!window.confirm("Hapus blok ini dari isi berita?")) return;
    update(blocks.filter((_, i) => i !== index));
  };

  const resetDrag = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  if (blocks.length === 0) {
    return (
      <div className="flex h-[28rem] items-center justify-center rounded-lg border border-dashed border-white/15 bg-neutral-950 px-6 text-center text-sm text-white/40">
        Belum ada isi. Tulis di tab Tulis, atau seret gambar ke sini.
      </div>
    );
  }

  return (
    <div className="h-[28rem] overflow-y-auto overscroll-contain rounded-lg border border-white/10 bg-neutral-950 p-3">
      <ul className="flex flex-col gap-3">
        {blocks.map((block, index) => {
          const isTarget =
            dragIndex !== null && overIndex === index && dragIndex !== index;

          return (
            <li
              key={index}
              data-block
              onDragOver={(e) => {
                if (dragIndex === null) return;
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                setOverIndex(index);
              }}
              onDrop={(e) => {
                if (dragIndex === null) return;
                e.preventDefault();
                move(dragIndex, index);
                resetDrag();
              }}
              className={`rounded-xl border bg-neutral-900/60 p-3 transition-all duration-200 ${
                dragIndex === index ? "opacity-40" : ""
              } ${isTarget ? "border-white/70" : "border-white/10"}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex shrink-0 flex-col items-center gap-1">
                  <span
                    draggable
                    title="Seret untuk memindahkan"
                    onDragStart={(e) => {
                      setDragIndex(index);
                      e.dataTransfer.effectAllowed = "move";
                      e.dataTransfer.setData("text/plain", String(index));
                      const card = e.currentTarget.closest("[data-block]");
                      if (card) e.dataTransfer.setDragImage(card, 16, 16);
                    }}
                    onDragEnd={resetDrag}
                    className="cursor-grab select-none rounded-md px-2 py-1 text-base leading-none text-white/40 transition-colors duration-200 hover:bg-white/10 hover:text-white active:cursor-grabbing"
                  >
                    ⠿
                  </span>
                  <button
                    type="button"
                    aria-label="Naikkan blok"
                    disabled={index === 0}
                    onClick={() => move(index, index - 1)}
                    className={iconButton}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    aria-label="Turunkan blok"
                    disabled={index === blocks.length - 1}
                    onClick={() => move(index, index + 1)}
                    className={iconButton}
                  >
                    ↓
                  </button>
                </div>

                <div className="min-w-0 flex-1">
                  <span className="mb-2 inline-block rounded-full bg-white/10 px-3 py-0.5 text-xs uppercase tracking-wider text-white/70">
                    {blockLabel(block)}
                  </span>

                  {block.type === "image" ? (
                    <div className="flex gap-3">
                      <img
                        src={block.src}
                        alt=""
                        draggable={false}
                        className="h-24 w-32 shrink-0 rounded-lg object-cover object-top ring-1 ring-white/10"
                      />
                      <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <input
                          value={block.alt}
                          onChange={(e) =>
                            patch(index, { alt: e.target.value })
                          }
                          placeholder="Keterangan gambar (opsional)"
                          aria-label="Keterangan gambar"
                          className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/30 focus:border-white/40"
                        />
                        <div className="flex gap-1.5">
                          {IMAGE_SIZES.map((size) => (
                            <button
                              key={size}
                              type="button"
                              aria-pressed={block.size === size}
                              onClick={() => patch(index, { size })}
                              className={`rounded-full border px-3 py-1 text-xs font-medium transition-all duration-300 ${
                                block.size === size
                                  ? "border-white/40 bg-white/10 text-white"
                                  : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                              }`}
                            >
                              {SIZE_LABELS[size]}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="line-clamp-3 whitespace-pre-line break-words text-sm leading-relaxed text-white/70">
                      {block.type === "heading" ? block.text : block.raw}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  aria-label="Hapus blok"
                  onClick={() => remove(index)}
                  className={`${iconButton} hover:!bg-red-400/10 hover:!text-red-400`}
                >
                  ✕
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default BlockArranger;
