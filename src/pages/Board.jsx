import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Board() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("board_members").select("*").order("sort_order").then(({ data }) => {
      setMembers(data ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="px-6 pb-28 pt-36 md:px-12">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-steel">
          Leadership
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink md:text-5xl">
          Board of Directors
        </h1>

        <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {loading && <p className="font-mono text-sm text-ink/50">Loading…</p>}
          {!loading && members.length === 0 && (
            <p className="font-mono text-sm text-ink/50">Board information coming soon.</p>
          )}
          {members.map((m) => (
            <div key={m.id}>
              {m.photo_url && (
                <img
                  src={m.photo_url}
                  alt={m.name}
                  className="aspect-[4/5] w-full object-cover grayscale"
                />
              )}
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">{m.name}</h3>
              <p className="font-mono text-xs uppercase tracking-widest text-steel">{m.role}</p>
              {m.bio && (
                <p className="mt-2 font-body text-sm leading-relaxed text-ink/70">{m.bio}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
