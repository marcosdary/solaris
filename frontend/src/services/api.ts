import { settings } from "../config/settings";
import type { ICurriculum, ICurriculumResponse } from "../types/cv";
import type { ICurriculumInput, SearchCurriculums } from "../types/cv-input";

export async function requestRouteCv(
    form: ICurriculumInput
): Promise<ICurriculum> {
    
    const response = await fetch(
        `${settings.baseURL}/api/v1/cv`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        }
    );

    if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
    }

    return await response.json();
}

export async function searchCurriculums(
    payload: SearchCurriculums
): Promise<ICurriculum[]> {
    const params = new URLSearchParams();

    if (payload.category) {
        params.append("category", payload.category);
    }

    if (payload.language) {
        params.append("language", payload.language);
    }

    const response = await fetch(
        `${settings.baseURL}/api/v1/cv?${params.toString()}`,
        {
        method: "GET",
        }
    );

    if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
    }

    return await response.json();
}

export async function selectCurriculumByID(
    id: string
): Promise<ICurriculumResponse> {

    const response = await fetch(
        `${settings.baseURL}/api/v1/cv/${id}`,
        {
        method: "GET",
        }
    );

    if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
    }

    return await response.json();
}

export async function deleteCurriculum(
    id: string
): Promise<void> {

    const response = await fetch(
        `${settings.baseURL}/api/v1/cv/${id}`,
        {
        method: "DELETE",
        }
    );

    console.log(response);

    if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
    }

    return;
}

