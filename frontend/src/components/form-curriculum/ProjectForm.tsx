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
    <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Projetos</h2>

        <button
          type="button"
          onClick={add}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          + Adicionar Projeto
        </button>
      </div>

      {projects.length === 0 && (
        <p className="text-sm text-slate-500">Nenhum projeto adicionado.</p>
      )}

      {projects.map((project, projectIndex) => {
        const isExcluded = mode === "edit" && project.depreciated;

        return (
          <div
            key={projectIndex}
            className={`space-y-5 rounded-xl border p-5 ${
              isExcluded
                ? "border-slate-200 bg-slate-100 opacity-50"
                : "border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3
                className={`font-medium ${isExcluded ? "line-through" : ""}`}
              >
                Projeto {projectIndex + 1}
                {isExcluded && (
                  <span className="ml-2 text-xs font-normal text-red-500">
                    (Removido)
                  </span>
                )}
              </h3>

              {isExcluded ? (
                <button
                  type="button"
                  onClick={() => restore(projectIndex)}
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  Restaurar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => remove(projectIndex)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remover
                </button>
              )}
            </div>

            <input
              className="w-full rounded-lg border p-2"
              placeholder="Nome"
              value={project.name}
              onChange={(e) => update(projectIndex, "name", e.target.value)}
              disabled={!!isExcluded}
            />

            <input
              className="w-full rounded-lg border p-2"
              placeholder="GitHub"
              value={project.github ?? ""}
              onChange={(e) =>
                update(projectIndex, "github", e.target.value || null)
              }
              disabled={!!isExcluded}
            />

            <input
              className="w-full rounded-lg border p-2"
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
                className="rounded-lg border p-2"
                value={project.start_date}
                onChange={(e) =>
                  update(projectIndex, "start_date", e.target.value)
                }
                disabled={!!isExcluded}
              />

              <input
                type="date"
                className="rounded-lg border p-2"
                value={project.end_date ?? ""}
                onChange={(e) =>
                  update(projectIndex, "end_date", e.target.value || null)
                }
                disabled={!!isExcluded}
              />
            </div>

            {!isExcluded && (
              <>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Descrições</h4>

                    <button
                      type="button"
                      onClick={() => addDescription(projectIndex)}
                      className="text-blue-600"
                    >
                      + Adicionar
                    </button>
                  </div>

                  {project.descriptions.map((description, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        className="flex-1 rounded-lg border p-2"
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
                        className="text-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Tecnologias</h4>

                    <button
                      type="button"
                      onClick={() => addTechnology(projectIndex)}
                      className="text-blue-600"
                    >
                      + Adicionar
                    </button>
                  </div>

                  {project.technologies.map((technology, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        className="flex-1 rounded-lg border p-2"
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
                        className="text-red-600"
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
