import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import BlueprintReveal from "../components/BlueprintReveal";
import BuildingCard from "../components/BuildingCard";
import { useBuildings } from "../hooks/useBuildings";
import { supabase } from "../lib/supabaseClient";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export default function Home() {
  const { buildings: featured, loading } = useBuildings({ featuredOnly: true });
  const [settings, setSettings] = useState(null);
  const [heroBuilding, setHeroBuilding] = useState(null);
  const [galleryPreview, setGalleryPreview] = useState([]);
  const [productsPreview, setProductsPreview] = useState([]);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .single()
      .then(({ data }) => setSettings(data));
    supabase
      .from("gallery_images")
      .select("*")
      .order("sort_order")
      .limit(6)
      .then(({ data }) => setGalleryPreview(data ?? []));
    supabase
      .from("products")
      .select("*, product_categories(name)")
      .eq("featured", true)
      .limit(3)
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
            {loading
              ? "Loading…"
              : "Mark a building as featured (or set a hero building in /admin/hero) to power the hero."}
          </p>
        </div>
      )}

      {/* Intro statement */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
        className="mx-auto max-w-4xl px-6 py-20 text-center md:px-12 md:py-28"
      >
        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="font-mono text-xs uppercase tracking-[0.3em] text-steel"
        >
          Est. from ground up
        </motion.p>
        <motion.h2
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="mt-6 font-display text-2xl font-medium leading-snug text-ink sm:text-3xl md:text-4xl"
        >
          {settings?.intro_heading ||
            "Every building starts as a line on paper. We're proud of every stage between that first line and the last coat of paint."}
        </motion.h2>
      </motion.section>

      {/* About us, with image */}
      <section className="px-6 pb-20 md:px-12 md:pb-28">
        <div className="mx-auto grid max-w-8xl grid-cols-1 gap-10 md:grid-cols-2 md:items-center md:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
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
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="order-1 aspect-[4/3] overflow-hidden bg-concrete md:order-2"
          >
            {settings?.about_image && (
              <motion.img
                src={settings.about_image}
                alt=""
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-full w-full object-cover"
              />
            )}
          </motion.div>
        </div>
      </section>

      {/* Featured buildings grid */}
      <section className="px-6 pb-20 md:px-12 md:pb-28">
        <div className="mx-auto max-w-8xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10 flex items-end justify-between"
          >
            <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">
              {settings?.featured_section_heading || "Featured work"}
            </h3>
            <Link
              to="/buildings"
              className="font-mono text-xs uppercase tracking-widest text-steel hover:text-ink"
            >
              View all →
            </Link>
          </motion.div>
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
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="mx-auto max-w-4xl"
          >
            <p className="mb-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-steel">
              Project record
            </p>
            <div className="grid grid-cols-2 divide-y divide-ink/10 border border-ink/10 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
              {settings.stats.map((stat, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  transition={{ duration: 0.5 }}
                  className="px-4 py-6 text-center"
                >
                  <p className="font-mono text-2xl font-semibold text-ink sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-ink/50">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Gallery preview */}
      {galleryPreview.length > 0 && (
        <section className="px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-8xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-10 flex items-end justify-between"
            >
              <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">
                {settings?.gallery_section_heading || "Gallery"}
              </h3>
              <Link
                to="/gallery"
                className="font-mono text-xs uppercase tracking-widest text-steel hover:text-ink"
              >
                View all →
              </Link>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={stagger}
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
            >
              {galleryPreview.map((img, i) => (
                <motion.div
                  key={img.id}
                  variants={fadeUp}
                  transition={{ duration: 0.4 }}
                  className="group relative aspect-square overflow-hidden bg-concrete"
                >
                  <img
                    src={img.url}
                    alt={img.caption ?? ""}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="absolute bottom-2 left-2 font-mono text-[10px] tracking-widest text-paper opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    PL.{String(i + 1).padStart(2, "0")}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Products preview */}
      {productsPreview.length > 0 && (
        <section className="bg-concrete/40 px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-8xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-10 flex items-end justify-between"
            >
              <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">
                {settings?.products_section_heading || "Products"}
              </h3>
              <Link
                to="/products"
                className="font-mono text-xs uppercase tracking-widest text-steel hover:text-ink"
              >
                View all →
              </Link>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={stagger}
              className="grid grid-cols-1 gap-6 sm:grid-cols-3"
            >
              {productsPreview.map((p) => (
                <motion.div
                  key={p.id}
                  variants={fadeUp}
                  transition={{ duration: 0.5 }}
                >
                  <Link to={`/products/${p.slug}`} className="group block">
                    <div className="aspect-square overflow-hidden bg-paper">
                      {p.image && (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <h4 className="mt-3 font-display text-lg font-semibold text-ink">
                      {p.name}
                    </h4>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Clients */}
      {settings?.clients?.length > 0 && (
        <section className="border-t border-ink/10 px-6 py-16 md:px-12">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mx-auto max-w-8xl text-center font-mono text-xs uppercase tracking-widest text-ink/40"
          >
            Trusted by
          </motion.p>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            variants={stagger}
            className="mx-auto mt-8 flex max-w-8xl flex-wrap items-center justify-center gap-x-12 gap-y-6"
          >
            {settings.clients.map((client, i) => (
              <motion.img
                key={i}
                variants={fadeUp}
                transition={{ duration: 0.4 }}
                src={client.logo_url}
                alt={client.name}
                title={client.name}
                className="h-8 w-auto grayscale opacity-60 transition-opacity hover:opacity-100 sm:h-10"
              />
            ))}
          </motion.div>
        </section>
      )}

      {/* Brochure download */}
      {settings?.brochure_url && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="px-6 py-16 text-center md:px-12"
        >
          <a
            href={settings.brochure_url}
            target="_blank"
            rel="noreferrer"
            download
            className="inline-flex items-center gap-3 border border-ink px-8 py-3 font-mono text-xs uppercase tracking-widest text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            ↓ {settings.brochure_label || "Download brochure"}
          </a>
        </motion.section>
      )}

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-ink px-6 py-20 text-center md:px-12 md:py-28"
      >
        <h3 className="font-display text-2xl font-semibold text-paper sm:text-3xl md:text-4xl">
          {settings?.cta_heading || "Have a site in mind?"}
        </h3>
        <motion.div
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          className="mt-8 inline-block"
        >
          <Link
            to="/contact"
            className="inline-block bg-amber px-8 py-3 font-mono text-xs uppercase tracking-widest text-ink transition-colors hover:bg-paper"
          >
            {settings?.cta_button_text || "Start a conversation"}
          </Link>
        </motion.div>
      </motion.section>
    </div>
  );
}
