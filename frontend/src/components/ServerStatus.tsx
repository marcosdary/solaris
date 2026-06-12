import { useServerStatus } from "../hooks/userServerStatus";

export function ServerStatus() {
  const status = useServerStatus();

  const config = {
    online: {
      text: "Servidor Online",
      dot: "bg-green-500",
    },
    offline: {
      text: "Servidor Offline",
      dot: "bg-red-500",
    },
    connecting: {
      text: "Conectando...",
      dot: "bg-yellow-500",
    },
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-3 w-3 rounded-full animate-pulse ${config[status].dot}`}
      />

      <span className="text-sm text-slate-600">
        {config[status].text}
      </span>
    </div>
  );
}