import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

const roleLabel = { chef: "Chef de projet", membre: "Membre", encadrant: "Encadrant" };

export default function Projects() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ titre: "", description: "", dateDebut: "", dateFin: "" });
  const [error, setError] = useState("");

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => (await api.get("/projects")).data.projects,
  });

  const createMutation = useMutation({
    mutationFn: (payload) => api.post("/projects", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setForm({ titre: "", description: "", dateDebut: "", dateFin: "" });
      setError("");
    },
    onError: (err) => setError(err.response?.data?.message || "Erreur"),
  });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    // on n'envoie pas les dates vides (Joi les refuserait)
    const payload = Object.fromEntries(Object.entries(form).filter(([, v]) => v !== ""));
    createMutation.mutate(payload);
  };

  const input = "w-full border rounded px-3 py-2 focus:outline-indigo-500";

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <section className="md:col-span-2">
        <h1 className="text-2xl font-bold text-indigo-900 mb-4">Mes projets</h1>

        {isLoading && <p>Chargement...</p>}
        {!isLoading && projects.length === 0 && (
          <p className="text-slate-600">Aucun projet pour le moment. Créez le premier.</p>
        )}

        <div className="space-y-3">
          {projects.map((p) => (
            <Link key={p._id} to={`/projects/${p._id}`} className="block bg-white p-4 rounded-lg shadow hover:shadow-md">
              <div className="flex justify-between items-start">
                <h2 className="font-semibold text-lg text-indigo-900">{p.titre}</h2>
                <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                  {roleLabel[p.monRole]}
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-1">{p.description || "Pas de description"}</p>
              <p className="text-xs text-slate-500 mt-2">
                {p.dateDebut && new Date(p.dateDebut).toLocaleDateString("fr-FR")}
                {p.dateFin && ` → ${new Date(p.dateFin).toLocaleDateString("fr-FR")}`}
                {p.statut === "archive" && " · Archivé"}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <aside>
        <form onSubmit={onSubmit} className="bg-white p-4 rounded-lg shadow space-y-3">
          <h2 className="font-semibold text-indigo-900">Nouveau projet</h2>
          {error && <p className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm">{error}</p>}
          <input className={input} name="titre" placeholder="Titre (3 caractères min.)" value={form.titre} onChange={onChange} required />
          <textarea className={input} name="description" placeholder="Description" rows={3} value={form.description} onChange={onChange} />
          <label className="block text-xs text-slate-600">Date de début
            <input className={input} type="date" name="dateDebut" value={form.dateDebut} onChange={onChange} />
          </label>
          <label className="block text-xs text-slate-600">Date de fin
            <input className={input} type="date" name="dateFin" value={form.dateFin} onChange={onChange} />
          </label>
          <button disabled={createMutation.isPending} className="w-full bg-indigo-900 text-white py-2 rounded font-medium hover:bg-indigo-800 disabled:opacity-50">
            {createMutation.isPending ? "Création..." : "Créer le projet"}
          </button>
        </form>
      </aside>
    </div>
  );
}