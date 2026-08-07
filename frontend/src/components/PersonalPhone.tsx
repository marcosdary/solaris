import { useState, useCallback } from "react";

import { selectAllCountries } from "../utils/selectAllContries";
import { phoneMask } from "../utils/phoneMask";
import type { Country } from "../types/country";

const countries = selectAllCountries();

const countryMap = Object.fromEntries(
  countries.map((c) => [c.iso2, c])
) as Record<string, Country>;

const dialCodeMap = Object.fromEntries(
  countries.map((c) => [c.dialCode, c])
) as Record<string, Country>;

const countryOptions = countries.map((country) => (
  <option
    key={country.iso2}
    value={country.iso2}
    className="bg-background-primary text-text-primary"
  >
    +{country.dialCode} ({country.name})
  </option>
));

interface PersonalPhoneProps {
  form: { phone: string; ddi: string };
  updateField: (key: string, value: string) => void;
  inputStyle: string;
}

export function PersonalPhone({ form, updateField, inputStyle }: PersonalPhoneProps) {
  const [selectedIso, setSelectedIso] = useState(() => {
    if (form.ddi) {
      const match = dialCodeMap[form.ddi];
      if (match) return match.iso2;
    }
    return "br";
  });

  const handleCountryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newIso = e.target.value;
      setSelectedIso(newIso);
      updateField("state", countryMap[newIso].dialCode);
    },
    [updateField]
  );

  return (
    <div className="flex items-center gap-1 rounded-md border border-border-default bg-transparent p-1 focus-within:border-accent-primary">

      <select
        value={selectedIso}
        onChange={handleCountryChange}
        className="bg-transparent text-[15px] text-text-primary focus:outline-none cursor-pointer max-w-[100px] truncate"
      >
        {countryOptions}
      </select>

      <span className="h-5 w-[1px] bg-border-default" />

      <input
        type="tel"
        placeholder="99 99999-9999"
        className={inputStyle}
        value={phoneMask(form.phone)}
        onChange={(e) => updateField("phone", phoneMask(e.target.value))}
      />
    </div>
  );
}
