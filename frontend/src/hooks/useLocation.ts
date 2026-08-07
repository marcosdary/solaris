import { useEffect, useState } from "react";
import { getStates, getCities } from "../services/countries";
import type { IStates, ICities } from "../types/countries"; 
import { ApiError } from "../errors";

export function useStates() {
  const [states, setStates] = useState<IStates[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getStates();
        setStates(data);
      } catch (err) {
        setError(err);        
      } finally {
        setLoading(false)
      }
    }
    load();
  }, []);
  return { states, error, loading };
}

export function useCities(stateId?: number) {
  const [cities, setCities] = useState<ICities[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    if (!stateId) {
      return;
    }

    async function load() {

      try {
        const data = await getCities(stateId);
        setCities(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [stateId]);

  return { cities, loading, error };
}