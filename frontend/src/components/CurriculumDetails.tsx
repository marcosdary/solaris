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
    <div className="min-h-screen bg-bg-base">
      <div className="mx-auto max-w-6xl px-6 py-10">

        {/* HEADER */}
        <header className="mb-8 rounded-2xl border border-border-default bg-white p-4 sm:p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary">
                {curriculum.name}
              </h1>

              <p className="mt-2 text-lg sm:text-xl text-accent-horizon">
                {curriculum.role}
              </p>

              <div className="mt-5 flex flex-wrap gap-4 text-[15px] text-text-secondary">
                <span>{curriculum.email}</span>
                <span>{curriculum.phone}</span>
                <span>{curriculum.location}</span>
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
          <section className="rounded-2xl border border-border-default bg-white p-4 sm:p-6 md:p-8">
            <h2 className="mb-5 text-xl sm:text-2xl font-bold text-text-primary">
              Resumo Profissional
            </h2>

            <div className="prose max-w-none"/>
            <p>{curriculum.resume}</p>
         
          </section>

          {/* EXPERIÊNCIAS */}
          <section className="rounded-2xl border border-border-default bg-white p-4 sm:p-6 md:p-8">
            <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold text-text-primary">
              Experiência Profissional
            </h2>

            <div className="space-y-8">
              {curriculum.experiences.map((experience) => (
                <article key={experience.id}>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-lg text-text-primary">
                        {experience.role}
                      </h3>

                      <p className="text-accent-horizon">
                        {experience.company}
                      </p>

                      <p className="text-[15px] text-text-secondary">
                        {experience.location}
                      </p>
                    </div>

                    <div className="flex flex-col items-start sm:items-end gap-1 sm:gap-3">
                      <span className="text-[15px] text-text-secondary">
                        {experience.period}
                      </span>


                    </div>
                  </div>

                  <ul className="mt-4 list-disc space-y-2 pl-6">
                    {experience.activities.map((activity) => (
                      <li 
                      key={activity.id}
                      className="whitespace-pre-line text-text-primary"
                      >
                        {activity.description}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          {/* FORMAÇÃO */}
          <section className="rounded-2xl border border-border-default bg-white p-4 sm:p-6 md:p-8">
            <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold text-text-primary">
              Formação
            </h2>

            <div className="space-y-6">
              {curriculum.educations.map((education) => (
                <div key={education.id} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-text-primary">
                      {education.degree}
                    </h3>

                    <p className="text-[15px] text-text-secondary">{education.institution}</p>

                    <p className="text-[15px] text-text-secondary">
                      {education.location}
                    </p>

                    <p className="text-[15px] text-text-secondary">
                      {education.period}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </section>

          {/* PROJETOS */}
          {curriculum.projects.length > 0 && (
            <section className="rounded-2xl border border-border-default bg-white p-4 sm:p-6 md:p-8">
              <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold text-text-primary">
                Projetos
              </h2>

              <div className="space-y-8">
                {curriculum.projects.map((project) => (
                  <article key={project.id}>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-semibold text-text-primary">
                          {project.name}
                        </h3>

                        <span className="text-[15px] text-text-secondary">
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
                          className="text-[15px] text-accent-horizon transition hover:underline"
                        >
                          GitHub
                        </a>
                      )}

                      {project.demo_url && (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[15px] text-accent-horizon transition hover:underline"
                        >
                          Demo
                        </a>
                      )}
                    </div>

                    <ul className="mt-4 list-disc pl-6 space-y-2">
                      {project.descriptions.map((description) => (
                        <li 
                        key={description.id}
                        className="whitespace-pre-line text-text-primary"
                        >
                          {description.description}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.technologies.map((technology) => (
                        <span
                          key={technology.id}
                          className="rounded-full bg-accent-horizon/10 px-3 py-1 text-sm text-accent-horizon"
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
            <section className="rounded-2xl border border-border-default bg-white p-4 sm:p-6 md:p-8">
              <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold text-text-primary">
                Certificações
              </h2>

              <div className="space-y-5">
                {curriculum.certifications.map((certification) => (
                  <div key={certification.id} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-text-primary">
                        {certification.name}
                      </h3>

                      <p className="text-[15px] text-text-secondary">{certification.institution}</p>

                      <p className="text-[15px] text-text-secondary">
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
