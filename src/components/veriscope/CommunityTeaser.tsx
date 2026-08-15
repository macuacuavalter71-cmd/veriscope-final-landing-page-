import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { DiamondMark, Section } from "./Section";
import { supabase } from "@/lib/supabase";
import { toggleLaunchLike } from "@/lib/community.functions";
import { compactCount, freshAges } from "@/lib/format";

type Preview = {
  id: string;
  name: string;
  content: string;
  avatar: string;
  likes: number;
  age: string;
};

const LIKED_KEY = "veriscope.launch.liked";

export function CommunityTeaser() {
  const [items, setItems] = useState<Preview[]>([]);
  const [stats, setStats] = useState({ likes: 1200000, comments: 758000 });
  const [extraLikes, setExtraLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    try {
      setLiked(window.localStorage.getItem(LIKED_KEY) === "1");
    } catch {
      /* storage unavailable */
    }

    supabase
      .from("comments")
      .select("id, name, content, avatar, likes")
      .eq("status", "approved")
      .order("likes", { ascending: false })
      .limit(60)
      .then(({ data }) => {
        if (cancelled || !data) return;
        // Shuffle so the order changes on every page load, then stamp fresh ages.
        const shuffled = [...data].sort(() => Math.random() - 0.5).slice(0, 8);
        const ages = freshAges(shuffled.length);
        setItems(shuffled.map((row, i) => ({ ...row, age: ages[i]! }) as Preview));
      });

    supabase
      .from("community_stats")
      .select("id, likes, comments")
      .in("id", ["global", "launch_post"])
      .then(({ data }) => {
        if (cancelled || !data) return;
        const global = data.find((row) => row.id === "global");
        const launch = data.find((row) => row.id === "launch_post");
        if (global) setStats({ likes: Number(global.likes), comments: Number(global.comments) });
        if (launch) setExtraLikes(Number(launch.likes));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const onToggleLike = async () => {
    const next = !liked;
    setLiked(next);
    setExtraLikes((n) => Math.max(0, n + (next ? 1 : -1)));
    try {
      window.localStorage.setItem(LIKED_KEY, next ? "1" : "0");
    } catch {
      /* storage unavailable */
    }
    try {
      const { likes } = await toggleLaunchLike({ data: { liked: next } });
      setExtraLikes(likes);
    } catch {
      /* the optimistic count stays; the server value returns on reload */
    }
  };

  return (
    <Section className="py-16 sm:py-20">
      <article className="panel p-5 sm:p-7">
        <header className="flex flex-wrap items-center gap-3">
          <DiamondMark className="h-4 w-4 text-gold" />
          <span className="font-display text-sm tracking-[0.22em] text-foreground uppercase">
            Veriscope Launch
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-2.5 py-1 text-[0.625rem] tracking-[0.18em] text-gold uppercase">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
            Live
          </span>
        </header>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Feedback da comunidade Veriscope — experiências, opiniões e discussões sobre os produtos
          Veriscope.
        </p>

        <div className="mt-5 flex items-center gap-6 border-t border-border/60 pt-4">
          <button
            type="button"
            onClick={onToggleLike}
            aria-pressed={liked}
            aria-label="Gostar deste post"
            className={`inline-flex items-center gap-2 text-sm transition-colors ${
              liked ? "text-gold" : "text-muted-foreground hover:text-gold"
            }`}
          >
            <span aria-hidden="true">{liked ? "❤️" : "🤍"}</span>
            {compactCount(stats.likes + extraLikes)}
          </button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Ver comentários"
            className={`inline-flex items-center gap-2 text-sm transition-colors ${
              open ? "text-gold" : "text-muted-foreground hover:text-gold"
            }`}
          >
            <span aria-hidden="true">💬</span>
            {compactCount(stats.comments)}
          </button>
        </div>

        {open && (
          <div className="mt-5 border-t border-border/60 pt-5">
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/5 text-xs text-gold">
                    {item.avatar || item.name.slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3">
                      <span className="text-sm font-medium text-foreground">{item.name}</span>
                      <span className="text-xs text-muted-foreground">{item.age}</span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {item.content}
                    </p>
                    <p className="mt-2 text-xs text-gold">♥ {compactCount(item.likes)}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <Link
                to="/community"
                className="inline-flex rounded-md border border-border px-5 py-2.5 text-xs tracking-[0.16em] text-foreground uppercase transition-colors hover:border-gold/40 hover:text-gold"
              >
                Ver toda a comunidade
              </Link>
            </div>
          </div>
        )}
      </article>
    </Section>
  );
}
