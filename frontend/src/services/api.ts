import { settings } from "../config/settings";
import type { ICurriculumResponse } from "../types/curriculumResponse";
import type { ICurriculumInput, SearchCurriculums } from "../types/curriculumCreate";
import type { ICurriculumEditPayload } from "../types/curriculumEditPayload";
import type { ILoginInput, IRegisterInput, IAuthResponse } from "../types/auth";
 
export async function createCurriculum(
    form: ICurriculumInput,
    token?: string
): Promise<ICurriculumResponse> {
    
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
        `${settings.baseURL}/api/v1/cv`,
        {
            method: "POST",
            headers,
            body: JSON.stringify(form),
        }
    );

    if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
    }

    return await response.json();
}

export async function searchCurriculums(
    payload: SearchCurriculums,
    token?: string
): Promise<ICurriculumResponse[]> {
    const params = new URLSearchParams();

    if (payload.category) {
        params.append("category", payload.category);
    }

    if (payload.language) {
        params.append("language", payload.language);
    }

    const headers: Record<string, string> = {};

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
        `${settings.baseURL}/api/v1/curriculums/users?${params.toString()}`,
        {
        method: "GET",
        headers,
        }
    );

    if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
    }

    return await response.json();
}

export async function selectCurriculumByID(
    id: string,
    token?: string
): Promise<ICurriculumResponse> {

    const headers: Record<string, string> = {};

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
        `${settings.baseURL}/api/v1/curriculums/${id}`,
        {
        method: "GET",
        headers,
        }
    );

    if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
    }

    return await response.json();
}

export async function deleteCurriculum(
    id: string,
    token?: string
): Promise<void> {

    const headers: Record<string, string> = {};

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
        `${settings.baseURL}/api/v1/cv/${id}`,
        {
        method: "DELETE",
        headers,
        }
    );

    if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
    }

    return;
}


export async function updateCurriculum(
    form: ICurriculumEditPayload,
    curriculumId: string,
    token?: string
): Promise<ICurriculumResponse> {
    
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
        `${settings.baseURL}/api/v1/curriculums/${curriculumId}`,
        {
            method: "PUT",
            headers,
            body: JSON.stringify(form),
        }
    );

    if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
    }

    return await response.json();
}

export async function login(data: ILoginInput): Promise<IAuthResponse> {
  const response = await fetch(
    `${settings.baseURL}/api/v1/auth/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(`Erro HTTP: ${response.status}`);
  }

  return await response.json();
}

export async function register(data: IRegisterInput): Promise<IAuthResponse> {
  const response = await fetch(
    `${settings.baseURL}/api/v1/auth/register`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(`Erro HTTP: ${response.status}`);
  }

  return await response.json();
}