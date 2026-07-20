import { useState } from "react";
import type {
  IProjectDescriptionInput,
  IProjectInput,
  IProjectTechnologyInput,
} from "../types/curriculumCreate";
import type { 
  IProjectEditPayload
} from "../types/curriculumEditPayload";

export interface UseProjectsReturn<T extends IProjectInput> {
  projects: T[];
  add(): void;
  remove(index: number): void;
  restore(index: number): void;
  update(
    index: number,
    field: keyof IProjectInput,
    value: string | null
  ): void;
  addDescription(projectIndex: number): void;
  removeDescription(projectIndex: number, descIndex: number): void;
  updateDescription(
    projectIndex: number,
    descIndex: number,
    value: string
  ): void;
  addTechnology(projectIndex: number): void;
  removeTechnology(projectIndex: number, techIndex: number): void;
  updateTechnology(
    projectIndex: number,
    techIndex: number,
    value: string
  ): void;
  visible(): T[];
  isEmpty(): boolean;
  getProjects(): IProjectEditPayload[];
}

interface UseProjectsOptions<T extends IProjectInput> {
  mode: "create" | "edit";
  initial?: T[];
}

const EMPTY_PROJECT: IProjectInput = {
  name: "",
  github: null,
  demo_url: null,
  start_date: "",
  end_date: null,
  descriptions: [],
  technologies: [],
};

export function useProjects<T extends IProjectInput>({
  mode,
  initial = [],
}: UseProjectsOptions<T>): UseProjectsReturn<T> {
  const [projects, setProjects] = useState<T[]>(initial);

  function add() {
    setProjects((prev) => [...prev, { ...EMPTY_PROJECT } as T]);
  }

  function remove(index: number) {
    if (mode === "create") {
      setProjects((prev) => prev.filter((_, i) => i !== index));
    } else {
      setProjects((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, depreciated: true } : item
        )
      );
    }
  }

  function restore(index: number) {
    setProjects((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, depreciated: false } : item
      )
    );
  }

  function update(
    index: number,
    field: keyof IProjectInput,
    value: string | null
  ) {
    setProjects((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  }

  function addDescription(projectIndex: number) {
    setProjects((prev) =>
      prev.map((item, i) =>
        i === projectIndex
          ? {
              ...item,
              descriptions: [
                ...item.descriptions,
                { description: "" } as IProjectDescriptionInput,
              ],
            }
          : item
      )
    );
  }

  function removeDescription(projectIndex: number, descIndex: number) {
    setProjects((prev) =>
      prev.map((item, i) =>
        i === projectIndex
          ? {
              ...item,
              descriptions: item.descriptions.filter(
                (_, idx) => idx !== descIndex
              ),
            }
          : item
      )
    );
  }

  function updateDescription(
    projectIndex: number,
    descIndex: number,
    value: string
  ) {
    setProjects((prev) =>
      prev.map((item, i) => {
        if (i !== projectIndex) return item;
        const descriptions = [
          ...item.descriptions,
        ] as IProjectDescriptionInput[];
        descriptions[descIndex] = {
          ...descriptions[descIndex],
          description: value,
        };
        return { ...item, descriptions };
      })
    );
  }

  function addTechnology(projectIndex: number) {
    setProjects((prev) =>
      prev.map((item, i) =>
        i === projectIndex
          ? {
              ...item,
              technologies: [
                ...item.technologies,
                { technology: "" } as IProjectTechnologyInput,
              ],
            }
          : item
      )
    );
  }

  function removeTechnology(projectIndex: number, techIndex: number) {
    setProjects((prev) =>
      prev.map((item, i) =>
        i === projectIndex
          ? {
              ...item,
              technologies: item.technologies.filter(
                (_, idx) => idx !== techIndex
              ),
            }
          : item
      )
    );
  }

  function updateTechnology(
    projectIndex: number,
    techIndex: number,
    value: string
  ) {
    setProjects((prev) =>
      prev.map((item, i) => {
        if (i !== projectIndex) return item;
        const technologies = [
          ...item.technologies,
        ] as IProjectTechnologyInput[];
        technologies[techIndex] = {
          ...technologies[techIndex],
          technology: value,
        };
        return { ...item, technologies };
      })
    );
  }

  function visible() {
    return projects.filter((p) => !p.depreciated);
  }

  function getProjects(): IProjectEditPayload[] {
    const projects = visible();
    return projects.map((item) => ({
      id: item.id,
      name: item.name,
      github: item.github ?? null,
      demo_url: item.demo_url ?? null,
      start_date: item.start_date,
      end_date: item.end_date ?? null,
      descriptions: item.descriptions.map((item) => ({
        id: item.id,
        description: item.description
      })),
      technologies: item.technologies.map((item) => ({
        id: item.id,
        technology: item.technology
      }))
    }));
  }

  function isEmpty() {
    return visible().length === 0;
  }

  return {
    projects,
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
    visible,
    getProjects,
    isEmpty,
  };
}
