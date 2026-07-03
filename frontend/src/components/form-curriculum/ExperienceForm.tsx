import type { Dispatch, SetStateAction } from "react";
import type {
  IExperienceActivityInput,
  IExperienceInput,
} from "../../types/cv-input";

interface ExperienceFormProps {
  experiences: IExperienceInput[];
  setExperiences: Dispatch<SetStateAction<IExperienceInput[]>>;
}

export function ExperienceForm({
  experiences,
  setExperiences,
}: ExperienceFormProps) {
  function addExperience() {
    setExperiences((old) => [
      ...old,
      {
        role: "",
        company: "",
        location: "",
        start_date: "",
        end_date: null,
        activities: [],
      },
    ]);
  }

  function removeExperience(index: number) {
    setExperiences((old) => old.filter((_, i) => i !== index));
  }

  function updateExperience(
    index: number,
    field: keyof Omit<IExperienceInput, "activities">,
    value: string | null
  ) {
    setExperiences((old) =>
      old.map((experience, i) =>
        i === index
          ? {
              ...experience,
              [field]: value,
            }
          : experience
      )
    );
  }

  function addActivity(experienceIndex: number) {
    setExperiences((old) =>
      old.map((experience, i) =>
        i === experienceIndex
          ? {
              ...experience,
              activities: [
                ...experience.activities,
                {
                  description: "",
                },
              ],
            }
          : experience
      )
    );
  }

  function removeActivity(
    experienceIndex: number,
    activityIndex: number
  ) {
    setExperiences((old) =>
      old.map((experience, i) =>
        i === experienceIndex
          ? {
              ...experience,
              activities: experience.activities.filter(
                (_, idx) => idx !== activityIndex
              ),
            }
          : experience
      )
    );
  }

  function updateActivity(
    experienceIndex: number,
    activityIndex: number,
    value: string
  ) {
    setExperiences((old) =>
      old.map((experience, i) => {
        if (i !== experienceIndex) return experience;

        const activities: IExperienceActivityInput[] = [
          ...experience.activities,
        ];

        activities[activityIndex] = {
          ...activities[activityIndex],
          description: value,
        };

        return {
          ...experience,
          activities,
        };
      })
    );
  }

  return (
    <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">
          Experiência Profissional
        </h2>

        <button
          type="button"
          onClick={addExperience}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700"
        >
          + Adicionar Experiência
        </button>
      </div>

      {experiences.length === 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">
            ⚠ É necessário adicionar pelo menos uma experiência profissional.
          </p>
        </div>
      )}

      {experiences.map((experience, experienceIndex) => (
        <div
          key={experienceIndex}
          className="space-y-5 rounded-xl border border-slate-200 p-5"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-slate-700">
              Experiência {experienceIndex + 1}
            </h3>

            <button
              type="button"
              onClick={() => removeExperience(experienceIndex)}
              className="text-sm text-red-600 transition hover:text-red-700"
            >
              Remover
            </button>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Cargo*
            </label>

            <input
              className="w-full rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:outline-none"
              value={experience.role}
              onChange={(e) =>
                updateExperience(
                  experienceIndex,
                  "role",
                  e.target.value
                )
              }
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
                updateExperience(
                  experienceIndex,
                  "company",
                  e.target.value
                )
              }
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
                updateExperience(
                  experienceIndex,
                  "location",
                  e.target.value
                )
              }
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
                  updateExperience(
                    experienceIndex,
                    "start_date",
                    e.target.value
                  )
                }
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
                  updateExperience(
                    experienceIndex,
                    "end_date",
                    e.target.value || null
                  )
                }
              />
            </div>
          </div>

          <div className="space-y-3 rounded-lg border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-slate-700">
                Atividades
              </h4>

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
              <div
                key={activityIndex}
                className="flex items-start gap-2"
              >
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
                    removeActivity(
                      experienceIndex,
                      activityIndex
                    )
                  }
                  className="rounded-lg px-3 py-2 text-red-600 hover:bg-red-50"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}