# Electron App - Figma Components Gallery & Viewer

## Cel

Aplikacja desktop do zarządzania i przeglądania komponentów wygenerowanych z Figmy, z możliwością:

1. Przeglądania listy wygenerowanych komponentów
2. Podglądu komponentów (weryfikacja konwersji Tailwind → inline styles)
3. Generowania nowych komponentów z Figma URL
4. Usuwania komponentów
5. Kopiowania ścieżek dla agenta AI

## Stan istniejących narzędzi

**✅ Mamy już działające CLI tool** w tym katalogu (`~/work/datacapt/dcagents/tools/figma-to-code`):

- Konwertuje komponenty z Figmy
- Integracja z MCP (Model Context Protocol) dla Figma
- Konwersja Tailwind → inline styles
- Generowanie manifestów

**⚠️ Wymagane modyfikacje CLI:**

- Domyślna ścieżka zapisu: musi być `./components/` względem root projektu
- CLI obecnie wymaga ręcznego podania `--output-dir`
- App będzie wywoływać CLI z konkretną ścieżką outputu

## Architektura

```
figma-to-code/
├── src/                  # CLI converter (istniejący - do modyfikacji)
├── dist/                 # Compiled CLI
├── electron-app/         # 🆕 Electron application
│   ├── main/             # Main process (Node.js)
│   │   ├── index.ts      # Electron main
│   │   ├── ipc/          # IPC handlers
│   │   │   ├── components.ts    # List, delete components
│   │   │   ├── generator.ts     # Generate from Figma
│   │   │   └── bundler.ts       # Bundle component for preview
│   │   └── utils/
│   │       └── scanner.ts       # Scan components dir
│   ├── renderer/         # Renderer process (React)
│   │   ├── src/
│   │   │   ├── App.tsx
│   │   │   ├── components/
│   │   │   │   ├── ComponentList.tsx
│   │   │   │   ├── ComponentViewer.tsx
│   │   │   │   ├── GeneratorForm.tsx
│   │   │   │   ├── ComponentPreview.tsx
│   │   │   │   └── ThemeToggle.tsx
│   │   │   └── hooks/
│   │   │       └── useComponents.ts
│   │   ├── index.html
│   │   └── vite.config.ts
│   ├── preload/          # Preload script (security bridge)
│   │   └── index.ts
│   └── package.json
├── components/           # Wygenerowane komponenty
│   ├── {component-name}/
│   │   ├── Screen.tsx
│   │   ├── Screen.manifest.json
│   │   ├── {sections}.tsx
│   │   └── .metadata.json  # Metadata dla app
└── package.json
```

## UI Layout

### Main Window

```
┌─────────────────────────────────────────────────────────────┐
│  Figma Components Gallery               [🌓 Dark] [Copy ⎘] │
├──────────────┬──────────────────────────────────────────────┤
│              │                                               │
│  SIDEBAR     │  MAIN VIEW                                   │
│              │                                               │
│ [+ Generate] │  Component: reports-creator (549:9162)       │
│              │                                               │
│ 📦 reports-  │  [Preview] [Files] [Manifest]                │
│    creator   │  ┌─────────────────────────────────────────┐ │
│    549:9162  │  │                                         │ │
│    4 sec, 7b │  │  <Dynamic React Component Preview>      │ │
│    [🗑️]      │  │                                         │ │
│              │  │                                         │ │
│ 📦 login-    │  │                                         │ │
│    screen    │  └─────────────────────────────────────────┘ │
│    123:456   │                                               │
│    2 sec, 3b │  Stats: 4 sections, 7 blocks, 15 files       │
│    [🗑️]      │  Unmapped classes: 1 (<dynamic>)             │
│              │                                               │
└──────────────┴──────────────────────────────────────────────┘
```

### Generator Modal

```
┌─────────────────────────────────────────┐
│ Generate Component from Figma            │
├─────────────────────────────────────────┤
│                                          │
│ Figma URL or Node ID:                   │
│ ┌─────────────────────────────────────┐ │
│ │ https://figma.com/...?node-id=549-9 │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ Component name (optional):               │
│ ┌─────────────────────────────────────┐ │
│ │ my-component                        │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ [ Cancel ]  [ Generate ]                 │
│                                          │
│ Progress: Calling get_code...            │
│ ████████████░░░░ 75%                     │
└─────────────────────────────────────────┘
```

## Tech Stack

### Main Process (Node.js)

- **Electron**: Desktop app framework
- **TypeScript**: Type safety
- **esbuild**: Bundle components for preview
- **child_process**: Spawn CLI for generation
- **fs/promises**: File system operations

### Renderer Process (React)

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool
- **TailwindCSS**: Styling (dla app UI, nie dla komponentów!)
- **React Syntax Highlighter**: Code preview

### Communication

- **IPC (Inter-Process Communication)**: Electron's communication layer

## IPC API

### Renderer → Main

```typescript
// Lista komponentów
ipcRenderer.invoke('components:list'): Promise<Component[]>

// Szczegóły komponentu
ipcRenderer.invoke('components:get', id: string): Promise<ComponentDetails>

// Usuń komponent
ipcRenderer.invoke('components:delete', id: string): Promise<void>

// Generuj nowy komponent
ipcRenderer.invoke('components:generate', {
  url: string,
  name?: string
}): Promise<{ componentId: string }>

// Bundle komponentu dla preview
ipcRenderer.invoke('component:bundle', id: string): Promise<string>
```

### Main → Renderer (Events)

```typescript
// Progress podczas generowania
main.webContents.send("generate:progress", {
  percent: number,
  message: string,
});

// Generowanie zakończone
main.webContents.send("generate:complete", {
  componentId: string,
});

// Błąd generowania
main.webContents.send("generate:error", {
  error: string,
});
```

## Data Models

### Component (lista)

```typescript
interface Component {
  id: string; // "reports-creator-549-9162"
  name: string; // "reports-creator"
  figmaNodeId: string; // "549:9162"
  figmaUrl?: string; // Original Figma URL
  generatedAt: string; // ISO timestamp
  stats: {
    files: number; // 15
    sections: number; // 4
    blocks: number; // 7
    unmappedClasses: number; // 1
  };
}
```

### ComponentDetails

```typescript
interface ComponentDetails extends Component {
  manifest: Manifest; // Screen.manifest.json content
  files: FileNode[]; // Tree of files
  path: string; // Absolute path on disk
}

interface FileNode {
  name: string;
  type: "file" | "directory";
  path: string;
  size?: number;
  children?: FileNode[];
}

interface Manifest {
  screenId: string;
  rootFile: string;
  rootExport: string;
  components: Array<{
    kind: "section" | "block";
    name: string;
    file: string;
    exportName: string;
    parent?: string;
  }>;
}
```

### Metadata (.metadata.json)

```json
{
  "id": "reports-creator-549-9162",
  "name": "reports-creator",
  "figmaNodeId": "549:9162",
  "figmaUrl": "https://www.figma.com/design/...?node-id=549-9162",
  "generatedAt": "2025-11-19T19:00:00Z",
  "stats": {
    "files": 15,
    "sections": 4,
    "blocks": 7,
    "unmappedClasses": 1
  }
}
```

## Component Preview - Technical Solution

### Wybrana opcja: **esbuild on-demand**

**Workflow:**

1. User wybiera komponent do podglądu
2. Renderer wywołuje: `ipcRenderer.invoke('component:bundle', componentId)`
3. Main process:

   ```typescript
   async function bundleComponent(componentId: string): Promise<string> {
     const componentDir = path.join(COMPONENTS_DIR, componentId);

     // Read Screen.tsx and all dependencies
     const entryPoint = path.join(componentDir, "Screen.tsx");

     // Bundle with esbuild
     const result = await esbuild.build({
       entryPoints: [entryPoint],
       bundle: true,
       format: "esm",
       jsx: "automatic",
       write: false,
       loader: { ".tsx": "tsx", ".ts": "ts" },
       platform: "browser",
     });

     return result.outputFiles[0].text;
   }
   ```

4. Renderer renderuje bundled component w sandboxed container

**Zalety:**

- ✅ No pre-bundling required
- ✅ Always fresh (rebuild on demand)
- ✅ Clean architecture
- ✅ Error handling per component

**Wady:**

- ⚠️ Bundling zajmuje ~100-300ms (acceptable dla UX)

## TODO List

### Faza 0: Modyfikacje istniejącego CLI (~30min)

- [ ] **Aktualizacja domyślnej ścieżki zapisu**
  - [x] Sprawdź obecną konfigurację `--output-dir` w `src/cli.ts`
  - [x] Ustaw domyślną wartość `./components/` (względem root projektu)
  - [x] Upewnij się, że katalog jest tworzony automatycznie
  - [x] Test: uruchom CLI bez `--output-dir` - powinien zapisać do `./components/`

### Faza 1: Setup Electron (~2h)

- [ ] Inicjalizacja projektu Electron
  - [x] `npm init` w `electron-app/`
  - [x] Install dependencies: `electron`, `electron-builder`
  - [x] Install dev dependencies: `vite`, `typescript`, `@types/electron`
- [ ] Konfiguracja TypeScript
  - [x] `tsconfig.json` dla main process
  - [x] `tsconfig.json` dla renderer process
  - [x] `tsconfig.json` dla preload
- [ ] Setup Vite dla renderer
  - [x] `vite.config.ts` z electron-specific config
  - [x] HTML entry point
- [ ] Podstawowa struktura main process
  - [x] `main/index.ts` - create window, app lifecycle
  - [x] `preload/index.ts` - expose IPC API
- [ ] Build scripts w package.json
  - [x] `dev` - development mode
  - [x] `build` - production build
  - [x] `package` - electron-builder

### Faza 2: Main Process - Backend Logic (~2-3h)

- [x] **Scanner komponentów**
  - [x] `main/utils/scanner.ts`
  - [x] Funkcja: `scanComponents(): Component[]`
  - [x] Czyta katalog `components/`
  - [x] Dla każdego: czyta `.metadata.json` + `Screen.manifest.json`
  - [x] Generuje `.metadata.json` jeśli nie istnieje (backward compatibility)

- [x] **IPC Handler: components:list**
  - [x] `main/ipc/components.ts`
  - [x] `ipcMain.handle('components:list', async () => {...})`
  - [x] Zwraca: `Component[]`

- [x] **IPC Handler: components:get**
  - [x] `ipcMain.handle('components:get', async (event, id) => {...})`
  - [x] Czyta manifest, listę plików, metadata
  - [x] Zwraca: `ComponentDetails`

- [x] **IPC Handler: components:delete**
  - [x] `ipcMain.handle('components:delete', async (event, id) => {...})`
  - [x] Usuwa katalog komponentu: `fs.rm(dir, { recursive: true })`
  - [x] Emit event: `webContents.send('component:deleted', id)`

- [x] **IPC Handler: components:generate**
  - [x] `main/ipc/generator.ts`
  - [x] Parse Figma URL → extract nodeId
  - [x] Generate component name (z nodeId jeśli nie podano)
  - [x] Spawn CLI process: `child_process.spawn()`
    ```typescript
    spawn("node", [
      "dist/cli.js",
      "--figma-node",
      nodeId,
      "--output-dir",
      outputPath,
    ]);
    ```
  - [x] Stream stdout/stderr → progress events
  - [x] Generate `.metadata.json` po zakończeniu
  - [x] Emit: `generate:complete` lub `generate:error`

- [x] **IPC Handler: component:bundle**
  - [x] `main/ipc/bundler.ts`
  - [x] Setup esbuild
  - [x] Bundle `Screen.tsx` + dependencies
  - [x] Cache bundled output (optional optimization)
  - [x] Error handling
  - [x] Zwraca: bundled JS code as string

### Faza 3: Renderer UI (~3-4h)

- [x] **Setup React app**
  - [x] `renderer/src/App.tsx` - główny layout
  - [x] Setup TailwindCSS
  - [ ] Setup dark mode context/provider
  - [x] Podstawowa struktura layoutu (sidebar + main view)

- [x] **ComponentList (sidebar)**
  - [x] `renderer/src/components/ComponentList.tsx`
  - [x] Hook: `useComponents()` - fetch z IPC
  - [x] Wyświetl listę komponentów
  - [x] Component item:
    - [x] Nazwa
    - [x] Node ID
    - [x] Stats (sections, blocks)
    - [x] Generated date
    - [x] Delete button (z confirmacją)
  - [x] Active state (selected component)
  - [x] Empty state (brak komponentów)

- [x] **GeneratorForm (modal)**
  - [x] `renderer/src/components/GeneratorForm.tsx`
  - [x] Input: Figma URL
  - [x] Input: component name (optional)
  - [x] Validation: URL format
  - [x] Submit: call `components:generate` IPC
  - [x] Progress bar + status message
  - [x] Listen to `generate:progress` events
  - [x] Success/error handling
  - [x] Close on complete

- [x] **ComponentViewer (main view)**
  - [x] `renderer/src/components/ComponentViewer.tsx`
  - [x] Tabs: Preview, Files, Manifest
  - [x] Component header (name, nodeId, stats)
  - [x] Empty state (no component selected)

- [x] **Preview Tab**
  - [x] `renderer/src/components/ComponentPreview.tsx`
  - [x] Fetch bundled code: `component:bundle` IPC
  - [x] Render w sandboxed container
  - [x] Error boundary
  - [x] Loading state
  - [x] Reload button

- [x] **Files Tab**
  - [x] Tree view komponentu
  - [x] Clickable files → code preview
  - [x] Syntax highlighting (react-syntax-highlighter)

- [x] **Manifest Tab**
  - [x] JSON viewer dla manifest.json
  - [x] Pretty print
  - [x] Collapsible sections

### Faza 4: Component Preview (~2-3h)

- [x] **esbuild integration**
  - [x] Install esbuild w main process
  - [x] Konfiguracja bundlera
  - [x] Handle React imports
  - [x] Handle relative imports (./ScreenSection1)
  - [x] Handle CSS/assets (jeśli są)

- [x] **Sandboxed render**
  - [x] Container component w renderer
  - [x] Dynamic script injection
  - [x] React root mounting
  - [ ] Cleanup on unmount
  - [ ] Isolation (prevent side effects)

- [x] **Error boundaries**
  - [x] Catch component render errors
  - [x] Display error message
  - [x] Fallback UI
  - [ ] Retry mechanism

- [x] **Loading states**
  - [x] Skeleton loader podczas bundlingu
  - [x] Spinner
  - [x] Progress indicator

### Faza 5: Minimal Polish (~1-2h)

- [ ] **Dark mode**
  - [ ] `renderer/src/components/ThemeToggle.tsx`
  - [ ] Toggle button w header
  - [x] Persist preference (localStorage)
  - [x] Apply theme classes (Tailwind dark:)
  - [x] Smooth transition

- [ ] **Copy path to clipboard**
  - [x] Button w ComponentViewer header
  - [x] Copy absolute path do komponentu
  - [x] Format: `~/work/datacapt/dcagents/tools/figma-to-code/components/{name}`
  - [x] Toast notification: "Path copied!"
  - [x] Fallback for clipboard API errors

### Faza 6: Build & Distribution (~1h)

- [ ] **electron-builder config**
  - [ ] `electron-builder.json` lub package.json config
  - [ ] macOS config (.app, .dmg)
  - [ ] Windows config (.exe)
  - [ ] Linux config (.AppImage) - optional

- [ ] **Build scripts**
  - [ ] `npm run build:mac`
  - [ ] `npm run build:win`
  - [ ] `npm run build:linux`

- [ ] **Testing**
  - [ ] Test full workflow: generate → preview → delete
  - [ ] Test error cases
  - [ ] Test dark mode
  - [ ] Test copy path

- [ ] **Documentation**
  - [ ] README.md dla electron app
  - [ ] User guide (jak używać)
  - [ ] Developer guide (jak rozwijać)
  - [ ] Screenshot/GIF demo

## Estymacja czasu

- **Faza 0**: 30min (modyfikacje CLI)
- **Faza 1**: 2h (setup)
- **Faza 2**: 2-3h (backend logic)
- **Faza 3**: 3-4h (UI components)
- **Faza 4**: 2-3h (preview)
- **Faza 5**: 1-2h (polish)
- **Faza 6**: 1h (build)

**TOTAL: ~12-16h**

## Kluczowe decyzje techniczne

### 1. Component Preview

**Wybrana opcja**: esbuild on-demand bundling

- Bundle przy każdym podglądzie
- In-memory, no files written
- ~100-300ms bundling time (acceptable)

### 2. Component Storage

```
components/
  ├── {component-name}/
  │   ├── Screen.tsx
  │   ├── Screen.manifest.json
  │   ├── {sections}.tsx
  │   └── .metadata.json  # Generated by app or CLI
```

### 3. Metadata Generation

- CLI może generować `.metadata.json` przy tworzeniu komponentu
- App generuje jeśli brakuje (backward compatibility)
- Single source of truth dla stats

### 4. Dark Mode

- TailwindCSS dark: classes
- Context provider for theme state
- localStorage persistence

## Następne kroki

1. ✅ Plan zatwierdzony
2. [ ] Start implementacji - Faza 1
3. [ ] Code review po każdej fazie
4. [ ] Testing
5. [ ] Build & deploy

---

_Plan utworzony: 2025-11-19_
_Autor: Claude Code_
_Projekt: figma-to-code Electron App_
