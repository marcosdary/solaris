import { Link } from "react-router-dom";
import { FileText, Sparkles, Globe, Zap } from "lucide-react";
import { settings } from "../config/settings";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const FEATURES = [
  {
    icon: FileText,
    title: "PDF",
    desc: "Exporte currículos prontos para impressão e compartilhamento.",
    color: "horizon" as const,
  },
  {
    icon: Sparkles,
    title: "IA",
    desc: "Conteúdo gerado e personalizado por inteligência artificial.",
    color: "sun" as const,
  },
  {
    icon: Globe,
    title: "Multilíngue",
    desc: "Português, inglês e espanhol com apenas um clique.",
    color: "horizon" as const,
  },
  {
    icon: Zap,
    title: "Rápido",
    desc: "Crie currículos completos em poucos minutos.",
    color: "horizon" as const,
  },
];

function iconClasses(color: "sun" | "horizon") {
  return color === "sun"
    ? { bg: "bg-accent-sun/10", fg: "text-accent-sun" }
    : { bg: "bg-accent-horizon/10", fg: "text-accent-horizon" };
}

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <nav className="mb-32 flex items-center justify-between">
        <h1 className="font-['Caveat'] text-3xl font-bold text-accent-sun">
          Solaris
        </h1>

        <Link
          to="/login"
          className="rounded-lg px-4 py-2 text-[15px] font-medium text-text-secondary transition hover:text-accent-horizon"
        >
          Entrar
        </Link>
      </nav>

      <section className="mb-32">
        <h2 className="max-w-3xl text-5xl font-bold leading-[1.1] tracking-tight text-text-primary md:text-6xl lg:text-[56px]">
          Crie um currículo{" "}
          <span className="text-accent-sun">profissional</span>{" "}
          em poucos minutos.
        </h2>

        <p className="mt-8 max-w-xl text-lg leading-relaxed text-text-secondary">
          Gere currículos modernos em PDF, personalizados por IA, em português,
          inglês e espanhol.
        </p>

        <Link
          to="/login"
          className="mt-10 inline-block rounded-lg px-7 py-3 text-[15px] font-medium text-white transition hover:brightness-110"
          style={{
            background: "linear-gradient(135deg, #FFB200 0%, #FF8A00 100%)",
          }}
        >
          Criar Currículo
        </Link>
      </section>

      <section className="mb-24 rounded-2xl border border-border-default bg-bg-surface p-8">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-sun/10">
              <WhatsAppIcon className="h-6 w-6 text-accent-sun" />
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-text-primary">
                Converse com nossa agente de IA
              </h3>
              <p className="mt-1 max-w-md text-[15px] leading-relaxed text-text-secondary">
                No WhatsApp, nossa inteligência artificial te ajuda a conquistar
                seu próximo emprego ou crescimento profissional.
              </p>
            </div>
          </div>

          <a
            href={`https://wa.me/${settings.numberWhatsApp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-border-default px-5 py-2.5 text-[15px] font-medium text-accent-horizon transition hover:bg-bg-base"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Falar no WhatsApp
          </a>
        </div>
      </section>

      <section className="mb-24 grid gap-6 sm:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, desc, color }) => {
          const cls = iconClasses(color);
          return (
            <div
              key={title}
              className="rounded-2xl border border-border-default bg-white p-6 transition hover:border-accent-horizon hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${cls.bg}`}
              >
                <Icon size={24} className={cls.fg} strokeWidth={1.5} />
              </div>
              <h3 className="text-xs font-medium tracking-wide uppercase text-text-primary">
                {title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">
                {desc}
              </p>
            </div>
          );
        })}
      </section>
    </div>
  );
}
