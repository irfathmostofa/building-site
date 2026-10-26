import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import RichContent from "../components/RichContent";
import { serviceSlug } from "../lib/content";

const SERVICE_DEMO_IMAGE = "/service-demo.svg";

export default function ServiceDetail() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    supabase
      .from("services")
      .select("*")
      .order("sort_order")
      .then(({ data, error }) => {
        const match = (data ?? []).find(
          (s) => serviceSlug(s) === slug || String(s.id) === slug,
        );
        if (error || !match) setNotFound(true);
        else setService(match);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="font-mono text-sm text-ink/50">Loading…</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-mono text-sm text-ink/50">We couldn't find that service.</p>
        <Link to="/what-we-do" className="font-mono text-xs uppercase tracking-widest text-steel">
          ← Back to services
        </Link>
      </div>
    );
  }

  return (
    <article className="px-6 pb-28 pt-36 md:px-12">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/what-we-do"
          className="font-mono text-xs uppercase tracking-widest text-steel hover:text-ink"
        >
          ← What we do
        </Link>
        <p className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-steel">
          Service
        </p>
        {service.icon && <p className="mt-3 text-4xl">{service.icon}</p>}
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink md:text-5xl">
          {service.title}
        </h1>

        <div className="mt-10 aspect-[16/9] overflow-hidden bg-concrete">
          <img
            src={service.image_url || SERVICE_DEMO_IMAGE}
            alt={service.title}
            className="h-full w-full object-cover"
          />
        </div>

        {service.description && (
          <RichContent
            html={service.description}
            className="mt-10 font-body text-lg leading-relaxed text-ink/80"
          />
        )}

        <Link
          to="/contact"
          className="mt-12 inline-block bg-ink px-8 py-3 font-mono text-xs uppercase tracking-widest text-paper hover:bg-steel"
        >
          Enquire about this
        </Link>
      </div>
    </article>
  );
}
