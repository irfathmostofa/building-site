import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import BlueprintReveal from "../components/BlueprintReveal";
import BuildingCard from "../components/BuildingCard";
import { useBuildings } from "../hooks/useBuildings";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const { buildings: featured, loading } = useBuildings({ featuredOnly: true });
  const [settings, setSettings] = useState(null);
  const [heroBuilding, setHeroBuilding] = useState(null);
  const [galleryPreview, setGalleryPreview] = useState([]);
  const [productsPreview, setProductsPreview] = useState([]);

  useEffect(() => {
    supabase.from("site_settings").select("*").eq("id", 1).single()
      .then(({ data }) => setSettings(data));
    supabase.from("gallery_images").select("*").order("sort_order").limit(6)
      .then(({ data }) => setGalleryPreview(data ?? []));
    supabase.from("products").select("*, product_categories(name)").eq("featured", true).limit(3)
      .then(({ data }) => setProductsPreview(data ?? []));
  }, []);

  useEffect(() => {
    async function resolveHero() {
      if (settings?.hero_building_id) {
        const { data } = await supabase
          .from("buildings")
          .select("*")
          .eq("id", settings.hero_building_id)
          .single();
        if (data) {
          setHeroBuilding(data);
          return;
        }
      }
      setHeroBuilding(featured[0] ?? null);
    }
    if (settings !== null) resolveHero();
  }, [settings, featured]);

  return (
    <div>
      {heroBuilding ? (
        <BlueprintReveal
          heroImage={heroBuilding.hero_image}
          blueprintImage={heroBuilding.blueprint_image}
          name={settings?.hero_headline || heroBuilding.name}
          eyebrow={settings?.hero_eyebrow}
          location={heroBuilding.location}
          yearBuilt={heroBuilding.year_built}
          areaSqft={heroBuilding.area_sqft}
        />
      ) : (
        <div className="flex h-screen items-center justify-center bg-ink px-6 text-center">
          <p className="font-mono text-sm text-concrete">
            {loading ? "Loading…" : "Mark a building as featured (or set a hero building in /admin/hero) to power the hero."}
          </p>
        </div>
      )}

      {/* Intro statement */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center md:px-12 md:py-28">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-steel">
          Est. from ground up
        </p>
        <h2 className="mt-6 font-display text-2xl font-medium leading-snug text-ink sm:text-3xl md:text-4xl">
          {settings?.intro_heading ||
            "Every building starts as a line on paper. We're proud of every stage between that first line and the last coat of paint."}
        </h2>
      </section>

      {/* About us, with image */}
      <section className="px-6 pb-20 md:px-12 md:pb-28">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-2 md:items-center md:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="order-2 md:order-1"
          >
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-steel">
              {settings?.about_heading || "About us"}
            </p>
            <p className="mt-5 font-body text-lg leading-relaxed text-ink/80">
              {settings?.about_body ||
                "Meridian Builders has spent two decades turning blueprints into places people live, work, and gather."}
            </p>
            <Link
              to="/about"
              className="mt-6 inline-block font-mono text-xs uppercase tracking-widest text-steel hover:text-ink"
            >
              More about us →
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="order-1 aspect-[4/3] bg-concrete md:order-2"
          >
            {settings?.about_image && (
              <img src={settings.about_image} alt="" className="h-full w-full object-cover" />
            )}
          </motion.div>
        </div>
      </section>

      {/* Featured buildings grid */}
      <section className="px-6 pb-20 md:px-12 md:pb-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex items-end justify-between">
            <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">
              {settings?.featured_section_heading || "Featured work"}
            </h3>
            <Link
              to="/buildings"
              className="font-mono text-xs uppercase tracking-widest text-steel hover:text-ink"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((b) => (
              <BuildingCard key={b.id} building={b} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      {settings?.stats?.length > 0 && (
        <section className="border-y border-ink/10 px-6 py-14 md:px-12 md:py-16">
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 text-center sm:grid-cols-4 sm:gap-8">
            {settings.stats.map((stat, i) => (
              <div key={i}>
                <p className="font-display text-2xl font-semibold text-ink sm:text-3xl md:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-ink/50 sm:text-xs">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Gallery preview */}
      {galleryPreview.length > 0 && (
        <section className="px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex items-end justify-between">
              <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">
                {settings?.gallery_section_heading || "Gallery"}
              </h3>
              <Link
                to="/gallery"
                className="font-mono text-xs uppercase tracking-widest text-steel hover:text-ink"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {galleryPreview.map((img) => (
                <div key={img.id} className="aspect-square overflow-hidden bg-concrete">
                  <img src={img.url} alt={img.caption ?? ""} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products preview */}
      {productsPreview.length > 0 && (
        <section className="bg-concrete/40 px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex items-end justify-between">
              <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">
                {settings?.products_section_heading || "Products"}
              </h3>
              <Link
                to="/products"
                className="font-mono text-xs uppercase tracking-widest text-steel hover:text-ink"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {productsPreview.map((p) => (
                <Link key={p.id} to={`/products/${p.slug}`} className="group block">
                  <div className="aspect-square overflow-hidden bg-paper">
                    {p.image && (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <h4 className="mt-3 font-display text-lg font-semibold text-ink">{p.name}</h4>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Clients */}
      {settings?.clients?.length > 0 && (
        <section className="border-t border-ink/10 px-6 py-16 md:px-12">
          <p className="mx-auto max-w-6xl text-center font-mono text-xs uppercase tracking-widest text-ink/40">
            Trusted by
          </p>
          <div className="mx-auto mt-8 flex max-w-6xl flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {settings.clients.map((client, i) => (
              <img
                key={i}
                src={client.logo_url}
                alt={client.name}
                title={client.name}
                className="h-8 w-auto grayscale opacity-60 transition-opacity hover:opacity-100 sm:h-10"
              />
            ))}
          </div>
        </section>
      )}

      {/* Brochure download */}
      {settings?.brochure_url && (
        <section className="px-6 py-16 text-center md:px-12">
          <a
            href={settings.brochure_url}
            target="_blank"
            rel="noreferrer"
            download
            className="inline-flex items-center gap-3 border border-ink px-8 py-3 font-mono text-xs uppercase tracking-widest text-ink hover:bg-ink hover:text-paper"
          >
            ↓ {settings.brochure_label || "Download brochure"}
          </a>
        </section>
      )}

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-ink px-6 py-20 text-center md:px-12 md:py-28"
      >
        <h3 className="font-display text-2xl font-semibold text-paper sm:text-3xl md:text-4xl">
          {settings?.cta_heading || "Have a site in mind?"}
        </h3>
        <Link
          to="/contact"
          className="mt-8 inline-block bg-amber px-8 py-3 font-mono text-xs uppercase tracking-widest text-ink transition-colors hover:bg-paper"
        >
          {settings?.cta_button_text || "Start a conversation"}
        </Link>
      </motion.section>
    </div>
  );
}
