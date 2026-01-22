---
description: Reads and describes the user's Vim state snapshot.
---

# Vimstate Command

Sprawdza aktualny stan vim'a użytkownika i opisuje wyświetlany kod.

## Działanie

1. Odczytuje plik `~/work/datacapt/dcagents/vimstate.md`
2. Pobiera ścieżkę do pliku i opcjonalne zaznaczenie (linie lub linie:kolumny)
3. Wyświetla fragment kodu z kontekstem
4. Opisuje co widzi w kodzie

## Format zaznaczenia

- `lines X-Y` - zaznaczone linie od X do Y
- `X:A-X:B` - linia X, kolumny od A do B
- `X:A-Y:B` - od linii X kolumny A do linii Y kolumny B

## Uwagi

- Możesz otrzymać wcześniej kontekst lub prośbę dotyczącą tego kodu
- Możesz otrzymać dalsze instrukcje po wykonaniu komendy
- Komenda służy do synchronizacji widoku między vim'em użytkownika a Claude
