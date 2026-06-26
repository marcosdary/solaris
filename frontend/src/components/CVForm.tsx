import { useState } from "react";
import { requestRouteCv } from "../services/api";
import type { CVPayload, CVResponse } from "../types/cv";
import { Loading } from "./Loading";
import { ResultCard } from "./ResultCard";

export function CVForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CVResponse | null>(null);

  const [form, setForm] = useState<CVPayload>({
    info: "",
    cv: "portuguese.docx",
    pdf: true,
  });

  // Descobre qual idioma exibir no select baseando-se no arquivo atual do estado
  const currentLanguage = form.cv === "english.docx" ? "english" : "portuguese";

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const data: CVResponse = await requestRouteCv(form);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Erro ao gerar currículo.");
    } finally {
      setLoading(false);
    }
  };

  function handleLanguage(value: string) {
    setForm((old) => ({
      ...old,
      cv: value === "portuguese" ? "portuguese.docx" : "english.docx",
    }));
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all"
      >
        <div className="space-y-6">
          {/* SELEÇÃO DE IDIOMA */}
          <div>
            <label htmlFor="language-select" className="mb-2 block font-medium text-slate-700">
              Em qual idioma deseja gerar seu currículo?
            </label>
            <select
              id="language-select"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-800 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              value={currentLanguage} // Corrigido aqui: agora reflete o estado dinamicamente
              onChange={(e) => handleLanguage(e.target.value)}
            >
              <option value="portuguese">Português</option>
              <option value="english">Inglês</option>
            </select>
          </div>

          {/* DESCRIÇÃO DA EXPERIÊNCIA */}
          <div>
            <label htmlFor="experience-input" className="mb-2 block font-medium text-slate-700">
              Descreva sua experiência e as informações que deseja incluir no currículo
            </label>
            <textarea
              id="experience-input"
              rows={8}
              className="w-full rounded-xl border border-slate-200 p-3 text-slate-800 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="Ex.: Desenvolvedor Backend com experiência em Python, FastAPI, Docker..."
              value={form.info}
              onChange={(e) =>
                setForm({
                  ...form,
                  info: e.target.value,
                })
              }
            />
          </div>

          {/* CHECKBOX OPÇÃO EM PDF */}
          <div className="flex items-center gap-3">
            <input
              id="pdf-checkbox"
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-blue-600 transition focus:ring-blue-500"
              checked={form.pdf}
              onChange={(e) =>
                setForm({
                  ...form,
                  pdf: e.target.checked,
                })
              }
            />
            <label htmlFor="pdf-checkbox" className="select-none text-sm font-medium text-slate-600 cursor-pointer">
              Gerar também uma versão em PDF
            </label>
          </div>

          {/* BOTÃO DE SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3.5 font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Gerando..." : "Gerar Currículo"}
          </button>
        </div>
      </form>

      {loading && <Loading />}

      {result && <ResultCard data={result} />}
    </>
  );
}