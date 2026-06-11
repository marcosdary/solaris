import { useEffect, useState } from "react";
import { checkBackendStatus } from "../services/health";


export function BackendStatus() {
  const [online, setOnline] = useState(false);

  async function verifyConnection() {
    const result = await checkBackendStatus();
    setOnline(result);
  }

  useEffect(() => {
    verifyConnection();

    const interval = setInterval(
      verifyConnection,
      10000
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <div
        className={`h-3 w-3 rounded-full ${
          online
            ? "bg-green-500"
            : "bg-red-500"
        }`}
      />

      <span className="text-sm text-slate-600">
        {online
          ? "Servidor Online"
          : "Servidor Offline"}
      </span>
    </div>
  );
}