import type {
  ICurriculumFileResponse,
  ICurriculumFileDownloadResponse,
} from "../types/curriculumFileResponse";
import { settings } from "../config/settings";
import { request } from "./apiClient";

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

    return request<ICurriculumFileResponse[]>(
        `${settings.baseURL}/api/v1/curriculum-files/curriculum/${curriculumId}`,
        { method: "GET", headers },
    );
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

    return request<void>(
        `${settings.baseURL}/api/v1/curriculum-files/${curriculumFileId}`,
        { method: "DELETE", headers },
    );
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

    return request<ICurriculumFileDownloadResponse>(
        `${settings.baseURL}/api/v1/curriculum-files/${curriculumFileId}/download`,
        { method: "GET", headers },
    );
}

