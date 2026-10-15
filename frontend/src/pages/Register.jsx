import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register, clearError } from "../features/authSlice";

export default function Register() {
  const [form, setForm] = useState({
    nom: "",
    email: "",
    password: "",
    filiere: "",
    role: "etudiant",
  });
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onChange = (e) => {
    dispatch(clearError());
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(register(form));
    if (register.fulfilled.match(result)) navigate("/projects");
  };

  const input = "w-full border rounded px-3 py-2 focus:outline-indigo-500";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <form onSubmit={onSubmit} className="bg-white p-6 rounded-lg shadow w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-indigo-900">Créer un compte</h1>

        {error && <p className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm">{error}</p>}

        <input className={input} name="nom" placeholder="Nom complet" value={form.nom} onChange={onChange} required />
        <input className={input} type="email" name="email" placeholder="Email" value={form.email} onChange={onChange} required />
        <input className={input} type="password" name="password" placeholder="Mot de passe (6 caractères min.)" value={form.password} onChange={onChange} required minLength={6} />
        <input className={input} name="filiere" placeholder="Filière" value={form.filiere} onChange={onChange} />
        <select className={input} name="role" value={form.role} onChange={onChange}>
          <option value="etudiant">Étudiant</option>
          <option value="encadrant">Encadrant</option>
        </select>

        <button disabled={loading} className="w-full bg-indigo-900 text-white py-2 rounded font-medium hover:bg-indigo-800 disabled:opacity-50">
          {loading ? "Création..." : "S'inscrire"}
        </button>

        <p className="text-sm text-center">
          Déjà un compte ? <Link to="/login" className="text-indigo-700 underline">Se connecter</Link>
        </p>
      </form>
    </div>
  );
}