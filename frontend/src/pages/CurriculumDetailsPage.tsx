import { useEffect, useState, lazy, Suspense } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { Eye, FileText, Clock } from "lucide-react";

const CurriculumDetails = lazy(() => 
  import("../components/CurriculumDetails").then((module) => ({ default: module.CurriculumDetails }))
);
const CurriculumPreview = lazy (() => 
  import("../components/CurriculumPreview").then((module) => ({ default: module.CurriculumPreview }))
);
const CurriculumFileHistory = lazy (() => 
  import("../components/CurriculumFileHistory").then((module) => ({ default: module.CurriculumFileHistory }))
);
const Loading = lazy(() =>
  import("../components/Loading").then((module) => ({ default: module.Loading }))
);

import { selectCurriculumByID, deleteCurriculum } from "../services/curriculum";

import { useAccessToken } from "../hooks/useAccessToken";
import { useAuthContext } from "../hooks/useAuthContext";
import { usePageNavigation } from "../hooks/usePageNavigation";

import type { ICurriculumResponse } from "../types/curriculumResponse";

// errors
import { AuthenticationError } from "../errors";

type ViewMode = "details" | "preview" | "history";

interface TabProps {
  mode: ViewMode;
  label: string;
  Icon: React.ComponentType<{ size: number }>;
  current: ViewMode;
  onChange: (mode: ViewMode) => void;
}

function Tab({ mode, label, Icon, current, onChange }: TabProps) {
  return (
    <button
      onClick={() => onChange(mode)}
      className={`inline-flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-medium transition ${
        current === mode
          ? "bg-bg-base text-text-primary"
          : "text-text-secondary hover:text-text-primary"
      }`}
    >
      <Icon size={15} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

export default function CurriculumDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const accessToken = useAccessToken();
    const navigateFor = usePageNavigation();
    const location = useLocation();

    const { logout } = useAuthContext();

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
          } catch (err) {
              if (err instanceof AuthenticationError) {
                sessionStorage.setItem("redirectAfterLogin", location.pathname);
                logout();
              }
          } finally {
              setLoading(false);
          }
        }

        loadCurriculum();
    }, [id, accessToken, logout, location]);

    async function handleDelete() {
        if (!curriculum) return;

        const confirmed = window.confirm(
        "Deseja realmente excluir este currículo?"
        );

        if (!confirmed) return;

        try {
        await deleteCurriculum(curriculum.id);

        navigateFor("/curriculums");
        } catch (error) {
        console.error(error);
        alert("Erro ao excluir currículo.");
        }
    }

    if (loading) {
        return <Loading />;
    }

    if (!curriculum) {
    return (
        <div className="flex min-h-screen items-center justify-center px-6">
            <div className="w-full max-w-md rounded-2xl border border-border-default bg-white p-5 sm:p-10 text-center">

                <div className="mb-4 sm:mb-6 text-4xl sm:text-6xl">📄</div>

                    <h1 className="text-xl sm:text-2xl font-bold text-text-primary">
                    Currículo não encontrado
                    </h1>

                    <p className="mt-3 text-[15px] text-text-secondary">
                    O currículo pode ter sido removido ou o link informado é inválido.
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">

                    <Link
                        to="/"
                        className="rounded-lg px-7 py-3 text-[15px] font-medium text-white transition hover:brightness-110"
                        style={{
                          background: "linear-gradient(135deg, #FFB200 0%, #FF8A00 100%)",
                        }}
                    >
                        🏠 Ir para Home
                    </Link>

                    <Link
                        to="/curriculums"
                        className="rounded-lg border border-border-default bg-white px-5 py-3 text-[15px] font-medium text-accent-horizon transition hover:bg-bg-surface"
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
        <div className="sticky top-0 z-30 border-b border-border-default bg-bg-base/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-3">
            <Link
              to="/curriculums"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-text-secondary transition hover:text-text-primary"
            >
              ← <span className="hidden sm:inline">Voltar</span>
            </Link>

            <div className="flex items-center gap-1 rounded-lg bg-bg-surface p-1">
              <Tab mode="details" label="Detalhes" Icon={Eye} current={viewMode} onChange={setViewMode} />
              <Tab mode="preview" label="Pré-visualização" Icon={FileText} current={viewMode} onChange={setViewMode} />
              <Tab mode="history" label="Histórico" Icon={Clock} current={viewMode} onChange={setViewMode} />
            </div>
          </div>
        </div>

        {viewMode === "details" ? (
          <Suspense fallback={<Loading fullScreen={false}/>}>
            <CurriculumDetails
              curriculum={curriculum}
              onDelete={handleDelete}
            />
          </Suspense>
        ) : viewMode === "preview" ? (
          <Suspense fallback={<Loading fullScreen={false}/>}> 
            <div className="min-h-screen bg-bg-surface">
              <div className="mx-auto max-w-6xl overflow-x-auto px-3 sm:px-6 py-6 sm:py-10">
                <CurriculumPreview curriculum={curriculum} token={accessToken ?? undefined} />
              </div>
            </div>
          </Suspense>
        ) : (
          <div className="min-h-screen bg-bg-base">
            {id && (
              <Suspense fallback={<Loading fullScreen={false}/>}>
                <CurriculumFileHistory
                  curriculumId={id}
                  token={accessToken ?? undefined}
                />
              </Suspense>
            )}
          </div>
        )}
      </>
    );
}
