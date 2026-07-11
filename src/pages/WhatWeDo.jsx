import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function WhatWeDo() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("services").select("*").order("sort_order").then(({ data }) => {
      setServices(data ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="px-6 pb-28 pt-36 md:px-12">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-steel">
          What We Do
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink md:text-5xl">
          Every service a build needs, in-house.
        </h1>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {loading && <p className="font-mono text-sm text-ink/50">Loading…</p>}
          {!loading && services.length === 0 && (
            <p className="font-mono text-sm text-ink/50">Services coming soon.</p>
          )}
          {services.map((s) => (
            <div key={s.id} className="border border-ink/10 p-6">
              {s.icon && <p className="text-3xl">{s.icon}</p>}
              <h3 className="mt-4 font-display text-xl font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-ink/70">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
