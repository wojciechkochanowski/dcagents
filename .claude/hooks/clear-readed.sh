#!/bin/bash

# Hook script to clear overview.log at session start
# Fresh start when main agent has clean context

source "$(dirname "$0")/common.sh"

ensure_readed_dir

# Clear entire overview.log file - fresh start for new session
echo "SESSION_START $(get_timestamp)" > "$OVERVIEW_LOG_FILE"


# Exit with code 0 to allow session to start normally
exit 0
