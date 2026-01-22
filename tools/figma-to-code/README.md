# Figma to Code - Converter React+Tailwind → React+Inline Styles + Modularization

Narzędzie do automatycznej konwersji kodu z Figmy (React + Tailwind) na modularną strukturę komponentów React z inline styles.

## Funkcjonalność

1. **Pobiera kod z Figmy** przez MCP server lub z lokalnego pliku
2. **Konwertuje Tailwind → inline styles** deterministycznie
3. **Analizuje złożoność JSX** (metryki: nodeCount, maxDepth)
4. **Wydziela sekcje i bloki** według progów złożoności
5. **Generuje strukturę plików** z komponentami i manifestem

## Instalacja

```bash
cd ~/work/datacapt/dcagents/tools/figma-to-code
pnpm install
pnpm build
```

## Użycie

### 1. Z Figma URL (przez MCP)

**Wymagania:**

- Uruchomiony Figma MCP server (`http://127.0.0.1:3845/sse`)
- Otwarta aplikacja Figma Desktop z dokumentem

```bash
figma-screen-extract \
  --figma-node "https://www.figma.com/file/ABC123?node-id=12-345" \
  --output-dir "./output/login-screen"
```

### 2. Z Node ID (przez MCP)

```bash
figma-screen-extract \
  --figma-node "12:345" \
  --output-dir "./output/dashboard"
```

### 3. Z lokalnego pliku TSX (offline)

```bash
figma-screen-extract \
  --figma-node "./sample-screen.tsx" \
  --output-dir "./output/test"
```

## Wynik

Struktura wygenerowanych plików:

```
output/
├── Screen.tsx                  # Główny komponent ekranu
├── ScreenSection1.tsx          # Wydzielona sekcja 1
├── ScreenSection2.tsx          # Wydzielona sekcja 2
├── ScreenSection2Block1.tsx    # Blok w sekcji 2
├── Screen.manifest.json        # Manifest struktury
├── Screen.raw.tsx              # Oryginalny kod z Figmy (debug)
└── unmapped-classes.log        # Nieobsłużone klasy Tailwind
```

### Przykład transformacji

**Input (Figma - React + Tailwind):**

```jsx
<div className="flex flex-col p-4 bg-white rounded-lg shadow-md">
  <h1 className="text-2xl font-bold text-gray-800">Title</h1>
</div>
```

**Output (React + inline styles):**

```jsx
<div
  style={{
    display: "flex",
    flexDirection: "column",
    padding: "1rem",
    backgroundColor: "#ffffff",
    borderRadius: "0.5rem",
    boxShadow:
      "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
  }}
>
  <h1
    style={{
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#1f2937",
    }}
  >
    Title
  </h1>
</div>
```

## Konfiguracja

### Zmienne środowiskowe

- `MCP_FIGMA_ENDPOINT` - endpoint MCP servera (domyślnie: `http://127.0.0.1:3845/sse`)

### Progi złożoności (src/extraction/structure.ts)

```typescript
const SECTION_MIN_NODES = 25; // Min węzłów dla sekcji
const SECTION_MIN_DEPTH = 3; // Min głębokość dla sekcji

const BLOCK_MIN_NODES = 12; // Min węzłów dla bloku
const BLOCK_MIN_DEPTH = 3; // Min głębokość dla bloku
```

## Manifest (Screen.manifest.json)

```json
{
  "screenId": "login-screen",
  "rootFile": "Screen.tsx",
  "rootExport": "Screen",
  "components": [
    {
      "kind": "section",
      "name": "ScreenSection1",
      "file": "ScreenSection1.tsx",
      "exportName": "ScreenSection1"
    }
  ]
}
```

## Ograniczenia

Nieobsłużone klasy Tailwind (logowane w `unmapped-classes.log`):

- `grid`, `grid-cols-*` - CSS Grid
- `space-y-*`, `space-x-*` - spacing utilities
- Inne klasy można dodać w `src/conversion/tailwindToInline.ts`

## Rozwój

```bash
# Development mode
pnpm dev -- --figma-node "./sample.tsx" --output-dir "./output"

# Build
pnpm build

# Format code
pnpm format
```

## Architektura

```
src/
├── cli.ts                    # CLI entry point
├── pipeline/                 # Main workflow
├── services/
│   └── figmaClient.ts        # MCP integration
├── conversion/
│   └── tailwindToInline.ts   # Tailwind → inline styles
├── analyzer/
│   ├── rootComponent.ts      # Find main component
│   └── jsxMetrics.ts         # Complexity metrics
└── extraction/
    ├── structure.ts          # Extract sections/blocks
    ├── imports.ts            # Manage imports
    └── componentWriter.ts    # Write component files
```

## Figma MCP Server Setup

Dokumentacja: https://help.figma.com/hc/en-us/articles/32132100833559

1. Zainstaluj Figma Desktop App
2. Włącz Dev Mode w Settings
3. Uruchom MCP server (automatycznie z aplikacją)
4. Otwórz dokument w Figma
5. Skopiuj link do frame/layer (prawy klik → Copy link)

## Troubleshooting

**Error: MCP request failed**

- Sprawdź czy Figma Desktop jest uruchomiona
- Sprawdź czy dokument jest otwarty
- Zweryfikuj czy node-id jest prawidłowe

**Error: No valid result in SSE stream**

- Może oznaczać, że node nie został znaleziony
- Sprawdź czy selekcja w Figma jest aktywna

**Unmapped classes**

- Zobacz `unmapped-classes.log`
- Dodaj mapowanie w `src/conversion/tailwindToInline.ts`
