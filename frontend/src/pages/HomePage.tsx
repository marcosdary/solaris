import { Link } from "react-router-dom";
import { FileText, Sparkles, Globe, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <nav className="mb-24 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Auto CV
        </h1>

        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200/60 hover:text-slate-900"
          >
            Entrar
          </Link>

          <Link
            to="/curriculums"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Meus Currículos
          </Link>
        </div>
      </nav>

      <section className="mb-24">
        <h2 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl">
          Crie um currículo profissional em poucos minutos.
        </h2>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-500">
          Gere currículos modernos em PDF, personalizados por IA, em português,
          inglês e espanhol.
        </p>
      </section>

      <section className="grid gap-1 sm:grid-cols-4">
        {[
          { icon: FileText, title: "PDF", desc: "Exporte currículos prontos para impressão e compartilhamento." },
          { icon: Sparkles, title: "IA", desc: "Conteúdo gerado e personalizado por inteligência artificial." },
          { icon: Globe, title: "Multilíngue", desc: "Português, inglês e espanhol com apenas um clique." },
          { icon: Zap, title: "Rápido", desc: "Crie currículos completos em poucos minutos." },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="rounded-xl p-6 transition hover:bg-white">
            <Icon size={28} className="text-slate-400" strokeWidth={1.5} />
            <h3 className="mt-5 text-sm font-semibold text-slate-800">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
