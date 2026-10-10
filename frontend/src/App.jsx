import { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const [status, setStatus] = useState("...");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/health")
      .then((res) => setStatus(res.data.status))
      .catch(() => setStatus("erreur"));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <h1 className="text-3xl font-bold text-indigo-900">
        Eduteam · API : {status}
      </h1>
    </div>
  );
}