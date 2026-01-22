# Post-subagent hook

# Source common functions
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
. (Join-Path $scriptDir "common.ps1")

# Log subagent stop
$timestamp = Get-Timestamp
Add-Content -Path $script:OVERVIEW_LOG_FILE -Value "SUBAGENT_STOP $timestamp"
