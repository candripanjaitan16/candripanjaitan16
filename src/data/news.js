import { supabase } from "../lib/supabase";

export const categories = ["Semua", "Pengumuman", "Teknologi", "Update"];

function toArticle(row) {
  const words = row.content.trim().split(/\s+/).length;
  return {
    id: row.id,
    slug: row.slug,
    category: row.category,
    title: row.title,
    excerpt: row.excerpt,
    body: row.content,
    content: row.content
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean),
    date: row.created_at,
    readTime: Math.max(1, Math.ceil(words / 200)),
  };
}

export async function fetchArticles() {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data.map(toArticle);
}

export async function fetchArticle(slug) {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? toArticle(data) : null;
}

export async function fetchArticleById(id) {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? toArticle(data) : null;
}

export async function createArticle(values) {
  const { error } = await supabase.from("news").insert(values);
  if (error) throw error;
}

export async function updateArticle(id, values) {
  const { error } = await supabase.from("news").update(values).eq("id", id);
  if (error) throw error;
}

export async function deleteArticle(id) {
  const { error } = await supabase.from("news").delete().eq("id", id);
  if (error) throw error;
}

export function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
