import { CVForm } from "./components/CVForm";
import { ServerStatus } from "./components/ServerStatus";

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-12">

        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-slate-800">
            Auto CV
          </h1>

          <ServerStatus />

          <p className="mt-3 text-slate-600">
            Gere currículos profissionais em poucos
            segundos utilizando IA.
          </p>
        </div>

        <CVForm />
      </div>
    </div>
  );
}

export default App;