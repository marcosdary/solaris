import type { IProjectInput } from "../../types/curriculumCreate";
import type { UseProjectsReturn } from "../../hooks/useProjects";

interface ProjectFormProps extends UseProjectsReturn<IProjectInput> {
  mode: "create" | "edit";
}

export function ProjectForm({
  projects,
  mode,
  add,
  remove,
  restore,
  update,
  addDescription,
  removeDescription,
  updateDescription,
  addTechnology,
  removeTechnology,
  updateTechnology,
}: ProjectFormProps) {
  return (
    <section className="space-y-6 py-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">Projetos</h2>

        <button
          type="button"
          onClick={add}
          className="rounded-lg bg-accent-horizon px-4 py-2 text-sm text-white transition hover:brightness-110"
        >
          + Adicionar Projeto
        </button>
      </div>

      {projects.length === 0 && (
        <p className="text-[15px] text-text-secondary">Nenhum projeto adicionado.</p>
      )}

      {projects.map((project, projectIndex) => {
        const isExcluded = mode === "edit" && project.depreciated;

        return (
          <div
            key={projectIndex}
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
                Projeto {projectIndex + 1}
                {isExcluded && (
                  <span className="ml-2 text-xs font-normal text-red-600">
                    (Removido)
                  </span>
                )}
              </h3>

              {isExcluded ? (
                <button
                  type="button"
                  onClick={() => restore(projectIndex)}
                  className="text-sm text-green-600 transition hover:text-green-700"
                >
                  Restaurar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => remove(projectIndex)}
                  className="text-sm text-red-600 transition hover:text-red-700"
                >
                  Remover
                </button>
              )}
            </div>

            <input
              className="w-full rounded-md border border-border-default bg-transparent p-3 text-[15px] text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
              placeholder="Nome"
              value={project.name}
              onChange={(e) => update(projectIndex, "name", e.target.value)}
              disabled={!!isExcluded}
            />

            <input
              className="w-full rounded-md border border-border-default bg-transparent p-3 text-[15px] text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
              placeholder="GitHub"
              value={project.github ?? ""}
              onChange={(e) =>
                update(projectIndex, "github", e.target.value || null)
              }
              disabled={!!isExcluded}
            />

            <input
              className="w-full rounded-md border border-border-default bg-transparent p-3 text-[15px] text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
              placeholder="Demo"
              value={project.demo_url ?? ""}
              onChange={(e) =>
                update(projectIndex, "demo_url", e.target.value || null)
              }
              disabled={!!isExcluded}
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                className="rounded-md border border-border-default bg-transparent p-3 text-[15px] text-text-primary focus:border-accent-primary focus:outline-none"
                value={project.start_date}
                onChange={(e) =>
                  update(projectIndex, "start_date", e.target.value)
                }
                disabled={!!isExcluded}
              />

              <input
                type="date"
                className="rounded-md border border-border-default bg-transparent p-3 text-[15px] text-text-primary focus:border-accent-primary focus:outline-none"
                value={project.end_date ?? ""}
                onChange={(e) =>
                  update(projectIndex, "end_date", e.target.value || null)
                }
                disabled={!!isExcluded}
              />
            </div>

            {!isExcluded && (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[15px] font-medium text-text-primary">Descrições</h4>

                    <button
                      type="button"
                      onClick={() => addDescription(projectIndex)}
                      className="text-sm font-medium text-accent-horizon transition hover:brightness-110"
                    >
                      + Adicionar
                    </button>
                  </div>

                  {project.descriptions.map((description, index) => (
                    <div key={index} className="flex gap-3">
                      <input
                        className="flex-1 rounded-md border border-border-default bg-transparent p-3 text-[15px] text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
                        value={description.description}
                        onChange={(e) =>
                          updateDescription(
                            projectIndex,
                            index,
                            e.target.value
                          )
                        }
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeDescription(projectIndex, index)
                        }
                        className="rounded-md px-3 py-2 text-red-600 transition hover:bg-red-50"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[15px] font-medium text-text-primary">Tecnologias</h4>

                    <button
                      type="button"
                      onClick={() => addTechnology(projectIndex)}
                      className="text-sm font-medium text-accent-horizon transition hover:brightness-110"
                    >
                      + Adicionar
                    </button>
                  </div>

                  {project.technologies.map((technology, index) => (
                    <div key={index} className="flex gap-3">
                      <input
                        className="flex-1 rounded-md border border-border-default bg-transparent p-3 text-[15px] text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
                        value={technology.technology}
                        onChange={(e) =>
                          updateTechnology(
                            projectIndex,
                            index,
                            e.target.value
                          )
                        }
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeTechnology(projectIndex, index)
                        }
                        className="rounded-md px-3 py-2 text-red-600 transition hover:bg-red-50"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        );
      })}
    </section>
  );
}
