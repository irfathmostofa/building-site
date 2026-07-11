import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function BuildingCard({ building }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
    >
      <Link to={`/buildings/${building.slug}`} className="group block">
        <div className="relative aspect-[4/5] overflow-hidden bg-ink">
          <img
            src={building.hero_image}
            alt={building.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/0 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="font-mono text-[11px] uppercase tracking-widest text-amber">
              {building.building_types?.name ?? building.status}
            </p>
            <h3 className="mt-1 font-display text-xl font-semibold text-paper">
              {building.name}
            </h3>
            <p className="mt-1 font-mono text-xs text-concrete/80">
              {building.location}
              {building.year_built ? ` — ${building.year_built}` : ""}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
