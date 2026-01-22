#!/bin/bash

# This hook tracks when instruction files are read and logs the event to a single log file.

# --- Configuration ---
source "$(dirname "$0")/common.sh"

# List of filenames that are considered instruction files.
INSTRUCTION_FILES=("agent-instructions.md" "react-components.md" "api-requests.md" "translations.md" "less-styles.md" "figma.md" "backend.md")

# --- Logic ---

# Parse file path from hook input JSON
JSON_INPUT=$(cat)
log_hook_input "track-instructions-read" "$JSON_INPUT"
FILE_PATH=$(echo "$JSON_INPUT" | parse_file_path_from_json)

# Extract just the filename from the full path
FILENAME=$(basename "$FILE_PATH")

# Check if the read file is one of the instruction files.
IS_INSTRUCTION=false
for inst_file in "${INSTRUCTION_FILES[@]}"; do
    if [[ "$inst_file" == "$FILENAME" ]]; then
        IS_INSTRUCTION=true
        break
    fi
done

if [ "$IS_INSTRUCTION" = true ]; then
    ensure_readed_dir

    # agent-instructions.md should ALWAYS go to overview, regardless of context
    if [[ "$FILENAME" == "agent-instructions.md" ]]; then
        LOG_FILE="$OVERVIEW_LOG_FILE"
        LOG_ENTRY="READ $FILENAME $(get_timestamp) agent"
    # Other instruction files follow subagent context
    elif is_subagent_running; then
        LOG_FILE="$READED_DIR/subagent.log"
        LOG_ENTRY="READ $FILENAME $(get_timestamp) subagent"
    else
        LOG_FILE="$OVERVIEW_LOG_FILE"
        LOG_ENTRY="READ $FILENAME $(get_timestamp) agent"
    fi

    echo "$LOG_ENTRY" >> "$LOG_FILE"
fi

# Exit with code 0 to allow the tool to proceed normally
exit 0
