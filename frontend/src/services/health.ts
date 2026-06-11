import { baseURL } from "../services/api";

export async function checkBackendStatus(): Promise<boolean> {
  try {
    const response = await fetch(
      baseURL,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    return response.status === 200;
  } catch {
    return false;
  }
}