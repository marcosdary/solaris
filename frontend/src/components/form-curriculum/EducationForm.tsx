import type { IEducationInput } from "../../types/curriculumCreate";
import type { UseEducationsReturn } from "../../hooks/useEducations";

interface EducationFormProps extends UseEducationsReturn<IEducationInput> {
  mode: "create" | "edit";
}

export function EducationForm({
  educations,
  mode,
  add,
  remove,
  restore,
  update,
  visible: _visible,
  isEmpty,
}: EducationFormProps) {
  return (
    <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">
          Formação Acadêmica
        </h2>

        <button
          type="button"
          onClick={add}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700"
        >
          + Adicionar Formação
        </button>
      </div>

      {isEmpty() && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">
            ⚠ É necessário adicionar pelo menos uma formação acadêmica.
          </p>
        </div>
      )}

      {educations.map((education, index) => {
        const isExcluded = mode === "edit" && education.depreciated;

        return (
          <div
            key={index}
            className={`space-y-4 rounded-xl border p-5 ${
              isExcluded
                ? "border-slate-200 bg-slate-100 opacity-50"
                : "border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3
                className={`font-medium text-slate-700 ${
                  isExcluded ? "line-through" : ""
                }`}
              >
                Formação {index + 1}
                {isExcluded && (
                  <span className="ml-2 text-xs font-normal text-red-500">
                    (Removido)
                  </span>
                )}
              </h3>

              {isExcluded ? (
                <button
                  type="button"
                  onClick={() => restore(index)}
                  className="text-sm text-green-600 transition hover:text-green-700"
                >
                  Restaurar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-sm text-red-600 transition hover:text-red-700"
                >
                  Remover
                </button>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Instituição*
              </label>

              <input
                className="w-full rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:outline-none"
                value={education.institution}
                onChange={(e) => update(index, "institution", e.target.value)}
                disabled={!!isExcluded}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Curso*
              </label>

              <input
                className="w-full rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:outline-none"
                value={education.degree}
                onChange={(e) => update(index, "degree", e.target.value)}
                disabled={!!isExcluded}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Local*
              </label>

              <input
                className="w-full rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:outline-none"
                value={education.location}
                onChange={(e) => update(index, "location", e.target.value)}
                disabled={!!isExcluded}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Data de Início*
                </label>

                <input
                  type="date"
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:outline-none"
                  value={education.start_date}
                  onChange={(e) => update(index, "start_date", e.target.value)}
                  disabled={!!isExcluded}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Data de Término
                </label>

                <input
                  type="date"
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:outline-none"
                  value={education.end_date ?? ""}
                  onChange={(e) =>
                    update(index, "end_date", e.target.value || null)
                  }
                  disabled={!!isExcluded}
                />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
