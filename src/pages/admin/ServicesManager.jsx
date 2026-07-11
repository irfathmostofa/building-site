import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

const empty = { title: "", description: "", icon: "" };

export default function ServicesManager() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(empty);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("services").select("*").order("sort_order");
    setServices(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    await supabase.from("services").insert([{ ...form, sort_order: services.length }]);
    setForm(empty);
    load();
  }

  function startEdit(s) {
    setEditingId(s.id);
    setEditForm({ title: s.title, description: s.description ?? "", icon: s.icon ?? "" });
  }

  async function saveEdit(id) {
    await supabase.from("services").update(editForm).eq("id", id);
    setEditingId(null);
    load();
  }

  async function handleDelete(id, title) {
    if (!confirm(`Delete "${title}"?`)) return;
    await supabase.from("services").delete().eq("id", id);
    load();
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl font-semibold text-ink">Services (What We Do)</h1>

      <form onSubmit={handleAdd} className="mt-8 space-y-3">
        <div className="flex gap-3">
          <input value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} placeholder="Icon (emoji, optional)" className="input w-24" />
          <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Service title" className="input" />
        </div>
        <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Description" rows={2} className="input" />
        <button type="submit" className="bg-ink px-6 py-2.5 font-mono text-xs uppercase tracking-widest text-paper hover:bg-steel">
          + Add service
        </button>
      </form>

      <div className="mt-10 divide-y divide-ink/10 border-t border-ink/10">
        {loading && <p className="py-6 font-mono text-sm text-ink/50">Loading…</p>}
        {services.map((s) => (
          <div key={s.id} className="py-4">
            {editingId === s.id ? (
              <div className="space-y-3">
                <div className="flex gap-3">
                  <input value={editForm.icon} onChange={(e) => setEditForm((f) => ({ ...f, icon: e.target.value }))} className="input w-24" />
                  <input value={editForm.title} onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))} className="input" />
                </div>
                <textarea value={editForm.description} onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))} rows={2} className="input" />
                <div className="flex gap-4 font-mono text-xs uppercase tracking-widest">
                  <button onClick={() => saveEdit(s.id)} className="text-steel hover:text-ink">Save</button>
                  <button onClick={() => setEditingId(null)} className="text-ink/50 hover:text-ink">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body font-medium text-ink">{s.icon} {s.title}</p>
                  <p className="font-mono text-xs text-ink/50">{s.description}</p>
                </div>
                <div className="flex gap-4 font-mono text-xs uppercase tracking-widest">
                  <button onClick={() => startEdit(s)} className="text-steel hover:text-ink">Edit</button>
                  <button onClick={() => handleDelete(s.id, s.title)} className="text-red-500 hover:text-red-700">Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
