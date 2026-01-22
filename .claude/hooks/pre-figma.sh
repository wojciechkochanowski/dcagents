#!/bin/bash

# This hook blocks Figma tools if figma.md instructions haven't been read

# --- Configuration ---
source "$(dirname "$0")/common.sh"
REQUIRED_INSTRUCTION="figma.md"

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

# Check if required instruction has been read
if ! check_instruction_read "$REQUIRED_INSTRUCTION"; then
    # Block with denial message
    DENIAL_MESSAGE="REPEAT THIS COMMAND but first you must read the instructions in @instructions/$REQUIRED_INSTRUCTION before you can use Figma tools. Read the file and try again."

    cat << EOF
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "$DENIAL_MESSAGE"
  }
}
EOF
    exit 1
fi

# If we reach here, instruction was read - allow the Figma tool
exit 0