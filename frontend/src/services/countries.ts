import { settings } from "../config/settings";

import type { IStates, ICities } from "../types/countries";

import { request } from "./apiClient";

export async function getStates(): Promise<IStates[]> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };
    return request<IStates[]>(
        `${settings.apiIBGE}/estados?orderBy=nome`,
        {
            method: "GET",
            headers,
        }
    );
}

export async function getCities(id: number): Promise<ICities[]> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };
    return request<ICities[]>(
        `${settings.apiIBGE}/estados/${id}/municipios`,
        {
            method: "GET",
            headers,
        }
    );
}