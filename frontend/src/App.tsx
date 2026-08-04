import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { AuthGuard } from "./components/auth/AuthGuard";
import Layout from "./components/Layout";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PasswordForgotPage from "./pages/PasswordForgotPage";
import FormCurriculumPage from "./pages/FormCurriculumPage";
import CurriculumsPage from "./pages/CurriculumsPage";
import CurriculumDetailsPage from "./pages/CurriculumDetailsPage";
import EditCurriculumPage from "./pages/EditCurriculumPage";
import MePage from "./pages/MePage";

import { usePostHogTelemetry } from "./hooks/usePostHogTelemetry";
import { usePageviewTracking } from "./hooks/usePageviewTracking";

function TelemetryWrapper({ children }: { children: React.ReactNode }) {
  // Executa as telemetrias de Rede, Hardware e Erros
  usePostHogTelemetry();

  // Executa o rastreamento de troca de páginas do React Router
  usePageviewTracking();
  
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <TelemetryWrapper>
        <AuthProvider>
          <Layout>
            <Routes>

              <Route path="/login" element={<LoginPage />} />

              <Route path="/register" element={<RegisterPage />} />

              <Route path="/password-forgot" element={<PasswordForgotPage />} />

              <Route path="/" element={<HomePage />} />

              <Route
                path="/curriculums"
                element={
                  <AuthGuard>
                    <CurriculumsPage />
                  </AuthGuard>
                }
              />

              <Route
                path="/curriculums/form"
                element={
                  <AuthGuard>
                    <FormCurriculumPage />
                  </AuthGuard>
                }
              />

              <Route
                path="/curriculums/:id"
                element={<CurriculumDetailsPage />}
              />

              <Route
                path="/curriculums/:id/edit"
                element={
                  <AuthGuard>
                    <EditCurriculumPage />
                  </AuthGuard>
                }
              />

              <Route
                path="/auth/me"
                element={
                  <AuthGuard>
                    <MePage />
                  </AuthGuard>
                }
              />

            </Routes>
          </Layout>
        </AuthProvider>
      </TelemetryWrapper>
    </BrowserRouter>
  );
}

export default App;
