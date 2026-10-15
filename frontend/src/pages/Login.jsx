import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../features/authSlice";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onChange = (e) => {
    dispatch(clearError());
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(form));
    if (login.fulfilled.match(result)) navigate("/projects");
  };

  const input = "w-full border rounded px-3 py-2 focus:outline-indigo-500";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <form onSubmit={onSubmit} className="bg-white p-6 rounded-lg shadow w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-indigo-900">Connexion</h1>

        {error && <p className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm">{error}</p>}

        <input className={input} type="email" name="email" placeholder="Email" value={form.email} onChange={onChange} required />
        <input className={input} type="password" name="password" placeholder="Mot de passe" value={form.password} onChange={onChange} required />

        <button disabled={loading} className="w-full bg-indigo-900 text-white py-2 rounded font-medium hover:bg-indigo-800 disabled:opacity-50">
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        <p className="text-sm text-center">
          Pas de compte ? <Link to="/register" className="text-indigo-700 underline">S'inscrire</Link>
        </p>
      </form>
    </div>
  );
}