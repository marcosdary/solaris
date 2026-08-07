import type { IExperienceInput } from "../../types/curriculumCreate";
import type { UseExperiencesReturn } from "../../hooks/useExperiences";

interface ExperienceFormProps extends UseExperiencesReturn<IExperienceInput> {
  mode: "create" | "edit";
}

export function ExperienceForm({
  mode,
  experiences,
  add,
  remove,
  restore,
  update,
  addActivity,
  removeActivity,
  updateActivity,
  visible: _visible,
}: ExperienceFormProps) {
  return (
    <section className="space-y-6 py-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">
          Experiência Profissional
        </h2>

        <button
          type="button"
          onClick={add}
          className="rounded-lg bg-accent-horizon px-4 py-2 text-sm text-white transition hover:brightness-110"
        >
          + Adicionar Experiência
        </button>
      </div>

      {experiences.length === 0 && (
        <p className="text-[15px] text-text-secondary">Nenhuma experiência profissional adicionada.</p>
      )}

      {experiences.map((experience, experienceIndex) => {
        const isExcluded = mode === "edit" && experience.depreciated;

        return (
          <div
            key={experienceIndex}
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
                Experiência {experienceIndex + 1}
                {isExcluded && (
                  <span className="ml-2 text-xs font-normal text-red-600">
                    (Removido)
                  </span>
                )}
              </h3>

              {isExcluded ? (
                <button
                  type="button"
                  onClick={() => restore(experienceIndex)}
                  className="text-sm text-green-600 transition hover:text-green-700"
                >
                  Restaurar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => remove(experienceIndex)}
                  className="text-sm text-red-600 transition hover:text-red-700"
                >
                  Remover
                </button>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium tracking-wide uppercase text-text-secondary">
                Cargo*
              </label>

              <input
                className="w-full rounded-md border border-border-default bg-transparent p-3 text-[15px] text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
                value={experience.role}
                onChange={(e) =>
                  update(experienceIndex, "role", e.target.value)
                }
                disabled={!!isExcluded}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium tracking-wide uppercase text-text-secondary">
                Empresa*
              </label>

              <input
                className="w-full rounded-md border border-border-default bg-transparent p-3 text-[15px] text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
                value={experience.company}
                onChange={(e) =>
                  update(experienceIndex, "company", e.target.value)
                }
                disabled={!!isExcluded}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium tracking-wide uppercase text-text-secondary">
                Local*
              </label>

              <input
                className="w-full rounded-md border border-border-default bg-transparent p-3 text-[15px] text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
                value={experience.location}
                onChange={(e) =>
                  update(experienceIndex, "location", e.target.value)
                }
                disabled={!!isExcluded}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium tracking-wide uppercase text-text-secondary">
                  Data de Início*
                </label>

                <input
                  type="date"
                  className="w-full rounded-md border border-border-default bg-transparent p-3 text-[15px] text-text-primary focus:border-accent-primary focus:outline-none"
                  value={experience.start_date}
                  onChange={(e) =>
                    update(experienceIndex, "start_date", e.target.value)
                  }
                  disabled={!!isExcluded}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium tracking-wide uppercase text-text-secondary">
                  Data de Término
                </label>

                <input
                  type="date"
                  className="w-full rounded-md border border-border-default bg-transparent p-3 text-[15px] text-text-primary focus:border-accent-primary focus:outline-none"
                  value={experience.end_date ?? ""}
                  onChange={(e) =>
                    update(experienceIndex, "end_date", e.target.value || null)
                  }
                  disabled={!!isExcluded}
                />
              </div>
            </div>

            {!isExcluded && (
              <div className="space-y-4 rounded-2xl border border-border-default bg-bg-surface p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[15px] font-medium text-text-primary">Atividades</h4>

                  <button
                    type="button"
                    onClick={() => addActivity(experienceIndex)}
                    className="text-sm font-medium text-accent-horizon transition hover:brightness-110"
                  >
                    + Adicionar Atividade
                  </button>
                </div>

                {experience.activities.length === 0 && (
                  <p className="text-[15px] text-text-secondary">
                    Nenhuma atividade adicionada.
                  </p>
                )}

                {experience.activities.map((activity, activityIndex) => (
                  <div key={activityIndex} className="flex items-start gap-2">
                    <textarea
                      rows={3}
                      className="flex-1 rounded-md border border-border-default bg-transparent p-3 text-[15px] text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
                      placeholder="Descreva a atividade..."
                      value={activity.description}
                      onChange={(e) =>
                        updateActivity(
                          experienceIndex,
                          activityIndex,
                          e.target.value
                        )
                      }
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeActivity(experienceIndex, activityIndex)
                      }
                      className="rounded-md px-3 py-2 text-red-600 transition hover:bg-red-50"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
