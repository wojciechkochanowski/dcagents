#!/bin/sh

# katalog źródłowy
SOURCE_DIR="$HOME/work/datacapt/dcagents"

# katalog docelowy
TARGET_DIR="$HOME/work/datacapt"

# upewnij się, że katalog docelowy istnieje
mkdir -p "$TARGET_DIR"

# lista plików i katalogów do powiązania
ITEMS="
.claude
.opencode
AGENTS.md
CLAUDE.md
GEMINI.md
opencode.json
tools
"

# przejdź do katalogu docelowego
cd "$TARGET_DIR" || exit 1

# twórz linki symboliczne
for item in $ITEMS; do
  ln -sfn "$SOURCE_DIR/$item" "$item"
done
