import { Link } from "react-router-dom";
import { FileText, Sparkles, Globe, Zap } from "lucide-react";
import { useAccessToken } from "../hooks/useAccessToken";

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

// /curriculums/form

export default function HomePage() {
  const accessToken = useAccessToken();

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <nav className="mb-32 flex items-center justify-between">
        <h1 className="font-['Caveat'] text-3xl font-bold text-accent-sun">
          Solaris
        </h1>

        {accessToken ? (
          <Link
            to="/curriculums"
            className="rounded-lg px-4 py-2 text-[15px] font-medium text-text-secondary transition hover:text-accent-horizon"
          >
            Meus Currículos
          </Link>
        ) : (
          <Link
            to="/login"
            className="rounded-lg px-4 py-2 text-[15px] font-medium text-text-secondary transition hover:text-accent-horizon"
          >
            Entrar
          </Link>
        )}
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
          to={ accessToken ? "/curriculums/form" : "/login" }
          className="mt-10 inline-block rounded-lg px-7 py-3 text-[15px] font-medium text-white transition hover:brightness-110"
          style={{
            background: "linear-gradient(135deg, #FFB200 0%, #FF8A00 100%)",
          }}
        >
          Criar Currículo
        </Link>
        
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
