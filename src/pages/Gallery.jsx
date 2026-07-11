import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("gallery_images")
      .select("*")
      .order("sort_order")
      .then(({ data }) => {
        setImages(data ?? []);
        setLoading(false);
      });
  }, []);

  const categories = [...new Set(images.map((i) => i.category).filter(Boolean))];
  const visible = category ? images.filter((i) => i.category === category) : images;

  return (
    <div className="px-6 pb-28 pt-36 md:px-12">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-steel">Gallery</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink md:text-5xl">
          Sites, in detail
        </h1>

        {categories.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3 font-mono text-xs uppercase tracking-widest">
            <FilterPill active={!category} onClick={() => setCategory(null)} label="All" />
            {categories.map((c) => (
              <FilterPill key={c} active={category === c} onClick={() => setCategory(c)} label={c} />
            ))}
          </div>
        )}

        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {loading && <p className="font-mono text-sm text-ink/50">Loading…</p>}
          {!loading && visible.length === 0 && (
            <p className="font-mono text-sm text-ink/50">No images yet.</p>
          )}
          {visible.map((img) => (
            <div key={img.id} className="mb-4 break-inside-avoid">
              <img src={img.url} alt={img.caption ?? ""} className="w-full object-cover" />
              {img.caption && (
                <p className="mt-1 font-mono text-xs text-ink/50">{img.caption}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterPill({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`border px-4 py-2 transition-colors ${
        active ? "border-ink bg-ink text-paper" : "border-ink/20 text-ink/60 hover:border-ink/60 hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}
