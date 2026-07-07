import { useState } from "react";
import type { IEducationInput } from "../types/curriculumCreate";

export interface UseEducationsReturn<T extends IEducationInput> {
  educations: T[];
  add(): void;
  remove(index: number): void;
  restore(index: number): void;
  update(
    index: number,
    field: keyof IEducationInput,
    value: string | null
  ): void;
  visible(): T[];
  isEmpty(): boolean;
}

interface UseEducationsOptions<T extends IEducationInput> {
  mode: "create" | "edit";
  initial?: T[];
}

const EMPTY_EDUCATION: IEducationInput = {
  institution: "",
  degree: "",
  location: "",
  start_date: "",
  end_date: null,
};

export function useEducations<T extends IEducationInput>({
  mode,
  initial = [],
}: UseEducationsOptions<T>): UseEducationsReturn<T> {
  const [educations, setEducations] = useState<T[]>(initial);

  function add() {
    setEducations((prev) => [...prev, { ...EMPTY_EDUCATION } as T]);
  }

  function remove(index: number) {
    if (mode === "create") {
      setEducations((prev) => prev.filter((_, i) => i !== index));
    } else {
      setEducations((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, depreciated: true } : item
        )
      );
    }
  }

  function restore(index: number) {
    setEducations((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, depreciated: false } : item
      )
    );
  }

  function update(
    index: number,
    field: keyof IEducationInput,
    value: string | null
  ) {
    setEducations((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  }

  function visible() {
    return educations.filter((e) => !e.depreciated);
  }

  function isEmpty() {
    return visible().length === 0;
  }

  return { educations, add, remove, restore, update, visible, isEmpty };
}
