import type { 
  ICurriculumFileResponse,
  ICurriculumFileDownloadResponse
} from "../types/curriculumFileResponse";
import { settings } from "../config/settings";

export async function searchCurriculumFiles(
    curriculumId: string,
    token?: string
): Promise<ICurriculumFileResponse[]> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
        `${settings.baseURL}/api/v1/curriculum-files/curriculum/${curriculumId}`,
        {
            method: "GET",
            headers,
        }
    );

    const data = await response.json();

    if (response.status === 404) {
        throw new Error(`${data?.detail[0]?.msg}`);
    }

    if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
    }

    return data;
}

export async function deleteCurriculumFile(
    curriculumFileId: string,
    token?: string
): Promise<void> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
        `${settings.baseURL}/api/v1/curriculum-files/${curriculumFileId}`,
        {
            method: "DELETE",
            headers,
        }
    );

    if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
    }

    return
}


export async function downloadCurriculumFile(
    curriculumFileId: string,
    token?: string
): Promise<ICurriculumFileDownloadResponse> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
        `${settings.baseURL}/api/v1/curriculum-files/${curriculumFileId}/download`,
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

