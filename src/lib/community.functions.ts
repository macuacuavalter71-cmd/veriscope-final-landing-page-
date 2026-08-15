/**
 * Community writes. Reads happen straight from the database through the public
 * read policy; writes go through the server so they can be validated and
 * counted before anything is stored.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const PRODUCTS = [
  "prime",
  "intelligence",
  "edge",
  "trade_pilot",
  "alert_engine",
  "session_matrix",
  "ai_prompt_pack",
  "ecosystem",
] as const;

const postSchema = z.object({
  name: z.string().trim().min(2).max(48),
  content: z.string().trim().min(2).max(800),
  product: z.enum(PRODUCTS),
});

export const postComment = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => postSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: comment, error } = await supabaseAdmin
      .from("comments")
      .insert({
        name: data.name,
        content: data.content,
        product: data.product,
        avatar: data.name.slice(0, 1).toUpperCase(),
        origin: "user",
        type: "real",
        synthetic: false,
        status: "approved",
      })
      .select("id, name, content, avatar, product, likes, created_at")
      .single();

    if (error) throw new Error("Não foi possível publicar o comentário.");

    await supabaseAdmin.rpc("increment_community_comments");

    return comment;
  });

export const likeComment = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: likes, error } = await supabaseAdmin.rpc("like_comment", { _id: data.id });
    if (error) throw new Error("Não foi possível registar o like.");
    return { likes: likes ?? 0 };
  });

export const toggleLaunchLike = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ liked: z.boolean() }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: likes, error } = await supabaseAdmin.rpc("adjust_launch_likes", {
      _delta: data.liked ? 1 : -1,
    });
    if (error) throw new Error("Não foi possível registar o like.");
    return { likes: Number(likes ?? 0) };
  });
