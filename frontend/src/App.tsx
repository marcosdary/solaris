import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { lazy } from "react";

import { AuthProvider } from "./context/AuthContext";
import { AuthGuard } from "./components/auth/AuthGuard";
import Layout from "./components/Layout";

const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const PasswordForgotPage = lazy(() => import("./pages/PasswordForgotPage"));
const FormCurriculumPage = lazy(() => import("./pages/FormCurriculumPage"));
const CurriculumsPage = lazy(() => import("./pages/CurriculumsPage"));
const CurriculumDetailsPage = lazy(() => import("./pages/CurriculumDetailsPage"));
const EditCurriculumPage = lazy(() => import("./pages/EditCurriculumPage"));
const MePage = lazy(() => import("./pages/MePage"));

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
