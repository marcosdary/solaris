import { Link } from "react-router-dom";

import { CVForm } from "../components/CVForm";
import { ServerStatus } from "../components/ServerStatus";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-12">

        <div className="mb-10 text-center">
          <Link
            to="/"
            className="mb-6 inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            ← Voltar para Vagas
          </Link>
          
          <h1 className="text-4xl font-bold text-slate-800">
            Auto CV
          </h1>

          <ServerStatus />

          <p className="mt-3 text-slate-600">
            Gere currículos profissionais em poucos segundos utilizando IA.
          </p>

        </div>

        <CVForm />
      </div>
    </div>
  );
}