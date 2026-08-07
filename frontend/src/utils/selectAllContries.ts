import { allCountries } from "country-telephone-data";

import type { Country } from "../types/country";

export function selectAllCountries(): Country[] {
    return allCountries.map((country) => ({
        name: country.name,
        iso2: country.iso2,
        dialCode: country.dialCode,
        format: country.format
    }))
}