import { supabase } from "../lib/supabase";

export async function fetchComments(newsId) {
  const { data, error } = await supabase
    .from("comments")
    .select("id, user_id, author_name, author_avatar, content, created_at")
    .eq("news_id", newsId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function addComment(newsId, content) {
  const { error } = await supabase
    .from("comments")
    .insert({ news_id: newsId, content });
  if (error) throw error;
}

export async function deleteComment(id) {
  const { error } = await supabase.from("comments").delete().eq("id", id);
  if (error) throw error;
}

export function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.href },
  });
}
