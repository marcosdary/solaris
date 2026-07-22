import { settings } from "../config/settings";
import type { ICurriculumResponse, ICurriculumPDFResponse } from "../types/curriculumResponse";
import type { ICurriculumInput, SearchCurriculums } from "../types/curriculumCreate";
import type { ICurriculumEditPayload } from "../types/curriculumEditPayload";
import { request } from "./apiClient";

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

    return request<ICurriculumResponse>(
        `${settings.baseURL}/api/v1/curriculums`,
        {
            method: "POST",
            headers,
            body: JSON.stringify(form),
        }
    );
}

export async function generateCurriculumPDF(
    curriculumId: string,
    template: string,
    token?: string
): Promise<ICurriculumPDFResponse> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return request<ICurriculumPDFResponse>(
        `${settings.baseURL}/api/v1/curriculums/pdf/${curriculumId}?template=${template}`,
        {
            method: "POST",
            headers,
        }
    );
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

    return request<ICurriculumResponse[]>(
        `${settings.baseURL}/api/v1/curriculums/users?${params.toString()}`,
        {
            method: "GET",
            headers,
        }
    );
}

export async function selectCurriculumByID(
    id: string,
    token?: string
): Promise<ICurriculumResponse> {
    const headers: Record<string, string> = {};

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return request<ICurriculumResponse>(
        `${settings.baseURL}/api/v1/curriculums/${id}`,
        {
            method: "GET",
            headers,
        }
    );
}

export async function deleteCurriculum(
    id: string,
    token?: string
): Promise<void> {
    const headers: Record<string, string> = {};

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return request<void>(
        `${settings.baseURL}/api/v1/curriculums/${id}`,
        {
            method: "DELETE",
            headers,
        }
    );
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

    return request<ICurriculumResponse>(
        `${settings.baseURL}/api/v1/curriculums/${curriculumId}`,
        {
            method: "PUT",
            headers,
            body: JSON.stringify(form),
        }
    );
}
