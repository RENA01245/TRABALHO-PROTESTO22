import { useEffect, useState } from "react";
import { BarChart3, FileUp, ListChecks, LogOut, ReceiptText, WalletCards } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { mockDashboard } from "../api/mock";

const items = [
  { to: "/", label: "Dashboard", icon: BarChart3 },
  { to: "/importar", label: "Importar", icon: FileUp },
  { to: "/protestos", label: "Protestos", icon: ListChecks },
  { to: "/boletos-pendentes", label: "Boletos Pendentes", icon: WalletCards },
  { to: "/relatorios", label: "Relatorios", icon: ReceiptText }
];

export function AppLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") ?? "{}");
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    api.get("/dashboard")
      .then((response) => setPendingCount(response.data.pendingBoletos ?? 0))
      .catch(() => setPendingCount(mockDashboard.pendingBoletos));
  }, []);

  function logout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">CP</div>
          <div>
            <strong>Protestos</strong>
            <span>Controle interno</span>
          </div>
        </div>
        <nav>
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} end={item.to === "/"}>
                <Icon size={18} />
                <span>{item.label}</span>
                {item.to === "/boletos-pendentes" && pendingCount > 0 && <strong className="nav-count">{pendingCount}</strong>}
              </NavLink>
            );
          })}
        </nav>
        <button className="logout" type="button" onClick={logout}>
          <LogOut size={18} />
          Sair
        </button>
      </aside>
      <main className="main">
        <header className="topbar">
          <div className="topbar-title">
            <span className="muted">Bem-vindo</span>
            <strong>{user.name ?? "Usuario Demo"}</strong>
          </div>
          <div className="topbar-profile">
            <span className="muted">Perfil</span>
            <span className="pill">{user.role ?? "PERFIL"}</span>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
