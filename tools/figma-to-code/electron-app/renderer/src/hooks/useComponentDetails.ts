import { useEffect, useRef, useState } from "react";
import { Component, ComponentDetails } from "../types";

interface Result {
  details: ComponentDetails | null;
  bundle: string | null;
  loading: boolean;
  bundleLoading: boolean;
  error: string | null;
  reloadBundle: () => Promise<void>;
  readFile: (path: string) => Promise<string>;
}

export function useComponentDetails(component: Component | null): Result {
  const [details, setDetails] = useState<ComponentDetails | null>(null);
  const [bundle, setBundle] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [bundleLoading, setBundleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const disposedRef = useRef(false);

  useEffect(() => {
    disposedRef.current = false;
    return () => {
      disposedRef.current = true;
    };
  }, [component?.id]);

  useEffect(() => {
    let mounted = true;
    if (!component) {
      setDetails(null);
      setBundle(null);
      return () => {
        mounted = false;
      };
    }

    const load = async () => {
      setLoading(true);
      setBundleLoading(true);
      setError(null);
      try {
        const full = await window.electronAPI.getComponent(component.id);
        if (!mounted || disposedRef.current) return;
        setDetails(full);
        const bundled = await window.electronAPI.bundleComponent(component.id);
        if (!mounted || disposedRef.current) return;
        setBundle(bundled);
      } catch (err) {
        if (!mounted || disposedRef.current) return;
        setError(err instanceof Error ? err.message : "Load error");
      } finally {
        if (mounted && !disposedRef.current) {
          setLoading(false);
          setBundleLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [component?.id]);

  return {
    details,
    bundle,
    loading,
    bundleLoading,
    error,
    reloadBundle: async () => {
      if (!component || disposedRef.current) return;
      setBundleLoading(true);
      setError(null);
      try {
        const bundled = await window.electronAPI.bundleComponent(component.id);
        if (!disposedRef.current) {
          setBundle(bundled);
        }
      } catch (err) {
        if (!disposedRef.current) {
          setError(err instanceof Error ? err.message : "Load error");
        }
      } finally {
        if (!disposedRef.current) {
          setBundleLoading(false);
        }
      }
    },
    readFile: async (path: string) => {
      if (!component) throw new Error("No component selected");
      const { content } = await window.electronAPI.readComponentFile({
        id: component.id,
        path,
      });
      return content;
    },
  };
}
