import { BarChart3, FileUp, ListChecks, LogOut, ReceiptText, WalletCards } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const items = [
  { to: "/", label: "Dashboard", icon: BarChart3 },
  { to: "/importar", label: "Importar", icon: FileUp },
  { to: "/protestos", label: "Protestos", icon: ListChecks },
  { to: "/boletos-pendentes", label: "Boletos Pendentes", icon: WalletCards },
  { to: "/relatorios", label: "Relatórios", icon: ReceiptText }
];

export function AppLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") ?? "{}");

  function logout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <strong>Protestos</strong>
          <span>Controle interno</span>
        </div>
        <nav>
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} end={item.to === "/"}>
                <Icon size={18} />
                {item.label}
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
          <div>
            <span className="muted">Usuário</span>
            <strong>{user.name ?? "Demo"}</strong>
          </div>
          <span className="pill">{user.role ?? "PERFIL"}</span>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
