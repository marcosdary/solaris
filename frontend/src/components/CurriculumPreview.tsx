import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { ICurriculumResponse, ICurriculumPDFResponse } from "../types/curriculumResponse";
import { generateCurriculumPDF } from "../services/curriculum";
import { GenerateCurriculumCard } from "./cards/GenerateCurriculumCard";

type TemplateType = "standard" | "modern";

const namesTemplates: Record<string, string> = {
  standard: "standard.html",
  modern: "modern.html"
}

interface Props {
  curriculum: ICurriculumResponse;
  token?: string;
}

const TEMPLATE_LABELS: Record<TemplateType, string> = {
  standard: "Standard",
  modern: "Modern",
};

function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

function getNameTemplate(template: TemplateType): string {
  return namesTemplates[template];
}

export function CurriculumPreview({ curriculum, token }: Props) {
  const [template, setTemplate] = useState<TemplateType>("standard");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<ICurriculumPDFResponse | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const nameTemplate = getNameTemplate(template);

  async function handleGeneratePDF() {
    setGenerating(true);
    setPdfError(null);
    setResult(null);

    try {
      const data = await generateCurriculumPDF(curriculum.id, nameTemplate, token);
      setResult(data);
    } catch (err) {
      setPdfError(err instanceof Error ? err.message : "Erro ao gerar PDF.");
    } finally {
      setGenerating(false);
    }
  }
  const isModern = template === "modern";
  const isEnglish = curriculum.language === "english";

  const labels = {
    summary: isEnglish ? "Summary" : "Resumo",
    experience: isEnglish ? "Professional Experience" : "Experiência Profissional",
    projects: isEnglish ? "Projects" : "Projetos",
    education: isEnglish ? "Education" : "Formação Acadêmica",
    certifications: isEnglish ? "Certifications" : "Certificações",
  };

  const sectionTitleClass = isModern
    ? "font-bold text-gray-900 uppercase tracking-wider mb-1.5"
    : "font-bold text-slate-900 uppercase tracking-wide mb-1.5";

  const sectionTitleStyle = { fontSize: isModern ? "9pt" : "10pt" } as const;

  const hrClass = isModern
    ? "border-gray-300/60"
    : "border-slate-200";

  const rowAlign = isModern ? "items-start" : "items-baseline";

  const companyClass = `font-bold ${isModern ? "text-gray-900" : "text-slate-800"}`;
  const companyStyle = { fontSize: isModern ? "8pt" : "9pt" } as const;

  const roleClass = isModern ? "text-gray-700 italic" : "font-semibold text-slate-600";
  const roleStyle = { fontSize: isModern ? "8pt" : "8.5pt" } as const;

  const periodStyle = { fontSize: isModern ? "8pt" : "8.5pt" } as const;

  const locationStyle = { fontSize: isModern ? "8pt" : "8.5pt" } as const;
  const locationClass = isModern ? "text-gray-500" : "text-slate-500 italic";

  const tagStyle = { fontSize: isModern ? "7pt" : "7.5pt" } as const;
  const tagClass = isModern
    ? "inline-block mr-1 mb-1 px-1.5 py-px font-semibold text-gray-600 border border-gray-300/50 rounded-sm"
    : "inline-block mr-1 mb-1 px-1.5 py-px font-semibold text-blue-800 bg-blue-50 rounded";

  const liStyle = { fontSize: isModern ? "8pt" : "8.5pt" } as const;
  const liClass = isModern ? "mb-px" : "text-slate-700 mb-0.5";

  const linkClass = isModern ? "text-gray-700" : "text-blue-600";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="inline-flex rounded-lg bg-white border border-slate-200 p-0.5 shadow-sm">
          {(Object.keys(TEMPLATE_LABELS) as TemplateType[]).map((t) => (
            <button
              key={t}
              onClick={() => setTemplate(t)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${
                template === t
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {TEMPLATE_LABELS[t]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {pdfError && (
            <p className="text-sm text-red-600">{pdfError}</p>
          )}

          <button
            onClick={handleGeneratePDF}
            disabled={generating}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
          >
            {generating ? (
              <Loader2 size={14} className="animate-spin" />
            ) : null}
            {generating ? "Gerando..." : "Gerar PDF"}
          </button>
        </div>
      </div>

      {result && (
        <GenerateCurriculumCard
          data={result}
          onClose={() => setResult(null)}
        />
      )}

      <div
        className={`mx-auto max-w-[210mm] bg-white shadow-2xl ${
          isModern ? "font-serif" : "font-sans"
        } text-slate-700`}
        style={{ padding: isModern ? "1.6cm" : "1.2cm 1.4cm" }}
      >
        {/* ── HEADER ── */}
        <header className={`mb-4 ${isModern ? "text-center" : "text-left"}`}>
          <h1
            style={{ fontSize: isModern ? "16pt" : "17pt" }}
            className={`m-0 font-bold leading-tight ${
              isModern ? "text-gray-900 tracking-wide" : "text-slate-900 tracking-tight"
            }`}
          >
            {curriculum.name}
          </h1>

          <div
            style={{ fontSize: isModern ? "9pt" : "10pt" }}
            className={isModern ? "mt-1 text-gray-500 italic" : "font-semibold text-blue-600"}
          >
            {curriculum.role}
          </div>

          <div
            style={{ fontSize: isModern ? "8pt" : "8.5pt" }}
            className={isModern ? "mt-2 text-gray-600" : "text-slate-500"}
          >
            {isModern
              ? `${curriculum.email} \u2022 ${curriculum.linkedin} \u2022 ${curriculum.phone} \u2022 ${curriculum.location}`
              : `${curriculum.email} \u2022 ${curriculum.phone} \u2022 ${curriculum.location}${curriculum.linkedin ? ` \u2022 ${curriculum.linkedin}` : ""}`}
          </div>

          {curriculum.github && (
            <div style={{ fontSize: isModern ? "8pt" : "8.5pt" }} className="mt-1">
              <a
                href={curriculum.github}
                className={linkClass}
                style={{ textDecoration: "none" }}
              >
                {curriculum.github}
              </a>
            </div>
          )}
        </header>

        <hr className={`${hrClass} my-2.5`} />

        {/* ── SUMMARY ── */}
        <section className="mb-2.5">
          <div className={sectionTitleClass} style={sectionTitleStyle}>
            {labels.summary}
          </div>
          <div
            style={{ fontSize: isModern ? "8pt" : "8.5pt" }}
            className={isModern ? "text-justify" : ""}
          >
            {stripHtml(curriculum.resume)}
          </div>
        </section>

        <hr className={`${hrClass} my-2.5`} />

        {/* ── EXPERIENCES ── */}
        <section className="mb-2.5">
          <div className={sectionTitleClass} style={sectionTitleStyle}>
            {labels.experience}
          </div>

          {curriculum.experiences.map((exp) => (
            <article key={exp.id} className="mb-2">
              <div className={`flex justify-between ${rowAlign} mb-px`}>
                <div className={companyClass} style={companyStyle}>
                  {exp.company}
                </div>
                <div className="font-medium text-slate-500" style={periodStyle}>
                  {exp.period}
                </div>
              </div>

              <div className={`flex justify-between ${rowAlign}`}>
                <div className={roleClass} style={roleStyle}>
                  {exp.role}
                </div>
                <div className={locationClass} style={locationStyle}>
                  {exp.location}
                </div>
              </div>

              <ul style={{ margin: "2px 0 0 14px" }} className="list-disc p-0">
                {exp.activities.map((act) => (
                  <li key={act.id} className={liClass} style={liStyle}>
                    {stripHtml(act.description)}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        {/* ── PROJECTS ── */}
        {curriculum.projects.length > 0 && (
          <>
            <hr className={`${hrClass} my-2.5`} />

            <section className="mb-2.5">
              <div className={sectionTitleClass} style={sectionTitleStyle}>
                {labels.projects}
              </div>

              {curriculum.projects.map((proj) => (
                <article key={proj.id} className="mb-2">
                  <div className={`flex justify-between ${rowAlign} mb-px`}>
                    <div className={companyClass} style={companyStyle}>
                      {proj.name}
                    </div>
                    <div className="font-medium text-slate-500" style={periodStyle}>
                      {proj.period}
                    </div>
                  </div>

                  {proj.github && (
                    <div style={{ fontSize: isModern ? "8pt" : "8.5pt" }} className="mt-1">
                      GitHub:{" "}
                      <a href={proj.github} className={linkClass} style={{ textDecoration: "none" }}>
                        {proj.github}
                      </a>
                    </div>
                  )}

                  {proj.demo_url && (
                    <div style={{ fontSize: isModern ? "8pt" : "8.5pt" }} className="mt-1">
                      Demo:{" "}
                      <a href={proj.demo_url} className={linkClass} style={{ textDecoration: "none" }}>
                        {proj.demo_url}
                      </a>
                    </div>
                  )}

                  {proj.technologies.length > 0 && (
                    <div className={isModern ? "mt-1.5" : "mt-1"}>
                      {proj.technologies.map((tech) => (
                        <span key={tech.id} className={tagClass} style={tagStyle}>
                          {tech.technology}
                        </span>
                      ))}
                    </div>
                  )}

                  <ul style={{ margin: "2px 0 0 14px" }} className="list-disc p-0">
                    {proj.descriptions.map((desc) => (
                      <li key={desc.id} className={liClass} style={liStyle}>
                        {stripHtml(desc.description)}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </section>
          </>
        )}

        <hr className={`${hrClass} my-2.5`} />

        {/* ── EDUCATION ── */}
        <section className="mb-2.5">
          <div className={sectionTitleClass} style={sectionTitleStyle}>
            {labels.education}
          </div>

          {curriculum.educations.map((edu) => (
            <div key={edu.id} className="mb-2">
              <div className={`flex justify-between ${rowAlign} mb-px`}>
                <div className={companyClass} style={companyStyle}>
                  {edu.institution}
                </div>
                <div className="font-medium text-slate-500" style={periodStyle}>
                  {edu.period}
                </div>
              </div>

              <div className={`flex justify-between ${rowAlign}`}>
                <div className={roleClass} style={roleStyle}>
                  {edu.degree}
                </div>
                <div className={locationClass} style={locationStyle}>
                  {edu.location}
                </div>
              </div>
            </div>
          ))}
        </section>

        <hr className={`${hrClass} my-2.5`} />

        {/* ── CERTIFICATIONS ── */}
        {curriculum.certifications.length > 0 && (
          <section className="mb-2.5">
            <div className={sectionTitleClass} style={sectionTitleStyle}>
              {labels.certifications}
            </div>

            {curriculum.certifications.map((cert) => (
              <div key={cert.id} className="mb-2">
                <div className={`flex justify-between ${rowAlign} mb-px`}>
                  <div className={companyClass} style={companyStyle}>
                    {cert.name}
                  </div>
                  <div className="font-medium text-slate-500" style={periodStyle}>
                    {cert.period}
                  </div>
                </div>

                <div className={`flex justify-between ${rowAlign}`}>
                  <div className={roleClass} style={roleStyle}>
                    {cert.institution}
                  </div>
                  <div className={locationClass} style={locationStyle}>
                    {cert.location}
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
