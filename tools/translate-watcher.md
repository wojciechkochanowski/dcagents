# Translation Watcher Script

Skrypt automatycznie monitoruje katalog z tłumaczeniami i uruchamia proces tłumaczenia przy każdej zmianie plików.

## Opis działania

Skrypt `translate-watcher.sh` automatycznie:
1. Jest uruchamiany przez launchd gdy pliki w `frontend/common/intl` się zmienią
2. Sprawdza czy inne tłumaczenie nie jest w toku (lock file)
3. Jeśli tłumaczenie trwa - kolejkuje żądanie do wykonania po zakończeniu
4. Informuje głosowo o rozpoczęciu tłumaczenia
5. Wywołuje komendę Claude z promptem tłumaczenia (`claude -p "tr"`)
6. Informuje głosowo o wyniku (przy sukcesie - odpowiedź Claude, przy błędzie - komunikat o błędzie)
7. Sprawdza czy są kolejkowane żądania i uruchamia następne tłumaczenie natychmiast
8. Używa mechanizmu lock file + queue file aby zarządzać kolejnością wykonania

## Wymagania

- **launchd** - wbudowany system zarządzania procesami macOS
- **Claude CLI** - zainstalowane i skonfigurowane narzędzie Claude
- **say** - wbudowane narzędzie macOS do syntezy mowy
- **zsh** - shell interpreter

## Sposób użycia

### Uruchomienie przez launchd (zalecane)

#### Dodanie do launchd

1. Utwórz plik konfiguracyjny launchd:
```bash
cat > ~/Library/LaunchAgents/com.datacapt.translate-watcher.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.datacapt.translate-watcher</string>
    <key>ProgramArguments</key>
    <array>
        <string>/Users/bartek/work/datacapt/tools/translate-watcher.sh</string>
    </array>
    <key>WorkingDirectory</key>
    <string>/Users/bartek/work/datacapt</string>
    <key>WatchPaths</key>
    <array>
        <string>/Users/bartek/work/datacapt/frontend/common/intl</string>
    </array>
    <key>StandardOutPath</key>
    <string>/Users/bartek/work/datacapt/tools/translate-watcher.log</string>
    <key>StandardErrorPath</key>
    <string>/Users/bartek/work/datacapt/tools/translate-watcher.log</string>
</dict>
</plist>
EOF
```

2. Załaduj serwis:
```bash
launchctl load ~/Library/LaunchAgents/com.datacapt.translate-watcher.plist
```

3. Uruchom serwis:
```bash
launchctl start com.datacapt.translate-watcher
```

#### Usunięcie z launchd

1. Zatrzymaj serwis:
```bash
launchctl stop com.datacapt.translate-watcher
```

2. Usuń z launchd:
```bash
launchctl unload ~/Library/LaunchAgents/com.datacapt.translate-watcher.plist
```

3. Usuń plik konfiguracyjny:
```bash
rm ~/Library/LaunchAgents/com.datacapt.translate-watcher.plist
```

### Uruchomienie manualne (tylko do testów)

```bash
# Test skryptu (symuluje pojedyncze uruchomienie przez launchd)
cd /Users/bartek/work/datacapt
./tools/translate-watcher.sh
```

**Uwaga**: Skrypt jest teraz przystosowany do uruchomień przez launchd, nie do ciągłego działania.

### Sprawdzenie statusu

```bash
# Sprawdź status serwisu launchd
launchctl list | grep translate-watcher

# Sprawdź szczegóły serwisu
launchctl print user/$(id -u)/com.datacapt.translate-watcher

# Sprawdź logi
tail -f /Users/bartek/work/datacapt/tools/translate-watcher.log
```

## Pliki i katalogi

- **Monitorowany katalog**: `/Users/bartek/work/datacapt/frontend/common/intl`
- **Plik lock**: `/tmp/translate-watcher.lock`
- **Plik queue**: `/tmp/translate-watcher.queue`
- **Plik logów**: `/Users/bartek/work/datacapt/tools/translate-watcher.log`
- **Katalog roboczy**: `/Users/bartek/work/datacapt` (podczas wykonywania Claude)

## Mechanizm lock file i kolejkowania

Skrypt używa dwa pliki do zarządzania kolejnością:

### Lock file (`/tmp/translate-watcher.lock`)
- Zapobiega równoczesnym uruchomieniom procesu tłumaczenia
- Zawiera PID procesu do debugowania
- Automatycznie usuwany po zakończeniu procesu

### Queue file (`/tmp/translate-watcher.queue`)
- Zapisuje timestamp gdy tłumaczenie jest żądane podczas pracy innego procesu
- Sprawdzany po każdym zakończeniu tłumaczenia
- Jeśli istnieje - uruchamia następne tłumaczenie natychmiast
- Pozwala na kolejkowanie maksymalnie jednego żądania (nadpisuje poprzednie)

## Logowanie

Wszystkie zdarzenia są logowane do pliku `tools/translate-watcher.log`:

```bash
# Obserwuj logi na żywo
tail -f tools/translate-watcher.log

# Pokaż ostatnie 20 linii
tail -20 tools/translate-watcher.log
```

Format logów:
```
2025-07-16 14:30:15 - Starting translation process triggered by launchd
2025-07-16 14:30:16 - Created lock file with PID 12345
2025-07-16 14:30:17 - Executing claude translation command...
2025-07-16 14:30:25 - Claude command completed with exit code: 0
2025-07-16 14:30:26 - Removed lock file
2025-07-16 14:30:27 - No queued translation found

# Przy kolejkowaniu:
2025-07-16 14:30:30 - Translation already in progress, queuing request...
2025-07-16 14:30:31 - Queued translation request
2025-07-16 14:30:40 - Found queued translation, scheduling next run...
2025-07-16 14:30:41 - Cleared translation queue
2025-07-16 14:30:41 - Starting translation process triggered by launchd
```

## Zarządzanie procesami

### Sprawdzenie aktywnych procesów
```bash
# Lista procesów tłumaczenia
pgrep -fl translate-watcher

# Status lock i queue plików
ls -la /tmp/translate-watcher.lock /tmp/translate-watcher.queue
```

### Zatrzymywanie procesów
```bash
# Zabij wszystkie procesy translate-watcher
pkill -f translate-watcher

# Zabij konkretny proces (force)
kill -9 <PID>

# Wyczyść pliki lock i queue
rm -f /tmp/translate-watcher.lock /tmp/translate-watcher.queue
```

## Rozwiązywanie problemów

### Problemy z launchd

#### Serwis nie uruchamia się
- Sprawdź składnię pliku plist:
```bash
plutil -lint ~/Library/LaunchAgents/com.datacapt.translate-watcher.plist
```
- Sprawdź uprawnienia do skryptu:
```bash
chmod +x /Users/bartek/work/datacapt/tools/translate-watcher.sh
```

#### Serwis uruchamia się ale nie działa
- Sprawdź logi serwisu:
```bash
tail -f /Users/bartek/work/datacapt/tools/translate-watcher.log
```
- Sprawdź status serwisu:
```bash
launchctl print user/$(id -u)/com.datacapt.translate-watcher
```

### Skrypt nie reaguje na zmiany
- Sprawdź czy serwis jest załadowany: `launchctl list | grep translate-watcher`
- Upewnij się że katalog `frontend/common/intl` istnieje
- Sprawdź uprawnienia do katalogu
- Sprawdź składnię plist: `plutil -lint ~/Library/LaunchAgents/com.datacapt.translate-watcher.plist`

### Błędy Claude CLI
- Sprawdź czy Claude CLI jest zainstalowany i skonfigurowany
- Przetestuj ręcznie: `claude -p "tr"`
- Sprawdź logi skryptu

### Problemy z komunikatami głosowymi
- Sprawdź ustawienia dźwięku w macOS
- Przetestuj ręcznie: `say "test"`

### Plik lock nie jest usuwany
- Usuń ręcznie: `rm /tmp/translate-watcher.lock`
- Sprawdź czy poprzedni proces został zakończony
- Sprawdź czy proces nie zawiesił się: `ps aux | grep translate-watcher`

### Problemy z kolejkowaniem
- Sprawdź czy plik queue istnieje: `ls -la /tmp/translate-watcher.queue`
- Usuń ręcznie plik queue: `rm /tmp/translate-watcher.queue`
- Sprawdź logi pod kątem komunikatów o kolejkowaniu

### Wielokrotne uruchamianie
- Sprawdź czy nie ma zalegających procesów: `ps aux | grep translate-watcher`
- Zatrzymaj wszystkie procesy: `pkill -f translate-watcher`
- Usuń pliki lock i queue: `rm /tmp/translate-watcher.{lock,queue}`

## Przykład uruchomienia

### Przez launchd (zalecane):

```bash
# Dodaj do launchd
cat > ~/Library/LaunchAgents/com.datacapt.translate-watcher.plist << 'EOF'
[...plik plist...]
EOF

# Załaduj i uruchom
launchctl load ~/Library/LaunchAgents/com.datacapt.translate-watcher.plist
launchctl start com.datacapt.translate-watcher

# Sprawdź status
launchctl list | grep translate-watcher
```

### Manualnie (test):

```bash
cd /Users/bartek/work/datacapt
./tools/translate-watcher.sh
```

Wyjście w logach:
```
2025-07-16 14:30:15 - Starting translation process triggered by launchd
# "Rozpoczynam tłumaczenie" (komunikat głosowy)
# Wykonanie claude -p "tr"
# "Tłumaczenie zakończone pomyślnie" (komunikat głosowy)
```