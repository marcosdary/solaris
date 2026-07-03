import type { Dispatch, SetStateAction } from "react";
import type {
  IProjectInput,
} from "../../types/cv-input";

interface ProjectFormProps {
  projects: IProjectInput[];
  setProjects: Dispatch<SetStateAction<IProjectInput[]>>;
}

export function ProjectForm({
  projects,
  setProjects,
}: ProjectFormProps) {
  function addProject() {
    setProjects((old) => [
      ...old,
      {
        name: "",
        github: null,
        demo_url: null,
        start_date: "",
        end_date: null,
        descriptions: [],
        technologies: [],
      },
    ]);
  }

  function removeProject(index: number) {
    setProjects((old) => old.filter((_, i) => i !== index));
  }

  function updateProject(
    index: number,
    field: keyof IProjectInput,
    value: string | null
  ) {
    setProjects((old) =>
      old.map((project, i) =>
        i === index
          ? {
              ...project,
              [field]: value,
            }
          : project
      )
    );
  }

  function addDescription(projectIndex: number) {
    setProjects((old) =>
      old.map((project, i) =>
        i === projectIndex
          ? {
              ...project,
              descriptions: [
                ...project.descriptions,
                {
                  description: "",
                },
              ],
            }
          : project
      )
    );
  }

  function updateDescription(
    projectIndex: number,
    descriptionIndex: number,
    value: string
  ) {
    setProjects((old) =>
      old.map((project, i) => {
        if (i !== projectIndex) return project;

        const descriptions = [...project.descriptions];
        descriptions[descriptionIndex] = {
          ...descriptions[descriptionIndex],
          description: value,
        };

        return {
          ...project,
          descriptions,
        };
      })
    );
  }

  function removeDescription(
    projectIndex: number,
    descriptionIndex: number
  ) {
    setProjects((old) =>
      old.map((project, i) =>
        i === projectIndex
          ? {
              ...project,
              descriptions: project.descriptions.filter(
                (_, idx) => idx !== descriptionIndex
              ),
            }
          : project
      )
    );
  }

  function addTechnology(projectIndex: number) {
    setProjects((old) =>
      old.map((project, i) =>
        i === projectIndex
          ? {
              ...project,
              technologies: [
                ...project.technologies,
                {
                  technology: "",
                },
              ],
            }
          : project
      )
    );
  }

  function updateTechnology(
    projectIndex: number,
    technologyIndex: number,
    value: string
  ) {
    setProjects((old) =>
      old.map((project, i) => {
        if (i !== projectIndex) return project;

        const technologies = [...project.technologies];
        technologies[technologyIndex] = {
          ...technologies[technologyIndex],
          technology: value,
        };

        return {
          ...project,
          technologies,
        };
      })
    );
  }

  function removeTechnology(
    projectIndex: number,
    technologyIndex: number
  ) {
    setProjects((old) =>
      old.map((project, i) =>
        i === projectIndex
          ? {
              ...project,
              technologies: project.technologies.filter(
                (_, idx) => idx !== technologyIndex
              ),
            }
          : project
      )
    );
  }

  return (
    <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">
          Projetos
        </h2>

        <button
          type="button"
          onClick={addProject}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          + Adicionar Projeto
        </button>
      </div>

      {projects.length === 0 && (
        <p className="text-sm text-slate-500">
          Nenhum projeto adicionado.
        </p>
      )}

      {projects.map((project, projectIndex) => (
        <div
          key={projectIndex}
          className="space-y-5 rounded-xl border border-slate-200 p-5"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-medium">
              Projeto {projectIndex + 1}
            </h3>

            <button
              type="button"
              onClick={() => removeProject(projectIndex)}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Remover
            </button>
          </div>

          <input
            className="w-full rounded-lg border p-2"
            placeholder="Nome"
            value={project.name}
            onChange={(e) =>
              updateProject(projectIndex, "name", e.target.value)
            }
          />

          <input
            className="w-full rounded-lg border p-2"
            placeholder="GitHub"
            value={project.github ?? ""}
            onChange={(e) =>
              updateProject(
                projectIndex,
                "github",
                e.target.value || null
              )
            }
          />

          <input
            className="w-full rounded-lg border p-2"
            placeholder="Demo"
            value={project.demo_url ?? ""}
            onChange={(e) =>
              updateProject(
                projectIndex,
                "demo_url",
                e.target.value || null
              )
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              className="rounded-lg border p-2"
              value={project.start_date}
              onChange={(e) =>
                updateProject(
                  projectIndex,
                  "start_date",
                  e.target.value
                )
              }
            />

            <input
              type="date"
              className="rounded-lg border p-2"
              value={project.end_date ?? ""}
              onChange={(e) =>
                updateProject(
                  projectIndex,
                  "end_date",
                  e.target.value || null
                )
              }
            />
          </div>

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
              <div
                key={index}
                className="flex gap-2"
              >
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
              <div
                key={index}
                className="flex gap-2"
              >
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
        </div>
      ))}
    </section>
  );
}