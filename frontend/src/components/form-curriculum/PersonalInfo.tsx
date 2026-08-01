import { CurriculumCategory, Language } from "../../config/constants";
import type { ICurriculumInput } from "../../types/curriculumCreate";
import { phoneMask } from "../../utils/phoneMask";

interface PersonalInfoProps {
  form: ICurriculumInput;
  updateField<K extends keyof ICurriculumInput>(
    key: K,
    value: ICurriculumInput[K]
  ): void;
}

export function PersonalInfo({
  form,
  updateField,
}: PersonalInfoProps) {

  return (
    <section className="space-y-6 py-8">
      <h2 className="text-lg font-semibold text-text-primary">
        Informações Pessoais
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium tracking-wide uppercase text-text-secondary">
            Nome*
          </label>

          <input
            className="w-full rounded-md border border-border-default bg-transparent p-3 text-[15px] text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium tracking-wide uppercase text-text-secondary">
            Cargo*
          </label>

          <input
            className="w-full rounded-md border border-border-default bg-transparent p-3 text-[15px] text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
            value={form.role}
            onChange={(e) => updateField("role", e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium tracking-wide uppercase text-text-secondary">
            E-mail*
          </label>

          <input
            type="email"
            className="w-full rounded-md border border-border-default bg-transparent p-3 text-[15px] text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium tracking-wide uppercase text-text-secondary">
            Telefone*
          </label>

          <input
            type="tel"
            placeholder="+99 99 99999-9999"
            className="w-full rounded-md border border-border-default bg-transparent p-3 text-[15px] text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
            value={form.phone}
            onChange={(e) =>
              updateField("phone", phoneMask(e.target.value))
            }
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium tracking-wide uppercase text-text-secondary">
          Localização*
        </label>

        <input
          className="w-full rounded-md border border-border-default bg-transparent p-3 text-[15px] text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
          value={form.location}
          onChange={(e) => updateField("location", e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium tracking-wide uppercase text-text-secondary">
            GitHub
          </label>

          <input
            className="w-full rounded-md border border-border-default bg-transparent p-3 text-[15px] text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
            value={form.github ?? ""}
            onChange={(e) =>
              updateField("github", e.target.value || null)
            }
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium tracking-wide uppercase text-text-secondary">
            LinkedIn*
          </label>

          <div className="flex overflow-hidden rounded-md border border-border-default focus-within:border-accent-primary">

            <input
              type="text"
              className="flex-1 bg-transparent p-3 text-[15px] text-text-primary placeholder:text-text-muted focus:outline-none"
              placeholder="username-9819-a-21"
              value={
                form.linkedin?.replace("https://www.linkedin.com/in/", "") ?? ""
              }
              onChange={(e) =>
                updateField(
                  "linkedin",
                  e.target.value
                    ? `https://www.linkedin.com/in/${e.target.value}`
                    : null
                )
              }
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium tracking-wide uppercase text-text-secondary">
            Idioma*
          </label>

          <select
            className="w-full rounded-md border border-border-default bg-transparent p-3 text-[15px] text-text-primary focus:border-accent-primary focus:outline-none"
            value={form.language}
            onChange={(e) =>
              updateField("language", e.target.value as typeof form.language)
            }
          >
            <option value={Language.PORTUGUESE}>Português</option>
            <option value={Language.ENGLISH}>English</option>
            <option value={Language.SPANISH}>Español</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium tracking-wide uppercase text-text-secondary">
            Categoria*
          </label>

          <select
            className="w-full rounded-md border border-border-default bg-transparent p-3 text-[15px] text-text-primary focus:border-accent-primary focus:outline-none"
            value={form.category}
            onChange={(e) =>
              updateField("category", e.target.value as typeof form.category)
            }
          >
            {Object.entries(CurriculumCategory).map(([label, value]) => (
              <option key={value} value={value}>
                {label.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium tracking-wide uppercase text-text-secondary">
          Resumo Profissional*
        </label>

        <textarea
          rows={8}
          className="w-full rounded-md border border-border-default bg-transparent p-3 text-[15px] text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
          placeholder="Descreva seu resumo profissional..."
          value={form.resume}
          onChange={(e) => updateField("resume", e.target.value)}
        />
      </div>
    </section>
  );
}
