#!/bin/zsh

# Translation watcher script for launchd
# Triggered by launchd WatchPaths when files change in frontend/common/intl

LOCK_FILE="/tmp/translate-watcher.lock"
QUEUE_FILE="/tmp/translate-watcher.queue"
LOG_FILE="/Users/bartek/work/datacapt/tools/translate-watcher.log"

# Function to log messages
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# Function to check if lock file exists
check_lock() {
    if [[ -f "$LOCK_FILE" ]]; then
        log "Translation already in progress, queuing request..."
        return 1
    fi
    return 0
}

# Function to create lock file
create_lock() {
    echo $$ > "$LOCK_FILE"
    log "Created lock file with PID $$"
}

# Function to remove lock file
remove_lock() {
    if [[ -f "$LOCK_FILE" ]]; then
        local lock_pid=$(cat "$LOCK_FILE" 2>/dev/null)
        if [[ "$lock_pid" == "$$" ]]; then
            rm "$LOCK_FILE"
            log "Removed lock file"
        else
            log "Lock file belongs to different process (PID: $lock_pid), not removing"
        fi
    fi
}

# Function to queue translation request
queue_translation() {
    echo "$(date '+%Y-%m-%d %H:%M:%S')" > "$QUEUE_FILE"
    log "Queued translation request"
}

# Function to check if translation is queued
check_queue() {
    [[ -f "$QUEUE_FILE" ]]
}

# Function to clear queue
clear_queue() {
    if [[ -f "$QUEUE_FILE" ]]; then
        rm "$QUEUE_FILE"
        log "Cleared translation queue"
    fi
}

# Function to execute translation
execute_translation() {
    log "Starting translation process triggered by launchd"
    
    # Set PATH to include homebrew
    export PATH="/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
    
    # Announce start
    say  -v "Evan" "Checking translations"
    
    # Change to project directory
    cd "/Users/bartek/work/datacapt"
    
    # Execute claude translation command
    log "Executing claude translation command..."
    result=$(claude -p "uruchom instrukcje z ~/work/datacapt/.claude/commands/translate.md" 2>&1)
    exit_code=$?
    
    log "Claude command completed with exit code: $exit_code"
    log "Claude output: $result"
    
    # Announce completion
    if [[ $exit_code -eq 0 ]]; then
        say -v "Evan" "$result"
    else
        say -v "Evan" "Translation failed"
        say -v "Evan" "$result"
    fi
}

# Function to schedule next translation
schedule_next() {
    if check_queue; then
        log "Found queued translation, scheduling next run..."
        clear_queue
        sleep 2
        # Re-execute this script
        log "About to exec: $0"
        exec "/Users/bartek/work/datacapt/tools/translate-watcher.sh"
    else
        log "No queued translation found"
    fi
}

# Cleanup function
cleanup() {
    remove_lock
    exit 0
}

# Set trap for cleanup
trap cleanup EXIT INT TERM

# Check if lock exists
if ! check_lock; then
    queue_translation
    exit 0
fi

# Create lock file
create_lock

# Execute translation
execute_translation

# Remove lock file
remove_lock

# Check for queued translations and schedule next run
schedule_next

# Clear trap
trap - EXIT INT TERM
