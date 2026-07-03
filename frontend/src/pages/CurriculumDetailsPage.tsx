import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import { CurriculumDetails } from "../components/CurriculumDetails";
import { selectCurriculumByID, deleteCurriculum } from "../services/api";

import type { ICurriculumResponse } from "../types/cv";

export default function CurriculumDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [curriculum, setCurriculum] =
        useState<ICurriculumResponse | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadCurriculum() {
        if (!id) return;

        try {
            const data = await selectCurriculumByID(id);
            setCurriculum(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
        }

        loadCurriculum();
    }, [id]);

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
        <CurriculumDetails
        curriculum={curriculum}
        onDelete={handleDelete}
        />
    );
}