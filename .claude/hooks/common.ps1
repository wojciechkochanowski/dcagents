# Common functions for hooks (PowerShell version)

# Capture working directory at hook start (before any cd operations)
# This is the directory where Claude was launched from
if (-not $env:WORKING_DIR) {
    $env:WORKING_DIR = $PWD.Path
}

# Constants - handle both /datacapt and /datacapt/frontend working directories
$script:READED_DIR = Join-Path $env:WORKING_DIR "logs"
$script:OVERVIEW_LOG_FILE = Join-Path $script:READED_DIR "overview.log"
$script:HOOKS_LOG_FILE = Join-Path $script:READED_DIR "hooks.log"

function Get-Timestamp {
    return Get-Date -Format "yyyy-MM-dd HH:mm:ss"
}

function Ensure-ReadedDir {
    if (-not (Test-Path $script:READED_DIR)) {
        New-Item -ItemType Directory -Path $script:READED_DIR -Force | Out-Null
    }
    # Clear hooks log at the start of each session if SESSION_START exists
    if ((Test-Path $script:OVERVIEW_LOG_FILE) -and (Select-String -Path $script:OVERVIEW_LOG_FILE -Pattern "^SESSION_START" -Quiet)) {
        Set-Content -Path $script:HOOKS_LOG_FILE -Value ""
    }
}

function Parse-FilePathFromJson {
    param([string]$JsonInput)

    if ($JsonInput -match '"file_path":"([^"]*)"') {
        return $matches[1]
    }
    return $null
}

function Parse-CommandFromJson {
    param([string]$JsonInput)

    if ($JsonInput -match '"command":"([^"]*)"') {
        return $matches[1]
    }
    return $null
}

function Log-HookInput {
    param(
        [string]$HookName,
        [string]$JsonInput
    )

    Ensure-ReadedDir
    $timestamp = Get-Timestamp
    Add-Content -Path $script:HOOKS_LOG_FILE -Value "$timestamp $HookName`: $JsonInput"
}

function Is-SubagentRunning {
    Ensure-ReadedDir

    if (-not (Test-Path $script:OVERVIEW_LOG_FILE)) {
        $timestamp = Get-Timestamp
        Add-Content -Path $script:OVERVIEW_LOG_FILE -Value "AGENT_CHECK $timestamp main_agent (no_log_file)"
        return $false  # No log file = main agent
    }

    # Read file from bottom to top, look for first occurrence of SUBAGENT_START or SUBAGENT_STOP
    $content = Get-Content $script:OVERVIEW_LOG_FILE
    [array]::Reverse($content)
    $lastSubagentEvent = $content | Where-Object { $_ -match "SUBAGENT_(START|STOP)" } | Select-Object -First 1

    $timestamp = Get-Timestamp
    if ($lastSubagentEvent -match "SUBAGENT_START") {
        Add-Content -Path $script:OVERVIEW_LOG_FILE -Value "AGENT_CHECK $timestamp subagent"
        return $true  # Subagent is running
    } else {
        Add-Content -Path $script:OVERVIEW_LOG_FILE -Value "AGENT_CHECK $timestamp main_agent"
        return $false  # Main agent is running
    }
}

# Export functions for use in other scripts
Export-ModuleMember -Function Get-Timestamp, Ensure-ReadedDir, Parse-FilePathFromJson, Parse-CommandFromJson, Log-HookInput, Is-SubagentRunning -Variable READED_DIR, OVERVIEW_LOG_FILE, HOOKS_LOG_FILE
