import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabaseClient";

export default function WhatWeDo() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("services")
      .select("*")
      .order("sort_order")
      .then(({ data }) => {
        setServices(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="px-6 pb-28 pt-36 md:px-12">
      <div className="mx-auto max-w-8xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-steel">
          What We Do
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink md:text-5xl">
          Every service a build needs, in-house.
        </h1>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {loading && <p className="font-mono text-sm text-ink/50">Loading…</p>}
          {!loading && services.length === 0 && (
            <p className="font-mono text-sm text-ink/50">
              Services coming soon.
            </p>
          )}
          {services.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="group overflow-hidden border border-ink/10"
            >
              {s.image_url && (
                <div className="aspect-[16/10] overflow-hidden bg-concrete">
                  <img
                    src={s.image_url}
                    alt={s.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6">
                {s.icon && <p className="text-3xl">{s.icon}</p>}
                <h3 className="mt-3 font-display text-xl font-semibold text-ink">
                  {s.title}
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-ink/70">
                  {s.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
