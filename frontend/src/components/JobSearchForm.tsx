import { useState } from "react";
import type { JobSearchRequest, JobSite } from "../types/jobs";

interface Props {
  onSearch(payload: JobSearchRequest): void;
}

export function JobSearchForm({ onSearch }: Props) {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("São Luís, Maranhão, Brazil");
  const [maxPages, setMaxPages] = useState(10);

  const [sites, setSites] = useState<JobSite[]>(["linkedin", "indeed"]);
  const [hoursPubli, setHoursPubli] = useState<24 | 48>(24);
  const [isRemote, setIsRemote] = useState(false);

  const [countryIndeed, setCountryIndeed] = useState("brazil");

  function toggleSite(site: JobSite) {
    setSites((prev) =>
      prev.includes(site)
        ? prev.filter((s) => s !== site)
        : [...prev, site]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    onSearch({
      search,
      location,
      sites,
      pages: maxPages,
      hours_publi: hoursPubli,
      is_remote: isRemote,
      country_indeed: countryIndeed,
      linkedin_fetch_description: true,
    });
  }

  const hasIndeed = sites.includes("indeed");

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* MAIN BAR */}
      <div className="flex flex-col md:flex-row gap-2 bg-white border border-slate-200 rounded-2xl p-3 shadow-sm">
        <input
          type="text"
          placeholder="Cargo, palavra-chave ou empresa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 text-sm text-slate-800 outline-none"
        />

        <div className="hidden md:block w-px bg-slate-200" />

        <input
          type="text"
          placeholder="Localização"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="flex-1 px-4 py-2 text-sm text-slate-800 outline-none"
        />

        <select
          value={maxPages}
          onChange={(e) => setMaxPages(Number(e.target.value))}
          className="
            px-3
            py-1
            text-xs
            rounded-full
            border
            border-slate-200
            bg-white
            text-slate-600
          "
        >
          <option value={10}>10 vagas</option>
          <option value={25}>25 vagas</option>
          <option value={50}>50 vagas</option>
          <option value={100}>100 vagas</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-xl transition"
        >
          Buscar
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {(["linkedin", "indeed"] as JobSite[]).map((site) => (
          <button
            key={site}
            type="button"
            onClick={() => toggleSite(site)}
            className={`px-3 py-1 rounded-full text-xs border transition ${
              sites.includes(site)
                ? "bg-blue-50 text-blue-600 border-blue-200"
                : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {site}
          </button>
        ))}

        <select
          value={hoursPubli}
          onChange={(e) => setHoursPubli(Number(e.target.value) as 24 | 48)}
          className="px-3 py-1 text-xs rounded-full border border-slate-200 bg-white text-slate-600"
        >
          <option value={24}>Últimas 24h</option>
          <option value={48}>Últimas 48h</option>
        </select>

        <button
          type="button"
          onClick={() => setIsRemote((v) => !v)}
          className={`px-3 py-1 rounded-full text-xs border transition ${
            isRemote
              ? "bg-green-50 text-green-600 border-green-200"
              : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
          }`}
        >
          Remotas
        </button>
      </div>

      {hasIndeed && (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-800">
                Região do Indeed
              </p>

              <p className="text-xs text-slate-500 mt-0.5">
                Define qual base regional do Indeed será consultada.
              </p>
            </div>

            <select
              value={countryIndeed}
              onChange={(e) => setCountryIndeed(e.target.value)}
              className="
                min-w-[220px]
                rounded-xl
                border
                border-slate-200
                bg-white
                px-3
                py-2
                text-sm
                text-slate-700
                outline-none
                transition
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            >
              <option value="brazil">🇧🇷 Brasil</option>
              <option value="united states">🇺🇸 Estados Unidos</option>
              <option value="canada">🇨🇦 Canadá</option>
              <option value="united kingdom">🇬🇧 Reino Unido</option>
              <option value="australia">🇦🇺 Austrália</option>
              <option value="germany">🇩🇪 Alemanha</option>
              <option value="france">🇫🇷 França</option>
              <option value="portugal">🇵🇹 Portugal</option>
            </select>
          </div>
        </div>
      )}
    </form>
  );
}