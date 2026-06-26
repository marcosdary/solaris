import { useServerStatus } from "../hooks/userServerStatus";

export function ServerStatus() {
  // Garante um valor padrão caso o hook retorne undefined/null inicialmente
  const status = useServerStatus() || "connecting";

  const config = {
    online: {
      text: "Online", // Reduzido de "Servidor Online" para não poluir o Header
      dot: "bg-emerald-500 ring-emerald-500/20",
      textClass: "text-emerald-700 bg-emerald-50 border-emerald-100"
    },
    offline: {
      text: "Offline",
      dot: "bg-rose-500 ring-rose-500/20",
      textClass: "text-rose-700 bg-rose-50 border-rose-100"
    },
    connecting: {
      text: "Conectando...",
      dot: "bg-amber-500 ring-amber-500/20",
      textClass: "text-amber-700 bg-amber-50 border-amber-100"
    },
  };

  const current = config[status] || config.connecting;

  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-0.5 text-xs font-medium ${current.textClass}`}>
      {/* O indicador ganha um efeito de pulsação suave em anel (ring) */}
      <span className="relative flex h-2 w-2">
        {status === "connecting" || status === "online" ? (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${current.dot}`} />
        ) : null}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${current.dot.split(" ")[0]}`} />
      </span>

      <span>{current.text}</span>
    </div>
  );
}