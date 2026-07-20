import { useState } from "react";
import type {
  IExperienceActivityInput,
  IExperienceInput,
} from "../types/curriculumCreate";
import type { IExperienceEditPayload } from "../types/curriculumEditPayload";

export interface UseExperiencesReturn<T extends IExperienceInput> {
  experiences: T[];
  add(): void;
  remove(index: number): void;
  restore(index: number): void;
  update(
    index: number,
    field: keyof Omit<IExperienceInput, "activities">,
    value: string | null
  ): void;
  addActivity(expIndex: number): void;
  removeActivity(expIndex: number, actIndex: number): void;
  updateActivity(
    expIndex: number,
    actIndex: number,
    value: string
  ): void;
  visible(): T[];
  isEmpty(): boolean;
  getExperiences(): IExperienceEditPayload[]
}

interface UseExperiencesOptions<T extends IExperienceInput> {
  mode: "create" | "edit";
  initial?: T[];
}

const EMPTY_EXPERIENCE: IExperienceInput = {
  role: "",
  company: "",
  location: "",
  start_date: "",
  end_date: null,
  activities: [],
};

export function useExperiences<T extends IExperienceInput>({
  mode,
  initial = [],
}: UseExperiencesOptions<T>): UseExperiencesReturn<T> {
  const [experiences, setExperiences] = useState<T[]>(initial);

  function add() {
    setExperiences((prev) => [...prev, { ...EMPTY_EXPERIENCE } as T]);
  }

  function remove(index: number) {
    if (mode === "create") {
      setExperiences((prev) => prev.filter((_, i) => i !== index));
    } else {
      setExperiences((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, depreciated: true } : item
        )
      );
    }
  }

  function restore(index: number) {
    setExperiences((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, depreciated: false } : item
      )
    );
  }

  function update(
    index: number,
    field: keyof Omit<IExperienceInput, "activities">,
    value: string | null
  ) {
    setExperiences((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  }

  function addActivity(expIndex: number) {
    setExperiences((prev) =>
      prev.map((item, i) =>
        i === expIndex
          ? {
              ...item,
              activities: [
                ...item.activities,
                { description: "" } as IExperienceActivityInput,
              ],
            }
          : item
      )
    );
  }

  function removeActivity(expIndex: number, actIndex: number) {
    setExperiences((prev) =>
      prev.map((item, i) =>
        i === expIndex
          ? {
              ...item,
              activities: item.activities.filter(
                (_, idx) => idx !== actIndex
              ),
            }
          : item
      )
    );
  }

  function updateActivity(
    expIndex: number,
    actIndex: number,
    value: string
  ) {
    setExperiences((prev) =>
      prev.map((item, i) => {
        if (i !== expIndex) return item;
        const activities = [
          ...item.activities,
        ] as IExperienceActivityInput[];
        activities[actIndex] = {
          ...activities[actIndex],
          description: value,
        };
        return { ...item, activities };
      })
    );
  }

  function visible() {
    return experiences.filter((e) => !e.depreciated);
  }

  function getExperiences(): IExperienceEditPayload[] {
    const experiences = visible();
    return experiences.map((item) => ({
      id: item.id,
      role: item.role,
      company: item.company,
      location: item.location,
      start_date: item.start_date,
      end_date: item.end_date ?? null,
      activities: item.activities.map((item) => ({
        id: item.id,
        description: item.description
      }))
    }));
  }

  function isEmpty() {
    return visible().length === 0;
  }

  return {
    experiences,
    add,
    remove,
    restore,
    update,
    addActivity,
    removeActivity,
    updateActivity,
    visible,
    getExperiences,
    isEmpty,
  };
}
