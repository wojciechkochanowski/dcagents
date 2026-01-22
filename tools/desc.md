# Specyfikacja narzędzia: Figma → React z inline styles → zmodularyzowana struktura plików

## Cel

Celem narzędzia jest:

1. **Pobranie kodu z Figmy** (przez MCP Figmy) dla wskazanego _node_.
2. **Deterministyczne przekształcenie** kodu React + Tailwind na:
   - React z **inline styles** (bez Tailwinda),
   - następnie rozbicie jednego dużego komponentu na **mniejsze komponenty** w osobnych plikach.
3. **Wygenerowanie struktury katalogu** z:
   - plikiem głównym ekranu,
   - plikami sekcji i bloków,
   - manifestem JSON opisującym strukturę, aby agent mógł łatwo odnajdywać interesujące fragmenty.

Program ma być uruchamiany lokalnie w katalogu roboczym.  
Wystarczy, że użytkownik poda **adres node’a Figmy** (np. `--node-id` lub `--node-url`), resztę ma załatwić narzędzie.

---

## Interfejs CLI – zachowanie zewnętrzne

### Wywołanie

Przykładowa forma:

```bash
figma-screen-extract \
  --figma-node "https://www.figma.com/file/XXX?node-id=12-345" \
  --output-dir "./login-screen"

Założenia:
	•	--figma-node – adres node’a lub sam nodeId wymagany przez MCP Figmy.
	•	--output-dir – katalog wyjściowy (jeśli brak, użyć bieżącego katalogu).
	•	Parametry połączeniowe do MCP:
	•	albo z konfiguracji MCP (domyślnej, przyjętej w ekosystemie),
	•	albo przez zmienne środowiskowe (np. MCP_FIGMA_ENDPOINT, MCP_FIGMA_API_KEY), zgodnie z przyjętym standardem.

Efekt

W katalogu wyjściowym tworzymy strukturę np.:

login-screen/
  Screen.tsx
  ScreenSection1.tsx
  ScreenSection2.tsx
  ScreenSection2Block1.tsx
  ScreenSection3.tsx
  Screen.manifest.json

Gdzie:
	•	Screen.tsx – główny komponent ekranu,
	•	ScreenSectionX.tsx – wyodrębnione „sekcje” ekranu,
	•	ScreenSectionXBlockY.tsx – mniejsze bloki w ramach sekcji,
	•	Screen.manifest.json – opis struktury.

Narzędzie powinno być deterministyczne: dla tego samego node’a Figmy, tej samej wersji kodu i tych samych ustawień, zawsze generuje tę samą strukturę plików i te same nazwy komponentów.

⸻

Etap 1: Pobranie kodu z Figmy (MCP)

Założenie
	•	MCP Figmy zwraca React + Tailwind dla danego node’a:
	•	pojedynczy komponent (najczęściej export default function Component() { ... } lub nazwany export function Screen() { ... }),
	•	kod jest w TSX/JSX,
	•	klasy CSS są wyłącznie w className i są klasami Tailwind.

Wymagania
	1.	Program łączy się z MCP Figmy i pobiera pełny kod komponentu dla podanego node’a.
	2.	Jeśli Figma/MCP zwróci wiele wariantów, bierzemy wariant „standardowy” – React + Tailwind.
	3.	Kod wejściowy zapisujemy w pamięci i przekazujemy dalej (nie ma potrzeby zapisywania surowego pliku, choć można to robić opcjonalnie do debugowania, np. Screen.raw.tsx).

⸻

Etap 2: Konwersja Tailwind → inline styles

Główny cel

Przekształcić każde wystąpienie:

<div className="flex flex-col p-4 bg-white rounded-lg shadow-md">
  ...
</div>

na:

<div
  style={{
    display: "flex",
    flexDirection: "column",
    padding: "1rem",
    backgroundColor: "#ffffff",
    borderRadius: "0.5rem",
    boxShadow:
      "0 4px 6px -1px rgba(0,0,0,.1), 0 2px 4px -1px rgba(0,0,0,.06)",
  }}
>
  ...
</div>

bez zmiany struktury drzewa JSX.

Technika
	1.	Parsowanie TSX:
	•	użyć Babela lub recast:
	•	@babel/parser z sourceType: "module" i plugins: ["typescript", "jsx"],
	•	@babel/traverse lub recast do przejścia po AST.
	2.	Odnalezienie className:
	•	Szukamy wszystkich JSXAttribute o nazwie className.
	•	Obsługujemy przypadki:
	•	className="...",
	•	dla pierwszej iteracji można założyć stały string; warianty dynamiczne (className={isActive ? "..." : "..."}) można na razie odrzucić lub logować jako nieobsługiwane.
	3.	Funkcja tailwindToStyle(classes: string): React.CSSProperties
	•	classes – string z klasami oddzielonymi spacjami.
	•	Należy:
	•	rozbić po whitespace,
	•	dla każdej klasy wywołać prosty mapujący mechanizm,
	•	złożyć wynik w jeden obiekt stylów.
Przykładowy charakter mapowania:
	•	klasy proste:

"flex"      → { display: "flex" }
"flex-col"  → { flexDirection: "column" }
"items-center" → { alignItems: "center" }


	•	klasy arbitralne (z nawiasami):

"p-[10px]"        → { padding: "10px" }
"w-[320px]"       → { width: "320px" }
"text-[14px]"     → { fontSize: "14px" }
"leading-[20px]"  → { lineHeight: "20px" }
"rounded-[8px]"   → { borderRadius: "8px" }
"bg-[#F9FAFB]"    → { backgroundColor: "#F9FAFB" }
"text-[#111827]"  → { color: "#111827" }


	•	klasy typu gap-[8px]:

"gap-[8px]" → { gap: "8px" }


	•	cienie – albo z góry zdefiniowane (np. shadow, shadow-md, shadow-lg), albo arbitralne, jeśli Figma generuje np. shadow-[...].

	4.	Założenia dla konwersji Tailwind → inline styles:
	•	Nie chodzi o implementację pełnego silnika Tailwind, tylko o mapę klas pokrywającą typowe klasy generowane przez Figmę.
	•	Klasy nieobsługiwane:
	•	narzędzie loguje je do pliku (np. unmapped-classes.log),
	•	nie przerywa działania,
	•	pozwala później rozbudować mapę.
	5.	Modyfikacja AST:
	•	Dla każdego JSXOpeningElement:
	•	pobierz atrybut className, jeśli jest,
	•	wygeneruj obiekt stylów,
	•	usuń atrybut className,
	•	dodaj nowy atrybut style={...}.
	•	Obiekt stylów należy zapisać jako literal JS/TS (np. t.objectExpression([...]) w Babelu).
	6.	Wynik:
	•	Struktura JSX pozostaje identyczna,
	•	wszędzie zamiast Tailwinda są style={{ ... }}.

⸻

Etap 3: Analiza drzewa JSX i metryki złożoności

Na tym etapie pracujemy już wyłącznie na kodzie po konwersji (bez Tailwinda).

3.1. Identyfikacja komponentu głównego
	•	Znaleźć główny komponent ekranu:
	•	np. pierwsze export default function ...,
	•	albo komponent o nazwie Screen,
	•	w razie wątpliwości można przyjąć: pierwszy eksportowany komponent funkcyjny.

3.2. Znalezienie JSX zwracanego przez komponent
	•	Znaleźć return (...) w ciele funkcji komponentu.
	•	Wewnątrz – JSXElement będący głównym kontenerem (najczęściej <div>).

3.3. Obliczenie metryk dla każdego JSXElement

Dla każdego JSXElement liczymy:
	•	nodeCount – liczba węzłów (wliczając ten węzeł i wszystkie potomki),
	•	maxDepth – maksymalna głębokość.

Rekurencyjnie:
	•	nodeCount = 1 + suma(nodeCount dzieci),
	•	maxDepth = 1 + max(maxDepth dzieci).

Wyniki można przechowywać w WeakMap<JsxElement, Metrics>.

⸻

Etap 4: Wyznaczenie sekcji i bloków

Celem jest rozbicie dużego drzewa na:
	•	sekcje najwyższego poziomu (główne części ekranu),
	•	bloki w ramach sekcji (podfragmenty o istotnej złożoności).

4.1. Progi

Wprowadzić stałe (możliwe do konfiguracji):

const SECTION_MIN_NODES = 25;
const SECTION_MIN_DEPTH = 3;

const BLOCK_MIN_NODES = 12;
const BLOCK_MIN_DEPTH = 3;

4.2. Sekcje (poziom 1)
	•	jsxRoot – główny kontener komponentu.
	•	Rozważamy jego dzieci (jsxRoot.children.filter(isJsxElement)).
	•	Dla każdego dziecka:
	•	pobieramy metrics,
	•	jeśli nodeCount >= SECTION_MIN_NODES i maxDepth >= SECTION_MIN_DEPTH,
	•	oznaczamy ten węzeł jako „sekcję”.

Jeśli żadna sekcja nie spełnia warunków, można przyjąć, że cały root jest jedną sekcją i kolejne kroki wykonujemy względem jego potomków.

4.3. Bloki (poziom 2)

Dla każdego węzła oznaczonego jako sekcja:
	•	przechodzimy po jego poddrzewie (DFS/BFS),
	•	dla każdego JSXElement (potencjalnego bloku):
	•	pobieramy metrics dla węzła,
	•	pobieramy metrics dla rodzica (jeśli jest),
	•	sprawdzamy:

nodeCount >= BLOCK_MIN_NODES
maxDepth >= BLOCK_MIN_DEPTH
(opcjonalnie) parent.nodeCount > node.nodeCount * 1.5


	•	jeśli warunki spełnione:
	•	oznaczamy węzeł jako „blok”,
	•	nie schodzimy głębiej w jego potomków, aby nie oznaczać bloków zagnieżdżonych w bloku.

⸻

Etap 5: Generowanie komponentów i plików

5.1. Nazewnictwo

Zakładamy:
	•	nazwa ekranu: Screen (można też wyprowadzić z node’Id lub nazwy komponentu z Figmy),
	•	sekcje: ScreenSection1, ScreenSection2, … (indeks wg kolejności występowania),
	•	bloki w sekcjach: ScreenSection1Block1, ScreenSection1Block2, itd.

Nazwy muszą być stabilne względem kolejności dzieci/sekcji.

5.2. Ekstrakcja sekcji

Dla każdej sekcji:
	1.	Tworzymy nowy AST pliku:

import React from "react";

export function ScreenSection1() {
  return (
    {/* skopiowane JSX poddrzewo sekcji */}
  );
}


	2.	W Screen.tsx w miejscu oryginalnego JSX sekcji wstawiamy:

<ScreenSection1 />


	3.	Przy generowaniu kodu:
	•	dodajemy do Screen.tsx importy:

import { ScreenSection1 } from "./ScreenSection1";


	•	pilnujemy, aby nie generować duplikatów importów.

5.3. Ekstrakcja bloków w sekcjach

Analogicznie:
	1.	W pliku sekcji (ScreenSectionX.tsx):
	•	odnajdujemy oznaczone bloki,
	•	każdy blok wyciągamy do nowego komponentu:

export function ScreenSection2Block1() {
  return (
    {/* JSX bloku */}
  );
}


	•	w miejscu bloku wstawiamy:

<ScreenSection2Block1 />


	•	dodajemy import { ScreenSection2Block1 } from "./ScreenSection2Block1"; na górze pliku sekcji.

	2.	Każdy blok ma swój osobny plik ScreenSectionXBlockY.tsx z:
	•	import React from "react";
	•	deklaracją funkcji,
	•	export (nazwany).

5.4. Uwagi
	•	Na tym etapie nie dodajemy propsów – komponenty są „głupie”, czysto prezentacyjne, zawierają treść „na sztywno”.
	•	Późniejsza refaktoryzacja (dodawanie propsów, parametrów) to praca dla agenta lub programisty.

⸻

Etap 6: Manifest JSON

Manifest opisuje strukturę wygenerowanych komponentów.

6.1. Struktura

Przykładowa postać Screen.manifest.json:

{
  "screenId": "login-screen",
  "rootFile": "Screen.tsx",
  "rootExport": "Screen",
  "components": [
    {
      "kind": "section",
      "name": "ScreenSection1",
      "file": "ScreenSection1.tsx",
      "exportName": "ScreenSection1",
      "figmaNodeId": "12:34"
    },
    {
      "kind": "section",
      "name": "ScreenSection2",
      "file": "ScreenSection2.tsx",
      "exportName": "ScreenSection2",
      "figmaNodeId": "12:35"
    },
    {
      "kind": "block",
      "name": "ScreenSection2Block1",
      "file": "ScreenSection2Block1.tsx",
      "exportName": "ScreenSection2Block1",
      "figmaNodeId": "12:40",
      "parent": "ScreenSection2"
    }
  ]
}

6.2. Informacje minimalne
	•	screenId – identyfikator ekranu (np. nazwa głównego komponentu lub bezpieczna wersja nodeId).
	•	rootFile – plik główny (Screen.tsx),
	•	rootExport – nazwa eksportowanego komponentu (np. Screen),
	•	components – lista:
	•	kind: "section" | "block",
	•	name: nazwa komponentu,
	•	file: nazwa pliku,
	•	exportName: nazwa eksportu,
	•	figmaNodeId (opcjonalnie) – jeśli w kodzie są atrybuty typu data-figma-id,
	•	parent (dla bloków) – nazwa komponentu-rodzica (sekcji).

6.3. Cel manifestu

Manifest ma umożliwić agentowi:
	•	znalezienie pliku odpowiadającego określonej części ekranu,
	•	zrozumienie hierarchii:
	•	ekran → sekcje → bloki,
	•	swobodne poruszanie się po strukturze tak, jak w zwykłym projekcie React.

⸻

Wymagania niefunkcjonalne
	1.	Deterministyczność
	•	Te same wejściowe dane (kod z MCP Figmy, konfiguracja progów) → ta sama struktura plików i nazwy komponentów.
	•	Wszelkie losowości (np. generowanie ID) są zabronione.
	2.	Idempotencja
	•	Narzędzie jest przeznaczone do pracy na surowym kodzie z Figmy.
	•	Nie musi wspierać wielokrotnego uruchamiania na już przetworzonym kodzie, ale nie powinno niszczyć istniejących plików bez ostrzeżenia (np. wymagana flaga --overwrite).
	3.	Logowanie braków mapowania
	•	Każda nieobsłużona klasa Tailwind powinna być zapisana:
	•	do loga konsolowego,
	•	oraz opcjonalnie do pliku unmapped-classes.log w katalogu wyjściowym.
	4.	Czytelność kodu wynikowego
	•	Generowany kod TSX ma być formatowany (np. przy pomocy Prettier),
	•	importy poukładane, brak duplikatów.

⸻

Podsumowanie

Program ma wykonać następujący ciąg kroków:
	1.	Pobrać kod React + Tailwind dla wskazanego node’a Figmy przez MCP.
	2.	Skonwertować wszystkie className="..." na style={{ ... }} przy użyciu deterministycznej funkcji tailwindToStyle.
	3.	Przeanalizować drzewo JSX głównego komponentu, policzyć metryki (nodeCount, maxDepth).
	4.	Wyznaczyć sekcje i bloki na podstawie ustalonych progów złożoności.
	5.	Wyciągnąć sekcje i bloki do osobnych komponentów w osobnych plikach, pozostawiając spójne importy i strukturę.
	6.	Wygenerować manifest opisujący wszystkie komponenty i ich relacje.
	7.	Zwrócić strukturę katalogu, w której agent może poruszać się jak po prawdziwym projekcie React i bardzo łatwo odnaleźć fragmenty, które chce modyfikować.

Ta specyfikacja ma być wystarczająco precyzyjna, aby agent mógł zaimplementować narzędzie bez dalszych dopowiedzeń, używając standardowego stosu: Node.js + TypeScript + Babel/recast + Prettier.


