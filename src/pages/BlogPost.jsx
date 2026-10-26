import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import RichContent from "../components/RichContent";

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single()
      .then(({ data, error }) => {
        if (error || !data) setNotFound(true);
        else setPost(data);
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
        <p className="font-mono text-sm text-ink/50">We couldn't find that post.</p>
        <Link to="/blog" className="font-mono text-xs uppercase tracking-widest text-steel">
          ← Back to journal
        </Link>
      </div>
    );
  }

  return (
    <article className="px-6 pb-28 pt-36 md:px-12">
      <div className="mx-auto max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-steel">
          {post.published_at
            ? new Date(post.published_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : ""}
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink md:text-5xl">
          {post.title}
        </h1>

        {post.cover_image && (
          <img
            src={post.cover_image}
            alt=""
            className="mt-10 aspect-[16/9] w-full object-cover"
          />
        )}

        <RichContent
          html={post.content}
          className="mt-10 font-body text-lg leading-relaxed text-ink/80"
        />
      </div>
    </article>
  );
}
