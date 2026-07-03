import type { Dispatch, SetStateAction } from "react";
import type { IEducationInput } from "../../types/cv-input";

interface EducationFormProps {
  educations: IEducationInput[];
  setEducations: Dispatch<SetStateAction<IEducationInput[]>>;
}

export function EducationForm({
  educations,
  setEducations,
}: EducationFormProps) {
  function addEducation() {
    setEducations((old) => [
      ...old,
      {
        institution: "",
        degree: "",
        location: "",
        start_date: "",
        end_date: null,
      },
    ]);
  }

  function removeEducation(index: number) {
    setEducations((old) => old.filter((_, i) => i !== index));
  }

  function updateEducation(
    index: number,
    field: keyof IEducationInput,
    value: string | null
  ) {
    setEducations((old) =>
      old.map((education, i) =>
        i === index
          ? {
              ...education,
              [field]: value,
            }
          : education
      )
    );
  }

  return (
    <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">
          Formação Acadêmica
        </h2>

        <button
          type="button"
          onClick={addEducation}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700"
        >
          + Adicionar Formação
        </button>
      </div>

      {educations.length === 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">
            ⚠ É necessário adicionar pelo menos uma formação acadêmica.
          </p>
        </div>
      )}

      {educations.map((education, index) => (
        <div
          key={index}
          className="space-y-4 rounded-xl border border-slate-200 p-5"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-slate-700">
              Formação {index + 1}
            </h3>

            <button
              type="button"
              onClick={() => removeEducation(index)}
              className="text-sm text-red-600 transition hover:text-red-700"
            >
              Remover
            </button>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Instituição*
            </label>

            <input
              className="w-full rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:outline-none"
              value={education.institution}
              onChange={(e) =>
                updateEducation(index, "institution", e.target.value)
              }
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Curso*
            </label>

            <input
              className="w-full rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:outline-none"
              value={education.degree}
              onChange={(e) =>
                updateEducation(index, "degree", e.target.value)
              }
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Local*
            </label>

            <input
              className="w-full rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:outline-none"
              value={education.location}
              onChange={(e) =>
                updateEducation(index, "location", e.target.value)
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
                value={education.start_date}
                onChange={(e) =>
                  updateEducation(index, "start_date", e.target.value)
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
                value={education.end_date ?? ""}
                onChange={(e) =>
                  updateEducation(
                    index,
                    "end_date",
                    e.target.value || null
                  )
                }
              />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}