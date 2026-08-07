import { MapPin } from "lucide-react";
import { useState } from "react";
import { useStates, useCities } from "../../hooks/useLocation";

interface PersonalLocationProps {
  updateField: (key: string, value: string) => void;
}

export function PersonalLocation({ updateField }: PersonalLocationProps) {
  const { states, error, loading } = useStates();

  const [stateId, setStateId] = useState<number>();
  const [cityId, setCityId] = useState<number>();

  const { cities, loading: loadingCities } = useCities(stateId);

  if (loading) return <p>Carregando...</p>;

  if (error) return <p>Erro ao carregar estados.</p>;

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newIdState = Number(e.target.value);

    setStateId(newIdState);

    const selectedState = states.find(
      (state) => state.id === newIdState
    );

    if (selectedState) {
      updateField("state", selectedState.nome);
    }

    setCityId(undefined);
  }

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newIdState = Number(e.target.value);

    setStateId(newIdState);

    const selectedState = cities.find(
      (city) => city.id === newIdState
    );

    if (selectedState) {
      updateField("city", selectedState.nome);
    }

  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border-primary bg-background-secondary px-4 py-2">
      <MapPin
        size={18}
        className="text-text-secondary shrink-0"
      />

      <select
        value={stateId ?? ""}
        onChange={handleStateChange}
        className="flex-1 bg-transparent text-[15px] text-text-primary outline-none cursor-pointer"
      >
        <option value="">Estado</option>

        {states.map((state) => (
          <option
            key={state.id}
            value={state.id}
          >
            {state.sigla}
          </option>
        ))}
      </select>

      <span className="text-border-primary">|</span>

      <select
        disabled={!stateId || loadingCities}
        value={cityId ?? ""}
        onChange={handleCityChange}
        className="flex-1 bg-transparent text-[15px] text-text-primary outline-none cursor-pointer disabled:opacity-50"
      >
        <option value="">Cidade</option>

        {cities.map((city) => (
          <option
            key={city.id}
            value={city.id}
          >
            {city.nome}
          </option>
        ))}
      </select>
    </div>
  );
}