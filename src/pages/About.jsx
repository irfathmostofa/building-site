export default function About() {
  return (
    <div className="px-6 pb-28 pt-36 md:px-12">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-steel">
          About
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink md:text-5xl">
          Built on precision, not shortcuts.
        </h1>
        <p className="mt-8 font-body text-lg leading-relaxed text-ink/80">
          Meridian Builders has spent two decades turning blueprints into
          places people live, work, and gather. Every project on this site
          started the same way every project starts: a set of lines on
          paper, a site visit, and a client who wanted something specific
          done right.
        </p>
        <p className="mt-6 font-body text-lg leading-relaxed text-ink/80">
          We work across residential, commercial, and cottage-scale builds,
          managing everything from permitting to the final walkthrough.
        </p>

        <div className="mt-16 grid grid-cols-2 gap-8 border-t border-ink/10 pt-10 font-mono text-sm uppercase tracking-widest md:grid-cols-4">
          <Stat value="20+" label="Years" />
          <Stat value="140" label="Projects" />
          <Stat value="35" label="Team" />
          <Stat value="12" label="Cities" />
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <p className="font-display text-3xl font-semibold text-ink">{value}</p>
      <p className="mt-1 text-ink/50">{label}</p>
    </div>
  );
}
