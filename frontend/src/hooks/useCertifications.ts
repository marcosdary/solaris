import { useState } from "react";
import type { ICertificationInput } from "../types/curriculumCreate";
import type { ICertificationEditPayload } from "../types/curriculumEditPayload";

export interface UseCertificationsReturn<T extends ICertificationInput> {
  certifications: T[];
  add(): void;
  remove(index: number): void;
  restore(index: number): void;
  update(
    index: number,
    field: keyof ICertificationInput,
    value: string | null
  ): void;
  visible(): T[];
  getCertifications(): ICertificationEditPayload[];
  isEmpty(): boolean;
}

interface UseCertificationsOptions<T extends ICertificationInput> {
  mode: "create" | "edit";
  initial?: T[];
}

const EMPTY_CERTIFICATION: ICertificationInput = {
  institution: "",
  name: "",
  location: "",
  start_date: "",
  end_date: null,
};

export function useCertifications<T extends ICertificationInput>({
  mode,
  initial = [],
}: UseCertificationsOptions<T>): UseCertificationsReturn<T> {
  const [certifications, setCertifications] = useState<T[]>(initial);

  function add() {
    setCertifications((prev) => [...prev, { ...EMPTY_CERTIFICATION } as T]);
  }

  function remove(index: number) {
    if (mode === "create") {
      setCertifications((prev) => prev.filter((_, i) => i !== index));
    } else {
      setCertifications((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, depreciated: true } : item
        )
      );
    }
  }

  function restore(index: number) {
    setCertifications((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, depreciated: false } : item
      )
    );
  }

  function update(
    index: number,
    field: keyof ICertificationInput,
    value: string | null
  ) {
    setCertifications((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  }

  function visible() {
    return certifications.filter((c) => !c.depreciated);
  }

  function getCertifications(): ICertificationEditPayload[] {
    const certifications = visible();
    return certifications.map((item) => ({
      id: item.id,
      institution: item.institution,
      name: item.name,
      location: item.location,
      start_date: item.start_date,
      end_date: item.end_date ?? null
    }))
      
  }

  function isEmpty() {
    return visible().length === 0;
  }

  return { 
    certifications, 
    add, 
    remove, 
    restore, 
    update, 
    visible,
    getCertifications, 
    isEmpty 
  };
}
