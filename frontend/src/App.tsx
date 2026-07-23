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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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

          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
