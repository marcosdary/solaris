import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Eye, FileText, Clock } from "lucide-react";

import { CurriculumDetails } from "../components/CurriculumDetails";
import { CurriculumPreview } from "../components/CurriculumPreview";
import { CurriculumFileHistory } from "../components/CurriculumFileHistory";
import { selectCurriculumByID, deleteCurriculum } from "../services/curriculum";
import { useAccessToken } from "../hooks/useAccessToken";

import type { ICurriculumResponse } from "../types/curriculumResponse";

type ViewMode = "details" | "preview" | "history";

export default function CurriculumDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const accessToken = useAccessToken();
    const navigate = useNavigate();

    const [curriculum, setCurriculum] =
        useState<ICurriculumResponse | null>(null);

    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>("details");

    useEffect(() => {
        async function loadCurriculum() {
        if (!id) return;

        try {
            const data = await selectCurriculumByID(id, accessToken ?? undefined);
            setCurriculum(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
        }

        loadCurriculum();
    }, [id, accessToken]);

    async function handleDelete() {
        if (!curriculum) return;

        const confirmed = window.confirm(
        "Deseja realmente excluir este currículo?"
        );

        if (!confirmed) return;

        try {
        await deleteCurriculum(curriculum.id);

        navigate("/curriculums");
        } catch (error) {
        console.error(error);
        alert("Erro ao excluir currículo.");
        }
    }

    if (loading) {
        return (
        <div className="flex min-h-screen items-center justify-center">
            Carregando...
        </div>
        );
    }

    if (!curriculum) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
            <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

                <div className="mb-6 text-6xl">📄</div>

                    <h1 className="text-2xl font-bold text-slate-900">
                    Currículo não encontrado
                    </h1>

                    <p className="mt-3 text-slate-600">
                    O currículo pode ter sido removido ou o link informado é inválido.
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">

                    <Link
                        to="/"
                        className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
                    >
                        🏠 Ir para Home
                    </Link>

                    <Link
                        to="/curriculums"
                        className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                        📄 Ver Currículos
                    </Link>

                </div>
            </div>
        </div>
    );
    }

    return (
      <>
        <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
            <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
              <button
                onClick={() => setViewMode("details")}
                className={`inline-flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-medium transition ${
                  viewMode === "details"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Eye size={15} />
                Detalhes
              </button>
              <button
                onClick={() => setViewMode("preview")}
                className={`inline-flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-medium transition ${
                  viewMode === "preview"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <FileText size={15} />
                Pré-visualização PDF
              </button>
              <button
                onClick={() => setViewMode("history")}
                className={`inline-flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-medium transition ${
                  viewMode === "history"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Clock size={15} />
                Histórico
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/curriculums"
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
              >
                ← Lista
              </Link>
              <Link
                to="/"
                className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                Home
              </Link>
            </div>
          </div>
        </div>

        {viewMode === "details" ? (
          <CurriculumDetails
            curriculum={curriculum}
            onDelete={handleDelete}
          />
        ) : viewMode === "preview" ? (
          <div className="min-h-screen bg-slate-100">
            <div className="mx-auto max-w-6xl px-6 py-10">
              <CurriculumPreview curriculum={curriculum} token={accessToken ?? undefined} />
            </div>
          </div>
        ) : (
          <div className="min-h-screen bg-slate-50">
            {id && (
              <CurriculumFileHistory
                curriculumId={id}
                token={accessToken ?? undefined}
              />
            )}
          </div>
        )}
      </>
    );
}