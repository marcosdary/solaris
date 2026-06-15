import { settings } from "../config/settings";
import type { CVPayload, CVResponse } from "../types/cv";

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