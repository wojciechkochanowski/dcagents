#!/bin/bash

# This hook blocks file edits if required instructions haven't been read

# --- Configuration ---
source "$(dirname "$0")/common.sh"

# Parse file path and command from hook input JSON
JSON_INPUT=$(cat)
log_hook_input "pre-edit" "$JSON_INPUT"
FILE_PATH=$(echo "$JSON_INPUT" | parse_file_path_from_json)
COMMAND=$(echo "$JSON_INPUT" | parse_command_from_json)



# Helper function to check if instruction file was read
check_instruction_read() {
    local instruction_file="$1"

    # Determine which log file to check
    if is_subagent_running; then
        LOG_FILE="$READED_DIR/subagent.log"
    else
        LOG_FILE="$OVERVIEW_LOG_FILE"
    fi

    # Check if instruction file was read
    if [ -f "$LOG_FILE" ] && grep -q "READ $instruction_file" "$LOG_FILE"; then
        return 0  # File was read
    else
        return 1  # File was not read
    fi
}

# Helper function to block with denial message
block_edit() {
    local instruction_file="$1"
    local denial_message="REPEAT THIS COMMAND but first you must read the instructions in @instructions/$instruction_file before you can edit this type of file. Read the file and try again."

    cat << EOF
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "$denial_message"
  }
}
EOF
    exit 1
}

# Check command for language-check-tool
case "$COMMAND" in
    *language-check-tool*)
        if ! check_instruction_read "translations.md"; then
            block_edit "translations.md"
        fi
        ;;
esac

ABS_FILE=$(cd "$(dirname "$FILE_PATH")" && pwd -P)/$(basename "$FILE_PATH")
ABS_DIR=$(cd "$WORKING_DIR" && pwd -P)
if [[ "$ABS_FILE" != "$ABS_DIR"/* ]] && [[ "$FILE_PATH" == *"frontend"* ]]; then
    cat << EOF
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Your frontend code is in $WORKING_DIR. Please move it there and try again."
  }
}
EOF
    exit 1
fi

# Check file type and required instructions
case "$FILE_PATH" in
    *.tsx)
        if ! check_instruction_read "react-components.md"; then
            block_edit "react-components.md"
        fi
        ;;
    *"/common/requests/"*)
        if ! check_instruction_read "api-requests.md"; then
            block_edit "api-requests.md"
        fi
        ;;
    *"/common/intl/"*)
        if ! check_instruction_read "translations.md"; then
            block_edit "translations.md"
        fi
        ;;
    *.less)
        if ! check_instruction_read "less-styles.md"; then
            block_edit "less-styles.md"
        fi
        ;;
    *.py)
        if ! check_instruction_read "backend.md"; then
            block_edit "backend.md"
        fi
        ;;
esac

# If we reach here, all checks passed - allow the edit
exit 0
