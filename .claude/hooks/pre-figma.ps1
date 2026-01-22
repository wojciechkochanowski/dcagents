# This hook blocks Figma tools if figma.md instructions haven't been read

# Source common functions
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
. (Join-Path $scriptDir "common.ps1")

$REQUIRED_INSTRUCTION = "figma.md"

# Helper function to check if instruction file was read
function Check-InstructionRead {
    param([string]$InstructionFile)

    # Determine which log file to check
    if (Is-SubagentRunning) {
        $logFile = Join-Path $script:READED_DIR "subagent.log"
    } else {
        $logFile = $script:OVERVIEW_LOG_FILE
    }

    # Check if instruction file was read
    if ((Test-Path $logFile) -and (Select-String -Path $logFile -Pattern "READ $InstructionFile" -Quiet)) {
        return $true  # File was read
    } else {
        return $false  # File was not read
    }
}

# Check if required instruction has been read
if (-not (Check-InstructionRead -InstructionFile $REQUIRED_INSTRUCTION)) {
    # Block with denial message
    $denialMessage = "REPEAT THIS COMMAND but first you must read the instructions in @instructions/$REQUIRED_INSTRUCTION before you can use Figma tools. Read the file and try again."

    $response = @{
        hookSpecificOutput = @{
            hookEventName = "PreToolUse"
            permissionDecision = "deny"
            permissionDecisionReason = $denialMessage
        }
    } | ConvertTo-Json -Depth 3

    Write-Output $response
    exit 1
}

# If we reach here, instruction was read - allow the Figma tool
exit 0
