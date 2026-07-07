import type { ICertificationInput } from "../../types/curriculumCreate";
import type { UseCertificationsReturn } from "../../hooks/useCertifications";

interface CertificationFormProps
  extends UseCertificationsReturn<ICertificationInput> {
  mode: "create" | "edit";
}

export function CertificationForm({
  certifications,
  mode,
  add,
  remove,
  restore,
  update,
  visible: _visible,
  isEmpty: _isEmpty,
}: CertificationFormProps) {
  return (
    <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">
          Certificações
        </h2>

        <button
          type="button"
          onClick={add}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          + Adicionar
        </button>
      </div>

      {certifications.length === 0 && (
        <p className="text-sm text-slate-500">
          Nenhuma certificação adicionada.
        </p>
      )}

      {certifications.map((certification, index) => {
        const isExcluded = mode === "edit" && certification.depreciated;

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
                className={`font-medium ${isExcluded ? "line-through" : ""}`}
              >
                Certificação {index + 1}
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
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  Restaurar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remover
                </button>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Nome</label>

              <input
                className="w-full rounded-lg border p-2"
                value={certification.name}
                onChange={(e) => update(index, "name", e.target.value)}
                disabled={!!isExcluded}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Instituição
              </label>

              <input
                className="w-full rounded-lg border p-2"
                value={certification.institution}
                onChange={(e) => update(index, "institution", e.target.value)}
                disabled={!!isExcluded}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Local</label>

              <input
                className="w-full rounded-lg border p-2"
                value={certification.location}
                onChange={(e) => update(index, "location", e.target.value)}
                disabled={!!isExcluded}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Data de início
                </label>

                <input
                  type="date"
                  className="w-full rounded-lg border p-2"
                  value={certification.start_date}
                  onChange={(e) => update(index, "start_date", e.target.value)}
                  disabled={!!isExcluded}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Data de término
                </label>

                <input
                  type="date"
                  className="w-full rounded-lg border p-2"
                  value={certification.end_date ?? ""}
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
