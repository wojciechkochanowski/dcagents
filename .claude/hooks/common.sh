#!/bin/bash

# Common functions for hooks

# Capture working directory at hook start (before any cd operations)
# This is the directory where Claude was launched from
WORKING_DIR="${WORKING_DIR:-$PWD}"

# Constants - handle both /datacapt and /datacapt/frontend working directories
READED_DIR="$WORKING_DIR/logs"
OVERVIEW_LOG_FILE="$READED_DIR/overview.log"
HOOKS_LOG_FILE="$READED_DIR/hooks.log"

get_timestamp() {
    date '+%Y-%m-%d %H:%M:%S'
}

ensure_readed_dir() {
    mkdir -p "$READED_DIR"
    # Clear hooks log at the start of each session if SESSION_START exists
    if [ -f "$OVERVIEW_LOG_FILE" ] && grep -q "^SESSION_START" "$OVERVIEW_LOG_FILE"; then
        > "$HOOKS_LOG_FILE"
    fi
}

parse_file_path_from_json() {
    local hook_input=$(cat)
    echo "$hook_input" | grep -o '"file_path":"[^"]*"' | cut -d'"' -f4
}

parse_command_from_json() {
    local hook_input=$(cat)
    echo "$hook_input" | grep -o '"command":"[^"]*"' | cut -d'"' -f4
}

log_hook_input() {
    local hook_name="$1"
    local json_input="$2"
    ensure_readed_dir
    echo "$(get_timestamp) $hook_name: $json_input" >> "$HOOKS_LOG_FILE"
}

is_subagent_running() {
    ensure_readed_dir

    if [[ ! -f "$OVERVIEW_LOG_FILE" ]]; then
        echo "AGENT_CHECK $(get_timestamp) main_agent (no_log_file)" >> "$OVERVIEW_LOG_FILE"
        return 1  # No log file = main agent
    fi

    # Read file from bottom to top, look for first occurrence of SUBAGENT_START or SUBAGENT_STOP
    local last_subagent_event=$(tail -r "$OVERVIEW_LOG_FILE" | grep -E "SUBAGENT_(START|STOP)" | head -n 1)

    if [[ "$last_subagent_event" == *"SUBAGENT_START"* ]]; then
        echo "AGENT_CHECK $(get_timestamp) subagent" >> "$OVERVIEW_LOG_FILE"
        return 0  # Subagent is running
    else
        echo "AGENT_CHECK $(get_timestamp) main_agent" >> "$OVERVIEW_LOG_FILE"
        return 1  # Main agent is running
    fi
}
