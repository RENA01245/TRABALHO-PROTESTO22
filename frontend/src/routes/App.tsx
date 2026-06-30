import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "../ui/AppLayout";
import { LoginPage } from "../pages/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";
import { ImportPage } from "../pages/ImportPage";
import { ProtestsPage } from "../pages/ProtestsPage";
import { PendingBoletosPage } from "../pages/PendingBoletosPage";
import { ProtestDetailsPage } from "../pages/ProtestDetailsPage";
import { ReportPage } from "../pages/ReportPage";

function Protected({ children }: { children: JSX.Element }) {
  return localStorage.getItem("token") ? children : <Navigate to="/login" replace />;
}

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Protected><AppLayout /></Protected>}>
        <Route index element={<DashboardPage />} />
        <Route path="importar" element={<ImportPage />} />
        <Route path="protestos" element={<ProtestsPage />} />
        <Route path="protestos/:id" element={<ProtestDetailsPage />} />
        <Route path="boletos-pendentes" element={<PendingBoletosPage />} />
        <Route path="relatorios" element={<ReportPage />} />
      </Route>
    </Routes>
  );
}
