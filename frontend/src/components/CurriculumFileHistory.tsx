import { useEffect, useState, useCallback } from "react";
import { Download, Trash2, File, FileText, Clock } from "lucide-react";

import { searchCurriculumFiles, downloadCurriculumFile, deleteCurriculumFile } from "../services/curriculumFiles";

import type { ICurriculumFileResponse } from "../types/curriculumFileResponse";

interface Props {
  curriculumId: string;
  token?: string;
}

type TemplateColor = "blue" | "slate" | "green" | "amber";

function templateBadge(template: string): { label: string; color: TemplateColor } {
  const t = template.toLowerCase();

  if (t.includes("standard")) return { label: "Standard", color: "blue" };
  if (t.includes("modern")) return { label: "Modern", color: "slate" };
  if (t.includes("docx")) return { label: "DOCX", color: "green" };
  if (t.includes("resume")) return { label: "Resume", color: "amber" };
  if (t.includes("english")) return { label: "English", color: "green" };
  if (t.includes("portuguese")) return { label: "Português", color: "green" };
  if (t.includes("spanish")) return { label: "Spanish", color: "green" };

  return { label: template, color: "slate" };
}

const BADGE_COLORS: Record<TemplateColor, string> = {
  blue: "bg-blue-50 text-blue-700 ring-blue-200/60",
  slate: "bg-slate-100 text-slate-600 ring-slate-200/60",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200/60",
  amber: "bg-amber-50 text-amber-700 ring-amber-200/60",
};

function isPdf(mimetype: string): boolean {
  return mimetype.includes("pdf");
}

function relativeDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  const time = date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  if (diffMins < 1) return "Agora mesmo";
  if (diffMins < 60) return `Há ${diffMins} min`;
  if (diffHours < 24) return `Hoje ${time}`;
  if (diffDays === 1) return `Ontem ${time}`;
  if (diffDays < 7) return `Há ${diffDays} dias`;

  return date.toLocaleDateString("pt-BR");
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-slate-100" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-28 rounded bg-slate-100" />
              <div className="h-3 w-40 rounded bg-slate-50" />
            </div>
            <div className="h-8 w-24 rounded-lg bg-slate-100" />
            <div className="h-8 w-8 rounded-lg bg-slate-50" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CurriculumFileHistory({ curriculumId, token }: Props) {
  const [files, setFiles] = useState<ICurriculumFileResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadFiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await searchCurriculumFiles(curriculumId, token);
      setFiles(data);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar histórico.");
    } finally {
      setLoading(false);
    }
  }, [curriculumId, token]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async function, setState runs after await
    void loadFiles();
  }, [loadFiles]);

  async function handleDownload(file: ICurriculumFileResponse) {
    try {
      setDownloadingId(file.id);
      const response = await downloadCurriculumFile(file.id, token);
      window.open(response.url, "_blank");
    } catch (err) {
      console.error(err);
      alert("Erro ao gerar link de download.");
    } finally {
      setDownloadingId(null);
    }
  }

  async function handleDelete(file: ICurriculumFileResponse) {
    const confirmed = window.confirm(
      `Deseja realmente excluir "${file.name}"?`
    );
    if (!confirmed) return;

    try {
      setDeletingId(file.id);
      await deleteCurriculumFile(file.id, token);
      await loadFiles();
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir arquivo.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">
          Histórico de Downloads
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Arquivos gerados a partir deste currículo.
        </p>
      </div>

      {loading && <LoadingSkeleton />}

      {error && !loading && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-700">{error}</p>
          <button
            onClick={loadFiles}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!loading && !error && files.length === 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white px-10 py-20 text-center shadow-sm">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-slate-100 p-4">
              <Clock size={32} className="text-slate-300" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-slate-700">
            Nenhum arquivo gerado
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Os PDFs e DOCXs gerados aparecerão aqui.
          </p>
        </div>
      )}

      {!loading && !error && files.length > 0 && (
        <div className="space-y-3">
          {files.map((file) => {
            const badge = templateBadge(file.template);
            const pdf = isPdf(file.mimetype);

            return (
              <div
                key={file.id}
                className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    pdf ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"
                  }`}
                >
                  {pdf ? <File size={18} /> : <FileText size={18} />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium text-slate-800">
                      {file.name}
                    </span>
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${BADGE_COLORS[badge.color]}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {relativeDate(file.created_at)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(file)}
                    disabled={downloadingId === file.id}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-2 text-xs font-medium text-white transition hover:bg-slate-700 disabled:opacity-50"
                  >
                    <Download
                      size={13}
                      className={downloadingId === file.id ? "animate-bounce" : ""}
                    />
                    {downloadingId === file.id ? "Baixando..." : "Download"}
                  </button>

                  <button
                    onClick={() => handleDelete(file)}
                    disabled={deletingId === file.id}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
