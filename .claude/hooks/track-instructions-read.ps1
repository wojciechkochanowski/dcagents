# This hook tracks when instruction files are read and logs the event to a single log file.

# Source common functions
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
. (Join-Path $scriptDir "common.ps1")

# List of filenames that are considered instruction files.
$INSTRUCTION_FILES = @("agent-instructions.md", "react-components.md", "api-requests.md", "translations.md", "less-styles.md", "figma.md", "backend.md")

# Parse file path from hook input JSON
$jsonInput = $input | Out-String
Log-HookInput -HookName "track-instructions-read" -JsonInput $jsonInput
$FILE_PATH = Parse-FilePathFromJson -JsonInput $jsonInput

# Extract just the filename from the full path
$FILENAME = [System.IO.Path]::GetFileName($FILE_PATH)

# Check if the read file is one of the instruction files.
$IS_INSTRUCTION = $INSTRUCTION_FILES -contains $FILENAME

if ($IS_INSTRUCTION) {
    Ensure-ReadedDir

    $timestamp = Get-Timestamp

    # agent-instructions.md should ALWAYS go to overview, regardless of context
    if ($FILENAME -eq "agent-instructions.md") {
        $logFile = $script:OVERVIEW_LOG_FILE
        $logEntry = "READ $FILENAME $timestamp agent"
    }
    # Other instruction files follow subagent context
    elseif (Is-SubagentRunning) {
        $logFile = Join-Path $script:READED_DIR "subagent.log"
        $logEntry = "READ $FILENAME $timestamp subagent"
    }
    else {
        $logFile = $script:OVERVIEW_LOG_FILE
        $logEntry = "READ $FILENAME $timestamp agent"
    }

    Add-Content -Path $logFile -Value $logEntry
}

# Exit with code 0 to allow the tool to proceed normally
exit 0
