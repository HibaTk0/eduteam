import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

const roleLabel = { chef: "Chef de projet", membre: "Membre", encadrant: "Encadrant" };

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const me = useSelector((state) => state.auth.user);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null); // { type: "ok" | "err", text }

  const { data, isLoading, error } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => (await api.get(`/projects/${projectId}`)).data,
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["project", projectId] });
  const errText = (err) => err.response?.data?.message || "Erreur";

  const invite = useMutation({
    mutationFn: () => api.post(`/projects/${projectId}/members`, { email }),
    onSuccess: () => {
      setEmail("");
      setMessage({ type: "ok", text: "Membre ajouté" });
      refresh();
    },
    onError: (err) => setMessage({ type: "err", text: errText(err) }),
  });

  const changeRole = useMutation({
    mutationFn: ({ userId, role }) => api.put(`/projects/${projectId}/members/${userId}`, { role }),
    onSuccess: () => { setMessage(null); refresh(); },
    onError: (err) => setMessage({ type: "err", text: errText(err) }),
  });

  const removeMember = useMutation({
    mutationFn: (userId) => api.delete(`/projects/${projectId}/members/${userId}`),
    onSuccess: () => { setMessage(null); refresh(); },
    onError: (err) => setMessage({ type: "err", text: errText(err) }),
  });

  const archive = useMutation({
    mutationFn: (statut) => api.put(`/projects/${projectId}`, { statut }),
    onSuccess: () => { refresh(); queryClient.invalidateQueries({ queryKey: ["projects"] }); },
  });

  const deleteProject = useMutation({
    mutationFn: () => api.delete(`/projects/${projectId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      navigate("/projects");
    },
  });

  if (isLoading) return <p>Chargement...</p>;
  if (error)
    return (
      <div>
        <p className="text-red-700 mb-2">{errText(error)}</p>
        <Link to="/projects" className="text-indigo-700 underline">Retour aux projets</Link>
      </div>
    );

  const { project, monRole, members } = data;
  const isChef = monRole === "chef";

  return (
    <div className="space-y-6">
      <Link to="/projects" className="text-sm text-indigo-700 underline">← Mes projets</Link>

      <section className="bg-white p-5 rounded-lg shadow">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold text-indigo-900">{project.titre}</h1>
            <p className="text-slate-600 mt-1">{project.description || "Pas de description"}</p>
            <p className="text-xs text-slate-500 mt-2">
              {project.dateDebut && new Date(project.dateDebut).toLocaleDateString("fr-FR")}
              {project.dateFin && ` → ${new Date(project.dateFin).toLocaleDateString("fr-FR")}`}
              {" · "}Statut : {project.statut}
            </p>
          </div>
          <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded whitespace-nowrap">
            Votre rôle : {roleLabel[monRole]}
          </span>
        </div>

        {isChef && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => archive.mutate(project.statut === "actif" ? "archive" : "actif")}
              className="border px-3 py-1 rounded text-sm hover:bg-slate-100"
            >
              {project.statut === "actif" ? "Archiver" : "Réactiver"}
            </button>
            <button
              onClick={() => window.confirm("Supprimer définitivement ce projet ?") && deleteProject.mutate()}
              className="border border-red-300 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-50"
            >
              Supprimer
            </button>
          </div>
        )}
      </section>

      <section className="bg-white p-5 rounded-lg shadow">
        <h2 className="font-semibold text-indigo-900 mb-3">Membres ({members.length})</h2>

        {message && (
          <p className={`px-3 py-2 rounded text-sm mb-3 ${message.type === "ok" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message.text}
          </p>
        )}

        <ul className="divide-y">
          {members.map((m) => (
            <li key={m._id} className="py-2 flex items-center justify-between gap-2">
              <div>
                <p className="font-medium">
                  {m.user.nom} {m.user._id === me?.id && <span className="text-xs text-slate-500">(vous)</span>}
                </p>
                <p className="text-xs text-slate-500">{m.user.email}</p>
              </div>

              {isChef ? (
                <div className="flex items-center gap-2">
                  <select
                    value={m.role}
                    onChange={(e) => changeRole.mutate({ userId: m.user._id, role: e.target.value })}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="chef">Chef de projet</option>
                    <option value="membre">Membre</option>
                    <option value="encadrant">Encadrant</option>
                  </select>
                  <button
                    onClick={() => window.confirm(`Retirer ${m.user.nom} ?`) && removeMember.mutate(m.user._id)}
                    className="text-red-700 text-sm underline"
                  >
                    Retirer
                  </button>
                </div>
              ) : (
                <span className="text-sm bg-slate-100 px-2 py-1 rounded">{roleLabel[m.role]}</span>
              )}
            </li>
          ))}
        </ul>

        {isChef && (
          <form
            onSubmit={(e) => { e.preventDefault(); setMessage(null); invite.mutate(); }}
            className="flex gap-2 mt-4"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email de l'étudiant à inviter"
              required
              className="flex-1 border rounded px-3 py-2"
            />
            <button disabled={invite.isPending} className="bg-indigo-900 text-white px-4 rounded hover:bg-indigo-800 disabled:opacity-50">
              Inviter
            </button>
          </form>
        )}
      </section>
    </div>
  );
}