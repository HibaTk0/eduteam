import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/authSlice";

export default function Layout() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-indigo-900 text-white">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/projects" className="text-xl font-bold">
            Eduteam
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span>
              {user?.nom} <span className="opacity-70">({user?.role})</span>
            </span>
            <button
              onClick={handleLogout}
              className="bg-white text-indigo-900 px-3 py-1 rounded font-medium hover:bg-indigo-100"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}