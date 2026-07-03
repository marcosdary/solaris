import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import FormCurriculumPage from "./pages/FormCurriculumPage";
import CurriculumsPage from "./pages/CurriculumsPage"; 
import CurriculumDetailsPage from "./pages/CurriculumDetailsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/curriculums"
          element={<CurriculumsPage />}
        />

        <Route
          path="/curriculums/:id"
          element={<CurriculumDetailsPage />}
        />

        <Route
          path="/curriculums/form"
          element={<FormCurriculumPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;