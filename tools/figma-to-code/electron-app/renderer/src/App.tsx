import { useEffect, useState } from "react";
import ComponentList from "./components/ComponentList";
import ComponentViewer from "./components/ComponentViewer";
import GeneratorForm from "./components/GeneratorForm";
import ThemeToggle from "./components/ThemeToggle";
import { useComponents } from "./hooks/useComponents";
import { useTheme } from "./hooks/useTheme";

export default function App() {
  const { components, activeComponent, selectComponent, refresh, loading, error } =
    useComponents();
  const [generatorOpen, setGeneratorOpen] = useState(false);
  const [progress, setProgress] = useState<{ percent: number; message: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const { theme } = useTheme();

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  useEffect(() => {
    if (!window.electronAPI) return;
    const offProgress = window.electronAPI.onGenerateProgress((payload) => {
      setProgress({ percent: payload.percent, message: payload.message });
    });
    const offComplete = window.electronAPI.onGenerateComplete(({ componentId }) => {
      setProgress({ percent: 100, message: `Complete: ${componentId}` });
      refresh();
      setTimeout(() => setProgress(null), 2000);
    });
    const offError = window.electronAPI.onGenerateError(({ error: err }) => {
      setProgress({ percent: 0, message: `Error: ${err}` });
    });
    return () => {
      offProgress();
      offComplete();
      offError();
    };
  }, [refresh]);

  const shellClass =
    theme === "dark"
      ? "bg-[radial-gradient(circle_at_20%_20%,rgba(45,212,191,0.13),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.18),transparent_25%),linear-gradient(135deg,#0b1221,#0f172a_40%,#0b1221)] text-slate-50"
      : "bg-[radial-gradient(circle_at_15%_20%,rgba(14,165,233,0.12),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(232,121,249,0.12),transparent_25%),linear-gradient(135deg,#f8fafc,#e2f3ff_40%,#f8fafc)] text-slate-900";

  return (
    <div className={`min-h-screen transition-colors duration-300 ${shellClass}`}>
      <header className="flex items-center justify-between px-6 pb-4 pt-6">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-700 dark:text-cyan-200/70">
            Figma Components
          </p>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Gallery & Generator
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Manage generated components, preview inline styles, trigger fresh builds.
          </p>
          {progress ? (
            <div className="mt-2 w-full max-w-md rounded border border-slate-200/60 bg-white/80 p-2 text-xs text-cyan-900 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-cyan-100">
              <div className="flex justify-between">
                <span>{progress.message}</span>
                <span>{progress.percent}%</span>
              </div>
              <div className="mt-1 h-1.5 rounded bg-slate-200/70 dark:bg-white/10">
                <div
                  className="h-full rounded bg-cyan-500 dark:bg-cyan-300"
                  style={{ width: `${Math.min(100, Math.max(0, progress.percent))}%` }}
                />
              </div>
            </div>
          ) : null}
          {error ? (
            <p className="mt-2 text-xs text-amber-300">Error: {error}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setGeneratorOpen(true)}
            className="rounded-full border border-slate-200/70 bg-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_45px_-18px_rgba(56,189,248,0.9)] transition hover:-translate-y-0.5 hover:bg-cyan-400 dark:border-white/10 dark:text-slate-950"
          >
            Generate
          </button>
        </div>
      </header>

      <main className="grid gap-6 px-6 pb-10 lg:grid-cols-[380px_1fr]">
        <ComponentList
          components={components}
          activeId={activeComponent?.id ?? null}
          onSelect={selectComponent}
          onGenerate={() => setGeneratorOpen(true)}
          onDelete={
            window.electronAPI
              ? (id) => {
                  const confirmed = window.confirm("Delete this component directory?");
                  if (!confirmed) return;
                  window.electronAPI
                    .deleteComponent(id)
                    .then(() => refresh())
                    .catch((err) =>
                      console.error("Delete failed", err instanceof Error ? err.message : err),
                    );
                }
              : undefined
          }
          loading={loading}
        />
        <ComponentViewer
          component={activeComponent}
          onCopyPath={() => {
            if (!activeComponent) return;
            const path = `~/work/datacapt/dcagents/tools/figma-to-code/components/${activeComponent.name}`;
            navigator.clipboard
              ?.writeText(path)
              .then(() => showToast("Path copied"))
              .catch(() => showToast("Clipboard unavailable"));
          }}
        />
      </main>

      <GeneratorForm
        open={generatorOpen}
        onClose={() => setGeneratorOpen(false)}
        onSubmit={(payload) => {
          if (!window.electronAPI) return;
          setProgress({ percent: 5, message: "Starting..." });
          window.electronAPI
            .generateComponent(payload)
            .then(() => refresh())
            .catch((err) =>
              setProgress({ percent: 0, message: err instanceof Error ? err.message : "Error" }),
            )
            .finally(() => {
              setGeneratorOpen(false);
              setTimeout(() => setProgress(null), 2000);
            });
        }}
      />
      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-white/90 px-4 py-2 text-sm text-slate-900 shadow-lg ring-1 ring-slate-200/80 backdrop-blur dark:bg-slate-900/90 dark:text-slate-100 dark:ring-white/10">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
