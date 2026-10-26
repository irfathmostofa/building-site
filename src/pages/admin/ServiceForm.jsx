import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import RichTextEditor from "../../components/Richtexteditor";

const empty = { title: "", description: "", icon: "", image_url: "" };

export default function ServiceForm() {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();

  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState("idle");
  const [loading, setLoading] = useState(!isNew);
  const [sortOrder, setSortOrder] = useState(0);

  useEffect(() => {
    if (isNew) {
      supabase
        .from("services")
        .select("sort_order")
        .order("sort_order", { ascending: false })
        .limit(1)
        .then(({ data }) => setSortOrder((data?.[0]?.sort_order ?? -1) + 1));
      return;
    }
    supabase
      .from("services")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (data) {
          setForm({
            title: data.title ?? "",
            description: data.description ?? "",
            icon: data.icon ?? "",
            image_url: data.image_url ?? "",
          });
          setSortOrder(data.sort_order ?? 0);
        }
        setLoading(false);
      });
  }, [id, isNew]);

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setStatus("saving");

    const payload = { ...form, sort_order: sortOrder };
    const { error } = isNew
      ? await supabase.from("services").insert([payload])
      : await supabase.from("services").update(payload).eq("id", id);

    if (error) {
      setStatus("error");
      return;
    }
    navigate("/admin/services");
  }

  if (loading) return <p className="font-mono text-sm text-ink/50">Loading…</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-semibold text-ink">
        {isNew ? "Add service" : "Edit service"}
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-[6rem_1fr]">
          <Field label="Icon">
            <input
              value={form.icon}
              onChange={(e) => updateField("icon", e.target.value)}
              placeholder="Emoji"
              className="input"
            />
          </Field>
          <Field label="Title">
            <input
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              required
              className="input"
            />
          </Field>
        </div>

        <Field label="Cover image URL">
          <input
            value={form.image_url}
            onChange={(e) => updateField("image_url", e.target.value)}
            placeholder="https://…"
            className="input"
          />
        </Field>
        {form.image_url && (
          <img src={form.image_url} alt="" className="h-32 w-48 object-cover" />
        )}

        <Field label="Content">
          <RichTextEditor
            key={isNew ? "new" : id}
            initialValue={form.description}
            onChange={(html) => updateField("description", html)}
            placeholder="Describe this service. You can add headings, lists, and images."
          />
        </Field>

        <button
          type="submit"
          disabled={status === "saving"}
          className="bg-ink px-8 py-3 font-mono text-xs uppercase tracking-widest text-paper hover:bg-steel disabled:opacity-50"
        >
          {status === "saving" ? "Saving…" : "Save service"}
        </button>
        {status === "error" && (
          <p className="font-mono text-xs text-red-600">Failed to save.</p>
        )}
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="font-mono text-xs uppercase tracking-widest text-ink/60">
        {label}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
