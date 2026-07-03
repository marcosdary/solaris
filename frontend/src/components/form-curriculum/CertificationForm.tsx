import type { Dispatch, SetStateAction } from "react";
import type { ICertificationInput } from "../../types/cv-input";

interface CertificationFormProps {
  certifications: ICertificationInput[];
  setCertifications: Dispatch<SetStateAction<ICertificationInput[]>>;
}

export function CertificationForm({
  certifications,
  setCertifications,
}: CertificationFormProps) {
  function addCertification() {
    setCertifications((old) => [
      ...old,
      {
        institution: "",
        name: "",
        location: "",
        start_date: "",
        end_date: null,
      },
    ]);
  }

  function removeCertification(index: number) {
    setCertifications((old) => old.filter((_, i) => i !== index));
  }

  function updateCertification(
    index: number,
    field: keyof ICertificationInput,
    value: string | null
  ) {
    setCertifications((old) =>
      old.map((certification, i) =>
        i === index
          ? {
              ...certification,
              [field]: value,
            }
          : certification
      )
    );
  }

  return (
    <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">
          Certificações
        </h2>

        <button
          type="button"
          onClick={addCertification}
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

      {certifications.map((certification, index) => (
        <div
          key={index}
          className="space-y-4 rounded-xl border border-slate-200 p-5"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-medium">
              Certificação {index + 1}
            </h3>

            <button
              type="button"
              onClick={() => removeCertification(index)}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Remover
            </button>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Nome
            </label>

            <input
              className="w-full rounded-lg border p-2"
              value={certification.name}
              onChange={(e) =>
                updateCertification(index, "name", e.target.value)
              }
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Instituição
            </label>

            <input
              className="w-full rounded-lg border p-2"
              value={certification.institution}
              onChange={(e) =>
                updateCertification(index, "institution", e.target.value)
              }
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Local
            </label>

            <input
              className="w-full rounded-lg border p-2"
              value={certification.location}
              onChange={(e) =>
                updateCertification(index, "location", e.target.value)
              }
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
                onChange={(e) =>
                  updateCertification(index, "start_date", e.target.value)
                }
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
                  updateCertification(
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