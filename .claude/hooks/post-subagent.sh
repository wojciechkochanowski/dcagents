#!/bin/bash

source "$(dirname "$0")/common.sh"

# Log subagent stop
echo "SUBAGENT_STOP $(get_timestamp)" >> "$OVERVIEW_LOG_FILE"