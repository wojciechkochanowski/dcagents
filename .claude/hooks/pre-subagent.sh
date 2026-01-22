#!/bin/bash

# This hook implements state management to ensure only the Main Agent can start a subagent,
# and only after reading the required instructions.

# --- Configuration ---
source "$(dirname "$0")/common.sh"
REQUIRED_INSTRUCTION="agent-instructions.md"

# --- Logic ---


# 2. If we reach here, it means no subagent is active (state file is empty or doesn't exist).
# This must be the Main Agent trying to start a subagent.
# Now, we check if the Main Agent has read the required instructions.
if [ -f "$OVERVIEW_LOG_FILE" ] && grep -q "READ $REQUIRED_INSTRUCTION.*agent" "$OVERVIEW_LOG_FILE"; then
    # Condition met: Instruction has been read.

    # a) Log the start of the subagent.
    echo "SUBAGENT_START $(get_timestamp)" >> "$OVERVIEW_LOG_FILE"

    # b) Clear the subagent log file to start fresh.
    > "$READED_DIR/subagent.log"

    # c) Exit with 0 to allow the Task to proceed.
    exit 0
else
    # Condition not met: Required instruction has not been read.

    # a) Formulate a denial message.
    DENIAL_MESSAGE="REPEAT THIS COMMAND but first you must read the instructions in @instructions/$REQUIRED_INSTRUCTION before you can start a subagent. Read the file and try again."

    cat << EOF
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "$DENIAL_MESSAGE"
  }
}
EOF
    # c) Exit with a non-zero status code to block the Task.
    exit 1
fi
