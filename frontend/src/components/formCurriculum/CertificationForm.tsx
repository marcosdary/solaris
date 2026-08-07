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
    <section className="space-y-6 py-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">
          Certificações
        </h2>

        <button
          type="button"
          onClick={add}
          className="rounded-lg bg-accent-horizon px-4 py-2 text-sm text-white transition hover:brightness-110"
        >
          + Adicionar
        </button>
      </div>

      {certifications.length === 0 && (
        <p className="text-[15px] text-text-secondary">
          Nenhuma certificação adicionada.
        </p>
      )}

      {certifications.map((certification, index) => {
        const isExcluded = mode === "edit" && certification.depreciated;

        return (
          <div
            key={index}
            className={`space-y-6 rounded-2xl border p-5 ${
              isExcluded
                ? "border-border-default bg-bg-surface opacity-50"
                : "border-border-default bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3
                className={`font-medium text-text-primary ${
                  isExcluded ? "line-through" : ""
                }`}
              >
                Certificação {index + 1}
                {isExcluded && (
                  <span className="ml-2 text-xs font-normal text-red-600">
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
              <label className="mb-1.5 block text-xs font-medium tracking-wide uppercase text-text-secondary">
                Nome
              </label>

              <input
                className="w-full rounded-md border border-border-default bg-transparent p-3 text-[15px] text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
                value={certification.name}
                onChange={(e) => update(index, "name", e.target.value)}
                disabled={!!isExcluded}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium tracking-wide uppercase text-text-secondary">
                Instituição
              </label>

              <input
                className="w-full rounded-md border border-border-default bg-transparent p-3 text-[15px] text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
                value={certification.institution}
                onChange={(e) => update(index, "institution", e.target.value)}
                disabled={!!isExcluded}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium tracking-wide uppercase text-text-secondary">
                Local
              </label>

              <input
                className="w-full rounded-md border border-border-default bg-transparent p-3 text-[15px] text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
                value={certification.location}
                onChange={(e) => update(index, "location", e.target.value)}
                disabled={!!isExcluded}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium tracking-wide uppercase text-text-secondary">
                  Data de início
                </label>

                <input
                  type="date"
                  className="w-full rounded-md border border-border-default bg-transparent p-3 text-[15px] text-text-primary focus:border-accent-primary focus:outline-none"
                  value={certification.start_date}
                  onChange={(e) => update(index, "start_date", e.target.value)}
                  disabled={!!isExcluded}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium tracking-wide uppercase text-text-secondary">
                  Data de término
                </label>

                <input
                  type="date"
                  className="w-full rounded-md border border-border-default bg-transparent p-3 text-[15px] text-text-primary focus:border-accent-primary focus:outline-none"
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
