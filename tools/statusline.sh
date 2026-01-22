#!/usr/bin/env bash

# --- Funkcja: kolory Tokyo Night ---
get_colors() {
  case "$1" in
    datacapt) echo "0;122;204" ;;     # niebieski
    obsidian_main) echo "136;85;255" ;; # fioletowy
    azure-tui) echo "0;180;100" ;;    # zielony
    *) echo "255;179;0" ;;            # żółty / pomarańczowy
  esac
}

# --- Czytanie JSON od Claude ---
input=$(cat)
if [ -z "$input" ]; then
  echo "❌ No input provided"
  exit 0
fi

# --- Parsowanie JSON ---
proj_dir=$(echo "$input" | jq -r '.cwd')
proj_last=$(basename "$proj_dir")
output_style=$(echo "$input" | jq -r '.output_style.name // ""')

# Model
model_name=$(echo "$input" | jq -r '.model.display_name // "unknown"')

# --- Dobór kolorów ---
# Sprawdź całą ścieżkę, nie tylko ostatni element
if [[ "$proj_dir" == *"datacapt"* ]]; then
  color_key="datacapt"
elif [[ "$proj_dir" == *"obsidian_main"* ]]; then
  color_key="obsidian_main"
elif [[ "$proj_dir" == *"azure-tui"* ]]; then
  color_key="azure-tui"
else
  color_key="$proj_last"
fi
bg=$(get_colors "$color_key")
bg_color="\e[48;2;${bg}m"
fg_white="\e[38;2;255;255;255m"
fg_proj="\e[38;2;${bg}m"
reset_all="\e[0m"
reset_bg="\e[49m"


# --- Tworzenie statusline ---
status=""

# Pierwszy człon: tło + biały tekst
status+="${bg_color}${fg_white} ${proj_last} ${reset_all}"

# Pozostałe: tekst w kolorze pierwszego, tło domyślne
status+=" ${reset_bg}${fg_proj}${output_style}${reset_all}"

# Model + kontekst
status+=" ${reset_bg}${fg_proj}| ${model_name}${reset_all}"

# --- Wypisanie gotowego statusline ---
# Używamy printf, aby kolory były interpretowane
printf "%b\n" "$status"
