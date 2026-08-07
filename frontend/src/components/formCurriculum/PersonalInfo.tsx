import { CurriculumCategory, CurriculumCategoryLabel, Language } from "../../config/constants";
import type { ICurriculumInput } from "../../types/curriculumCreate";
import { PersonalPhone } from "../PersonalPhone";
import { PersonalLocation } from "./PersonalLocation";

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
  const inputStyle =
    "w-full rounded-md border border-border-default bg-transparent p-3 text-[15px] text-text-primary placeholder:text-text-muted transition-all duration-200 hover:border-border-default/80 focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary";
  
  const labelStyle =
    "mb-1.5 block text-xs font-medium tracking-wide uppercase text-text-secondary";

  const optionStyle = "bg-background-primary text-text-primary";

  return (
    <section className="space-y-6 py-6">
      {/* Cabeçalho da Seção */}
      <div className="border-b border-border-default pb-4">
        <h2 className="text-xl font-semibold text-text-primary tracking-tight">
          Informações Pessoais
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Preencha seus dados de contato e apresentação para o currículo.
        </p>
      </div>

      {/* Nome e Cargo */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className={labelStyle}>Nome*</label>
          <input
            className={inputStyle}
            placeholder="Ex: Alex Silva"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
          />
        </div>

        <div>
          <label className={labelStyle}>Cargo*</label>
          <input
            className={inputStyle}
            placeholder="Ex: Desenvolvedor Full Stack"
            value={form.role}
            onChange={(e) => updateField("role", e.target.value)}
          />
        </div>
      </div>

      {/* Email e Telefone */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className={labelStyle}>E-mail*</label>
          <input
            type="email"
            className={inputStyle}
            placeholder="alex.silva@exemplo.com"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
          />
        </div>

        <div>
          <label className={labelStyle}>Telefone*</label>
          <PersonalPhone 
          form={form} 
          updateField={updateField} 
          inputStyle={inputStyle} 
          />
        </div>
      </div>

      {/* Localização */}
      <div>
        <label className={labelStyle}>Localização*</label>
        <PersonalLocation/>
      </div>

      {/* GitHub e LinkedIn */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className={labelStyle}>GitHub</label>
          <input
            className={inputStyle}
            placeholder="github.com/seu-usuario"
            value={form.github ?? ""}
            onChange={(e) => updateField("github", e.target.value || null)}
          />
        </div>

        <div>
          <label className={labelStyle}>LinkedIn*</label>
          <input
            type="text"
            className={inputStyle}
            placeholder="linkedin.com/in/seu-usuario"
            value={form.linkedin ?? ""}
            onChange={(e) => updateField("linkedin", e.target.value || null)}
          />
        </div>
      </div>

      {/* Idioma e Categoria */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className={labelStyle}>Idioma do Currículo*</label>
          <select
            className={`${inputStyle} cursor-pointer`}
            value={form.language}
            onChange={(e) =>
              updateField("language", e.target.value as typeof form.language)
            }
          >
            <option value={Language.PORTUGUESE} className={optionStyle}>
              Português
            </option>
            <option value={Language.ENGLISH} className={optionStyle}>
              English
            </option>
            <option value={Language.SPANISH} className={optionStyle}>
              Español
            </option>
          </select>
        </div>

        <div>
          <label className={labelStyle}>Categoria*</label>
          <select
            className={`${inputStyle} cursor-pointer`}
            value={form.category}
            onChange={(e) =>
              updateField("category", e.target.value as typeof form.category)
            }
          >
            {Object.values(CurriculumCategory).map((value) => (
              <option key={value} value={value} className={optionStyle}>
                {CurriculumCategoryLabel[value]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Resumo Profissional */}
      <div>
        <label className={labelStyle}>Resumo Profissional*</label>
        <textarea
          rows={5}
          className={`${inputStyle} resize-y min-h-[120px]`}
          placeholder="Escreva um breve resumo destacando suas principais conquistas, tecnologias e objetivos profissionais..."
          value={form.resume}
          onChange={(e) => updateField("resume", e.target.value)}
        />
      </div>
    </section>
  );
}