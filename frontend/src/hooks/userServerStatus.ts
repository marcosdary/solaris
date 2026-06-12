import { useEffect, useRef, useState } from "react";
import { baseWS } from "../services/api";

export type ServerStatus =
  | "connecting"
  | "online"
  | "offline";

export function useServerStatus() {
  const [status, setStatus] =
    useState<ServerStatus>("connecting");

  console.log(baseWS);

  const socketRef = useRef<WebSocket | null>(null);
  const lastPongRef = useRef<number>(0);

  useEffect(() => {
    let reconnectTimer: number;
    let pingInterval: number;
    let heartbeatInterval: number;

    function connect() {
      setStatus("connecting");

      const ws = new WebSocket(baseWS);

      socketRef.current = ws;

      ws.onopen = () => {
        setStatus("online");

        lastPongRef.current = Date.now();

        pingInterval = window.setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                type: "ping",
              })
            );
          }
        }, 10000);

        heartbeatInterval = window.setInterval(() => {
          const diff =
            Date.now() - lastPongRef.current;

          if (diff > 30000) {
            setStatus("offline");
            ws.close();
          }
        }, 5000);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "pong") {
          lastPongRef.current = Date.now();
          setStatus("online");
        }
      };

      ws.onerror = () => {
        setStatus("offline");
      };

      ws.onclose = () => {
        setStatus("offline");

        clearInterval(pingInterval);
        clearInterval(heartbeatInterval);

        reconnectTimer = window.setTimeout(
          connect,
          5000
        );
      };
    }

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      clearInterval(pingInterval);
      clearInterval(heartbeatInterval);
      socketRef.current?.close();
    };
  }, []);

  return status;
}