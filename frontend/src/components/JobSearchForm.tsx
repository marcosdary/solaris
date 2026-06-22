import { useState } from "react";
import type { JobSearchRequest, JobSite } from "../types/jobs";

interface Props {
  onSearch(payload: JobSearchRequest): void;
}

export function JobSearchForm({ onSearch }: Props) {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("São Luís, Maranhão, Brazil");

  const [sites, setSites] = useState<JobSite[]>(["linkedin", "indeed"]);
  const [hoursPubli, setHoursPubli] = useState<24 | 48>(24);
  const [isRemote, setIsRemote] = useState(false);

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
      pages: 10,
      hours_publi: hoursPubli,
      is_remote: isRemote,
      country_indeed: "brazil",
      linkedin_fetch_description: true,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full"
    >
      {/* MAIN BAR */}
      <div className="flex flex-col md:flex-row gap-2 bg-white border border-slate-200 rounded-2xl p-3 shadow-sm">
        
        {/* Search input */}
        <input
          type="text"
          placeholder="Cargo, palavra-chave ou empresa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 text-sm text-slate-800 outline-none"
        />

        {/* Separator */}
        <div className="hidden md:block w-px bg-slate-200" />

        {/* Location */}
        <input
          type="text"
          placeholder="Localização"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="flex-1 px-4 py-2 text-sm text-slate-800 outline-none"
        />

        {/* Search button */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-xl transition"
        >
          Buscar
        </button>
      </div>

      {/* FILTER ROW (modern SaaS style) */}
      <div className="mt-3 flex flex-wrap items-center gap-2">

        {/* Sites */}
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

        {/* Hours */}
        <select
          value={hoursPubli}
          onChange={(e) => setHoursPubli(Number(e.target.value) as 24 | 48)}
          className="px-3 py-1 text-xs rounded-full border border-slate-200 bg-white text-slate-600"
        >
          <option value={24}>Últimas 24h</option>
          <option value={48}>Últimas 48h</option>
        </select>

        {/* Remote toggle */}
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
    </form>
  );
}