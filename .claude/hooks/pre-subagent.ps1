# This hook implements state management to ensure only the Main Agent can start a subagent,
# and only after reading the required instructions.

# Source common functions
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
. (Join-Path $scriptDir "common.ps1")

$REQUIRED_INSTRUCTION = "agent-instructions.md"

# Check if the Main Agent has read the required instructions
if ((Test-Path $script:OVERVIEW_LOG_FILE) -and (Select-String -Path $script:OVERVIEW_LOG_FILE -Pattern "READ $REQUIRED_INSTRUCTION.*agent" -Quiet)) {
    # Condition met: Instruction has been read.

    # a) Log the start of the subagent.
    $timestamp = Get-Timestamp
    Add-Content -Path $script:OVERVIEW_LOG_FILE -Value "SUBAGENT_START $timestamp"

    # b) Clear the subagent log file to start fresh.
    $subagentLog = Join-Path $script:READED_DIR "subagent.log"
    Set-Content -Path $subagentLog -Value ""

    # c) Exit with 0 to allow the Task to proceed.
    exit 0
} else {
    # Condition not met: Required instruction has not been read.

    # a) Formulate a denial message.
    $denialMessage = "REPEAT THIS COMMAND but first you must read the instructions in @instructions/$REQUIRED_INSTRUCTION before you can start a subagent. Read the file and try again."

    $response = @{
        hookSpecificOutput = @{
            hookEventName = "PreToolUse"
            permissionDecision = "deny"
            permissionDecisionReason = $denialMessage
        }
    } | ConvertTo-Json -Depth 3

    Write-Output $response

    # c) Exit with a non-zero status code to block the Task.
    exit 1
}
