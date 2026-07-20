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
    <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">
          Experiência Profissional
        </h2>

        <button
          type="button"
          onClick={add}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700"
        >
          + Adicionar Experiência
        </button>
      </div>

      {experiences.length === 0 && (
        <p className="text-sm text-slate-500">Nenhuma experiência profissional adicionada.</p>
      )}

      {experiences.map((experience, experienceIndex) => {
        const isExcluded = mode === "edit" && experience.depreciated;

        return (
          <div
            key={experienceIndex}
            className={`space-y-5 rounded-xl border p-5 ${
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
                Experiência {experienceIndex + 1}
                {isExcluded && (
                  <span className="ml-2 text-xs font-normal text-red-500">
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
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Cargo*
              </label>

              <input
                className="w-full rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:outline-none"
                value={experience.role}
                onChange={(e) =>
                  update(experienceIndex, "role", e.target.value)
                }
                disabled={!!isExcluded}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Empresa*
              </label>

              <input
                className="w-full rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:outline-none"
                value={experience.company}
                onChange={(e) =>
                  update(experienceIndex, "company", e.target.value)
                }
                disabled={!!isExcluded}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Local*
              </label>

              <input
                className="w-full rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:outline-none"
                value={experience.location}
                onChange={(e) =>
                  update(experienceIndex, "location", e.target.value)
                }
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
                  value={experience.start_date}
                  onChange={(e) =>
                    update(experienceIndex, "start_date", e.target.value)
                  }
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
                  value={experience.end_date ?? ""}
                  onChange={(e) =>
                    update(experienceIndex, "end_date", e.target.value || null)
                  }
                  disabled={!!isExcluded}
                />
              </div>
            </div>

            {!isExcluded && (
              <div className="space-y-3 rounded-lg border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-slate-700">Atividades</h4>

                  <button
                    type="button"
                    onClick={() => addActivity(experienceIndex)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    + Adicionar Atividade
                  </button>
                </div>

                {experience.activities.length === 0 && (
                  <p className="text-sm text-slate-500">
                    Nenhuma atividade adicionada.
                  </p>
                )}

                {experience.activities.map((activity, activityIndex) => (
                  <div key={activityIndex} className="flex items-start gap-2">
                    <textarea
                      rows={3}
                      className="flex-1 rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:outline-none"
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
                      className="rounded-lg px-3 py-2 text-red-600 hover:bg-red-50"
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
