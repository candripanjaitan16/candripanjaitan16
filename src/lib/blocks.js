export const IMAGE_SIZES = ["penuh", "sedang", "kecil"];

const IMAGE_LINE = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)$/;
const HEADING_LINE = /^(#{1,6})\s+([\s\S]*)$/;

export function imageMarkdown({ alt = "", src, size = "penuh" }) {
  const cleanAlt = alt.replace(/[[\]\r\n]/g, "");
  const title = size && size !== "penuh" ? ` "${size}"` : "";
  return `![${cleanAlt}](${src}${title})`;
}

function toBlock(raw) {
  const image = raw.match(IMAGE_LINE);
  if (image) {
    return {
      type: "image",
      raw,
      alt: image[1],
      src: image[2],
      size: IMAGE_SIZES.includes(image[3]) ? image[3] : "penuh",
    };
  }
  const heading = raw.match(HEADING_LINE);
  if (heading) {
    return {
      type: "heading",
      raw,
      level: heading[1].length,
      text: heading[2],
    };
  }
  return { type: "text", raw };
}

export function parseBlocks(markdown) {
  return markdown
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map(toBlock);
}

export function serializeBlocks(blocks) {
  return blocks
    .map((block) => (block.type === "image" ? imageMarkdown(block) : block.raw))
    .join("\n\n");
}

export function firstImage(markdown) {
  const match = markdown.match(/!\[[^\]]*\]\(([^)\s]+)/);
  return match ? match[1] : undefined;
}
