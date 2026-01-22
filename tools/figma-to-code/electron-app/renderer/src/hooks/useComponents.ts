import { useCallback, useEffect, useMemo, useState } from "react";
import { Component } from "../types";

export function useComponents() {
  const [components, setComponents] = useState<Component[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        if (!window.electronAPI) {
          throw new Error("Brak bridge Electron");
        }
        const data = await window.electronAPI.listComponents();
        if (!mounted) return;
        setComponents(data);
        setActiveId((prev) => prev ?? data[0]?.id ?? null);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Load error";
        if (!mounted) return;
        setError(message);
      }
      if (mounted) {
        setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const activeComponent = useMemo(
    () => components.find((component) => component.id === activeId) ?? null,
    [components, activeId],
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await window.electronAPI.listComponents();
      setComponents(data);
      setActiveId((prev) => prev ?? data[0]?.id ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load error");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    components,
    activeComponent,
    selectComponent: setActiveId,
    refresh,
    loading,
    error,
  };
}
