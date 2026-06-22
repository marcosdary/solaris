import { settings } from "../config/settings";
import type { CVPayload, CVResponse } from "../types/cv";
import type { JobSearchRequest, Job } from "../types/jobs"

export async function requestRouteCv(
    form: CVPayload
): Promise<CVResponse> {
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

export async function searchJobs(payload: JobSearchRequest): Promise<Job[]>{
    
    const response = await fetch(
        `${settings.baseURL}/api/v1/jobs`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        }
    )

    if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
    }

    return await response.json();
}
