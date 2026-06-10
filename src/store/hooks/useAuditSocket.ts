import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

type EventPayload = Record<string, any>;

interface AuditSocketHandlers {
  onLeadUpdated?: (data: EventPayload) => void;
  onLeadCreated?: (data: EventPayload) => void;
  onAuditUpdate?: (data: EventPayload) => void;
  onAuditProgress?: (data: EventPayload) => void;
  // Scrape-job events (v2 lead searches are scrape jobs).
  onJobUpdate?: (data: EventPayload) => void;
  onJobProgress?: (data: EventPayload) => void;
}

/**
 * Subscribes to the backend's audit/lead realtime events over Socket.IO and
 * invokes the given handlers. Connection is established once on mount; handlers
 * are read through a ref so passing fresh closures doesn't reconnect.
 * Mirrors the auth/connection pattern used by ExtractionsTable.
 */
export const useAuditSocket = (handlers: AuditSocketHandlers) => {
  const [isConnected, setIsConnected] = useState(false);
  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const socket = io(import.meta.env.VITE_BACKEND_HOST, {
      auth: { token },
      autoConnect: true,
    });

    socket.on("connect", () => setIsConnected(true));
    socket.on("connect_error", () => setIsConnected(false));
    socket.on("disconnect", () => setIsConnected(false));

    socket.on("lead_updated", (d) => handlersRef.current.onLeadUpdated?.(d));
    socket.on("lead_created", (d) => handlersRef.current.onLeadCreated?.(d));
    socket.on("audit_update", (d) => handlersRef.current.onAuditUpdate?.(d));
    socket.on("audit_progress", (d) => handlersRef.current.onAuditProgress?.(d));
    socket.on("job_update", (d) => handlersRef.current.onJobUpdate?.(d));
    socket.on("job_progress", (d) => handlersRef.current.onJobProgress?.(d));

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      setIsConnected(false);
    };
  }, []);

  return { isConnected };
};
