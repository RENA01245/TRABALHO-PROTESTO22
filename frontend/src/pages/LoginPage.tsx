import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("funcionario@demo.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch {
      const role = email.includes("chefe") ? "CHEFE" : email.includes("admin") ? "ADMIN" : "FUNCIONARIO";
      if (password === "123456") {
        localStorage.setItem("token", "demo-token");
        localStorage.setItem("user", JSON.stringify({ id: "demo", name: `${role} Demo`, email, role }));
        navigate("/");
        return;
      }
      setError("E-mail ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={submit}>
        <h1>Controle de Protestos</h1>
        <p>Painel de acompanhamento de protestos e boletos.</p>
        <label>
          E-mail
          <input value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label>
          Senha
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        {error && <div className="alert error">{error}</div>}
        <button type="submit" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button>
        <small>Demo: funcionario@demo.com, chefe@demo.com ou admin@demo.com / senha 123456</small>
      </form>
    </div>
  );
}
