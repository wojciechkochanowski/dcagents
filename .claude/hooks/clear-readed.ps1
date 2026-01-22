# Hook script to clear overview.log at session start
# Fresh start when main agent has clean context

# Source common functions
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
. (Join-Path $scriptDir "common.ps1")

Ensure-ReadedDir

# Clear entire overview.log file - fresh start for new session
$timestamp = Get-Timestamp
Set-Content -Path $script:OVERVIEW_LOG_FILE -Value "SESSION_START $timestamp"

# Exit with code 0 to allow session to start normally
exit 0
