import { useState } from "react";
import { requestRouteCv } from "../services/api";
import type { CVPayload, CVResponse } from "../types/cv";
import { Loading } from "./Loading";
import { ResultCard } from "./ResultCard";

export function CVForm() {
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<CVResponse | null>(null);
  const dirname = "portuguese";

  const [form, setForm] = useState<CVPayload>({
    info: "",
    cv: "portuguese.docx",
    pdf: true,
  });

  const handleSubmit = async (
    e: React.SyntheticEvent<HTMLFormElement>
  ) => {
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
  }

  function handleLanguage(value: string) {
    setForm((old) => ({
      ...old,
      cv:
        value === "portuguese"
          ? "portuguese.docx"
          : "english.docx",
    }));
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white p-8 shadow-sm"
      >
        <div className="space-y-6">

          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Em qual idioma deseja gerar seu currículo?
            </label>

            <select
              className="w-full rounded-lg border p-3"
              value={dirname}
              onChange={(e) =>
                handleLanguage(e.target.value)
              }
            >
              <option value="portuguese">
                Português
              </option>

              <option value="english">
                Inglês
              </option>
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Descreva sua experiência e as informações que
              deseja incluir no currículo
            </label>

            <textarea
              rows={8}
              className="w-full rounded-lg border p-3"
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

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.pdf}
              onChange={(e) =>
                setForm({
                  ...form,
                  pdf: e.target.checked,
                })
              }
            />

            <label>
              Gerar também uma versão em PDF
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            Gerar Currículo
          </button>
        </div>
      </form>

      {loading && <Loading />}

      {result && <ResultCard data={result} />}
    </>
  );
}