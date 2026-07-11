import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * The signature moment of the site: the building photo is visible from the
 * very first frame (desaturated + dimmed), and a blueprint line-drawing
 * overlay "burns off" as the user scrolls to reveal full color — so there's
 * always something to see even before any scrolling happens, and even if
 * no blueprint art has been uploaded yet.
 */
export default function BlueprintReveal({
  heroImage,
  blueprintImage,
  name,
  eyebrow = "Scroll to build",
  location,
  yearBuilt,
  areaSqft,
}) {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const grayscale = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const brightness = useTransform(scrollYProgress, [0, 0.5], [0.55, 1]);
  const photoFilter = useTransform([grayscale, brightness], ([g, b]) => `grayscale(${g}) brightness(${b})`);
  const photoScale = useTransform(scrollYProgress, [0, 0.6], [1.08, 1]);

  const blueprintOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.3], [0.18, 0]);
  const specsOpacity = useTransform(scrollYProgress, [0.35, 0.55], [0, 1]);
  const specsY = useTransform(scrollYProgress, [0.35, 0.55], [16, 0]);
  const headlineOpacity = useTransform(scrollYProgress, [0.55, 0.8], [1, 0]);

  return (
    <section ref={containerRef} className="relative h-[220vh] bg-ink">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Photograph layer — always visible from the first frame */}
        {heroImage && (
          <motion.img
            src={heroImage}
            alt={name}
            style={{ filter: photoFilter, scale: photoScale }}
            className="absolute inset-0 z-10 h-full w-full object-cover"
          />
        )}

        {/* Blueprint grid texture, subtle, fades out on scroll */}
        <motion.div style={{ opacity: gridOpacity }} className="absolute inset-0 z-10">
          <svg className="h-full w-full" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" className="blueprint-line" strokeOpacity="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </motion.div>

        {/* Blueprint line-drawing overlay — only rendered if art is provided */}
        {blueprintImage && (
          <motion.img
            src={blueprintImage}
            alt=""
            style={{ opacity: blueprintOpacity }}
            className="absolute inset-0 z-10 h-full w-full object-cover mix-blend-screen"
          />
        )}

        {/* Dark gradient for legibility */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-ink via-ink/10 to-transparent" />

        {/* Headline — visible immediately */}
        <motion.div
          style={{ opacity: headlineOpacity }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center"
        >
          <span className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-concrete">
            {eyebrow}
          </span>
          <h1 className="max-w-3xl font-display text-4xl font-semibold leading-tight text-paper sm:text-5xl md:text-7xl">
            {name}
          </h1>
        </motion.div>

        {/* Spec-sheet annotations, blueprint-callout style */}
        <motion.div
          style={{ opacity: specsOpacity, y: specsY }}
          className="absolute bottom-8 left-0 right-0 z-30 flex flex-wrap justify-center gap-x-6 gap-y-2 px-6 font-mono text-[11px] uppercase tracking-widest text-concrete sm:gap-x-10 sm:text-xs md:justify-between md:px-16"
        >
          <Spec label="Location" value={location} />
          <Spec label="Year" value={yearBuilt} />
          <Spec label="Area" value={areaSqft ? `${areaSqft.toLocaleString()} sqft` : null} />
        </motion.div>
      </div>
    </section>
  );
}

function Spec({ label, value }) {
  if (!value) return null;
  return (
    <span className="border-l border-steel pl-3">
      <span className="text-steel">{label} — </span>
      {value}
    </span>
  );
}
