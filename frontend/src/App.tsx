import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import JobsPage from "./pages/JobsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/autocv"
          element={<HomePage />}
        />

        <Route
          path="/"
          element={<JobsPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;