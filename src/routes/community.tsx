import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";

import { Header } from "@/components/veriscope/Header";
import { Section } from "@/components/veriscope/Section";
import { supabase } from "@/lib/supabase";
import { likeComment, postComment } from "@/lib/community.functions";
import { compactCount, timeAgo } from "@/lib/format";

const title = "Comunidade Veriscope — impressões dos traders";
const description =
  "O que a comunidade está a dizer sobre o Veriscope Prime e o resto do ecossistema: impressões, dúvidas e primeiras utilizações.";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CommunityPage,
});

type ProductKey =
  | "prime"
  | "intelligence"
  | "edge"
  | "trade_pilot"
  | "alert_engine"
  | "session_matrix"
  | "ai_prompt_pack"
  | "ecosystem";

const PRODUCT_LABELS: Record<ProductKey, string> = {
  prime: "Prime",
  intelligence: "Intelligence",
  edge: "Edge",
  trade_pilot: "Trade Pilot",
  alert_engine: "Alert Engine",
  session_matrix: "Session Matrix",
  ai_prompt_pack: "AI Prompt Pack",
  ecosystem: "Ecossistema",
};

const FILTERS: ("all" | ProductKey)[] = [
  "all",
  "prime",
  "intelligence",
  "edge",
  "trade_pilot",
  "alert_engine",
  "session_matrix",
  "ai_prompt_pack",
  "ecosystem",
];

type Comment = {
  id: string;
  name: string;
  content: string;
  avatar: string;
  product: ProductKey;
  likes: number;
  created_at: string;
};

const PAGE_SIZE = 24;
const LIKED_KEY = "veriscope.community.liked";

function readLiked(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(LIKED_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

function CommunityPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [stats, setStats] = useState({ likes: 1200000, comments: 758000 });
  const [filter, setFilter] = useState<"all" | ProductKey>("all");
  const [sort, setSort] = useState<"recent" | "top">("recent");
  const [search, setSearch] = useState("");
  const [term, setTerm] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const [liked, setLiked] = useState<string[]>([]);
  const sentinel = useRef<HTMLDivElement | null>(null);
  const inFlight = useRef(false);

  useEffect(() => {
    setLiked(readLiked());
  }, []);

  // Debounce the search box so typing doesn't fire a query per keystroke.
  useEffect(() => {
    const id = window.setTimeout(() => setTerm(search.trim()), 350);
    return () => window.clearTimeout(id);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("community_stats")
      .select("likes, comments")
      .eq("id", "global")
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled && data) setStats({ likes: data.likes, comments: data.comments });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const load = useCallback(
    async (nextPage: number, replace: boolean) => {
      if (inFlight.current) return;
      inFlight.current = true;
      setLoading(true);
      let query = supabase
        .from("comments")
        .select("id, name, content, avatar, product, likes, created_at")
        .eq("status", "approved")
        .range(nextPage * PAGE_SIZE, nextPage * PAGE_SIZE + PAGE_SIZE - 1);

      query =
        sort === "top"
          ? query
              .order("likes", { ascending: false })
              .order("created_at", { ascending: false })
              .order("id", { ascending: false })
          : query.order("created_at", { ascending: false }).order("id", { ascending: false });

      if (filter !== "all") query = query.eq("product", filter);
      if (term) query = query.ilike("content", `%${term.replace(/[%_]/g, "")}%`);

      const { data } = await query;
      const rows = (data ?? []) as Comment[];

      setComments((prev) => {
        if (replace) return rows;
        const seen = new Set(prev.map((c) => c.id));
        return [...prev, ...rows.filter((row) => !seen.has(row.id))];
      });
      setDone(rows.length < PAGE_SIZE);
      setLoading(false);
      inFlight.current = false;
    },
    [filter, sort, term],
  );

  useEffect(() => {
    setPage(0);
    void load(0, true);
  }, [load]);

  const loadMore = useCallback(() => {
    if (inFlight.current) return;
    setPage((current) => {
      const next = current + 1;
      void load(next, false);
      return next;
    });
  }, [load]);

  // Infinite scroll: fetch the next small batch as the sentinel comes into view.
  useEffect(() => {
    const node = sentinel.current;
    if (!node || done || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "600px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [done, loading, loadMore]);


  const onLike = async (id: string) => {
    if (liked.includes(id)) return;
    const next = [...liked, id];
    setLiked(next);
    try {
      window.localStorage.setItem(LIKED_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c)));
    setStats((s) => ({ ...s, likes: s.likes + 1 }));
    try {
      await likeComment({ data: { id } });
    } catch {
      /* the optimistic count stays; the server value returns on reload */
    }
  };

  const onPublished = (comment: Comment) => {
    setStats((s) => ({ ...s, comments: s.comments + 1 }));
    if (filter === "all" || filter === comment.product) {
      setComments((prev) => [comment, ...prev]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header live />

      <main className="pb-24">
        <Section className="pt-10 pb-8 sm:pt-14">
          <p className="eyebrow">Comunidade</p>
          <h1 className="mt-3 font-display text-2xl tracking-tight text-balance uppercase sm:text-3xl">
            O que a comunidade está a dizer
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Impressões, dúvidas e primeiras utilizações partilhadas por quem está a acompanhar o
            lançamento do ecossistema Veriscope.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <Counter label="Likes" value={stats.likes} />
            <Counter label="Comentários" value={stats.comments} />
          </div>
        </Section>

        <Section className="pb-8">
          <Composer onPublished={onPublished} />
        </Section>

        <Section className="pb-6">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`rounded-full border px-3 py-1.5 text-[0.6875rem] tracking-[0.14em] uppercase transition-colors ${
                  filter === key
                    ? "border-gold/50 bg-gold/10 text-gold"
                    : "border-border text-muted-foreground hover:border-gold/30 hover:text-foreground"
                }`}
              >
                {key === "all" ? "Todos" : PRODUCT_LABELS[key]}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-4 text-xs">
              {(["recent", "top"] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSort(key)}
                  className={`tracking-[0.14em] uppercase transition-colors ${
                    sort === key ? "text-gold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {key === "recent" ? "Mais recentes" : "Mais gostados"}
                </button>
              ))}
            </div>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar comentários"
              aria-label="Pesquisar comentários"
              className="w-full rounded-md border border-border bg-card/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none sm:w-64"
            />
          </div>

        </Section>

        <Section>
          <ul className="space-y-4">
            {comments.map((comment) => (
              <li key={comment.id} className="panel p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/5 text-xs text-gold">
                    {comment.avatar || comment.name.slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-sm font-medium text-foreground">{comment.name}</span>
                      <span className="text-[0.6875rem] tracking-[0.14em] text-gold uppercase">
                        {PRODUCT_LABELS[comment.product]}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {timeAgo(comment.created_at)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {comment.content}
                    </p>
                    <button
                      type="button"
                      onClick={() => onLike(comment.id)}
                      disabled={liked.includes(comment.id)}
                      className={`mt-3 inline-flex items-center gap-2 text-xs transition-colors ${
                        liked.includes(comment.id)
                          ? "text-gold"
                          : "text-muted-foreground hover:text-gold"
                      }`}
                    >
                      <span aria-hidden="true">♥</span>
                      {compactCount(comment.likes)}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div ref={sentinel} aria-hidden="true" className="h-px" />

          {loading && <p className="mt-6 text-sm text-muted-foreground">A carregar…</p>}

          {!loading && !done && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={loadMore}
                className="rounded-md border border-border px-5 py-2.5 text-xs tracking-[0.16em] text-foreground uppercase transition-colors hover:border-gold/40 hover:text-gold"
              >
                Carregar mais comentários
              </button>
            </div>
          )}

          {!loading && comments.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Não encontrámos comentários para esta pesquisa.
            </p>
          )}

        </Section>
      </main>
    </div>
  );
}

function Counter({ label, value }: { label: string; value: number }) {
  return (
    <div className="panel px-5 py-4">
      <p className="text-[0.625rem] tracking-[0.2em] text-muted-foreground uppercase">{label}</p>
      <p className="mt-1 font-display text-2xl text-gold">{compactCount(value)}</p>
    </div>
  );
}

function Composer({ onPublished }: { onPublished: (comment: Comment) => void }) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [product, setProduct] = useState<ProductKey>("prime");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim().length < 2 || content.trim().length < 2) return;
    setStatus("sending");
    try {
      const comment = await postComment({
        data: { name: name.trim(), content: content.trim(), product },
      });
      onPublished(comment as Comment);
      setContent("");
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={submit} className="panel p-5 sm:p-6">
      <p className="text-[0.6875rem] tracking-[0.18em] text-gold uppercase">
        Participe na conversa
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="O seu nome"
          maxLength={48}
          className="rounded-md border border-border bg-card/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
        />
        <select
          value={product}
          onChange={(e) => setProduct(e.target.value as ProductKey)}
          className="rounded-md border border-border bg-card/50 px-3 py-2 text-sm text-foreground focus:border-gold/40 focus:outline-none"
        >
          {(Object.keys(PRODUCT_LABELS) as ProductKey[]).map((key) => (
            <option key={key} value={key}>
              {PRODUCT_LABELS[key]}
            </option>
          ))}
        </select>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Escreva o seu comentário"
        rows={3}
        maxLength={800}
        className="mt-3 w-full rounded-md border border-border bg-card/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
      />
      <div className="mt-4 flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-md border border-gold/40 bg-gold/10 px-5 py-2.5 text-xs tracking-[0.16em] text-gold uppercase transition-colors hover:bg-gold/20 disabled:opacity-60"
        >
          {status === "sending" ? "A publicar…" : "Publicar comentário"}
        </button>
        {status === "error" && (
          <span className="text-xs text-muted-foreground">
            Não foi possível publicar. Tente novamente.
          </span>
        )}
      </div>
    </form>
  );
}
