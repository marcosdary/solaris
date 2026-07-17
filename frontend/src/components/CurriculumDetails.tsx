import { Link } from "react-router-dom";

import type { ICurriculumResponse } from "../types/curriculumResponse";
import { ActionButtons } from "./ButtonActions";

interface Props {
  curriculum: ICurriculumResponse;
  onDelete(): void;
}

export function CurriculumDetails({
  curriculum,
  onDelete,
}: Props) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-10">

        {/* HEADER */}
        <header className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

            {/* NAVEGAÇÃO */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">

              <div className="flex flex-wrap items-center gap-3">

                <Link
                  to="/"
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
                >
                  ← Home
                </Link>

                <Link
                  to="/curriculums"
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
                >
                  📄 Lista de Currículos
                </Link>

              </div>

            </div>

            <div>
              <h1 className="text-4xl font-bold text-slate-900">
                {curriculum.name}
              </h1>

              <p className="mt-2 text-xl text-blue-600">
                {curriculum.role}
              </p>

              <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-600">
                <span>📧 {curriculum.email}</span>
                <span>📱 {curriculum.phone}</span>
                <span>📍 {curriculum.location}</span>
              </div>
            </div>

            <div className="mt-5">
              <ActionButtons
                onDelete={onDelete}
                data={curriculum}
              />
            </div>

          </div>
        </header>

        {/* GRID */}
        <div className="grid gap-8">

          {/* RESUMO */}
          <section className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="mb-5 text-2xl font-bold">
              Resumo Profissional
            </h2>

            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: curriculum.resume,
              }}
            />
          </section>

          {/* EXPERIÊNCIAS */}
          <section className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">
              Experiência Profissional
            </h2>

            <div className="space-y-8">
              {curriculum.experiences.map((experience) => (
                <article key={experience.id}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {experience.role}
                      </h3>

                      <p className="text-blue-600">
                        {experience.company}
                      </p>

                      <p className="text-sm text-slate-500">
                        {experience.location}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <span className="text-sm text-slate-500">
                        {experience.period}
                      </span>

    
                    </div>
                  </div>

                  <ul className="mt-4 list-disc space-y-2 pl-6">
                    {experience.activities.map((activity) => (
                      <li key={activity.id}>
                        <div
                            className="prose max-w-none"
                            dangerouslySetInnerHTML={{
                              __html: activity.description,
                            }}
                          />
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          {/* FORMAÇÃO */}
          <section className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">
              Formação
            </h2>

            <div className="space-y-6">
              {curriculum.educations.map((education) => (
                <div key={education.id} className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">
                      {education.degree}
                    </h3>

                    <p>{education.institution}</p>

                    <p className="text-sm text-slate-500">
                      {education.location}
                    </p>

                    <p className="text-sm text-slate-500">
                      {education.period}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </section>

          {/* PROJETOS */}
          {curriculum.projects.length > 0 && (
            <section className="rounded-2xl bg-white p-8 shadow-sm">
              <h2 className="mb-6 text-2xl font-bold">
                Projetos
              </h2>

              <div className="space-y-8">
                {curriculum.projects.map((project) => (
                  <article key={project.id}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {project.name}
                        </h3>

                        <span className="text-sm text-slate-500">
                          {project.period}
                        </span>
                      </div>

                    </div>

                    <div className="mt-3 flex gap-3">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          GitHub
                        </a>
                      )}

                      {project.demo_url && (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Demo
                        </a>
                      )}
                    </div>

                    <ul className="mt-4 list-disc pl-6 space-y-2">
                      {project.descriptions.map((description) => (
                        <li key={description.id}>
                          <div
                            className="prose max-w-none"
                            dangerouslySetInnerHTML={{
                              __html: description.description,
                            }}
                          />
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.technologies.map((technology) => (
                        <span
                          key={technology.id}
                          className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                        >
                          {technology.technology}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* CERTIFICAÇÕES */}
          {curriculum.certifications.length > 0 && (
            <section className="rounded-2xl bg-white p-8 shadow-sm">
              <h2 className="mb-6 text-2xl font-bold">
                Certificações
              </h2>

              <div className="space-y-5">
                {curriculum.certifications.map((certification) => (
                  <div key={certification.id} className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">
                        {certification.name}
                      </h3>

                      <p>{certification.institution}</p>

                      <p className="text-sm text-slate-500">
                        {certification.period}
                      </p>
                    </div>

                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

      </div>
    </div>
  );
}