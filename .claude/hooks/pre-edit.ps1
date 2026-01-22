# This hook blocks file edits if required instructions haven't been read

# Source common functions
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
. (Join-Path $scriptDir "common.ps1")

# Parse file path and command from hook input JSON
$jsonInput = $input | Out-String
Log-HookInput -HookName "pre-edit" -JsonInput $jsonInput
$FILE_PATH = Parse-FilePathFromJson -JsonInput $jsonInput
$COMMAND = Parse-CommandFromJson -JsonInput $jsonInput

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

# Helper function to block with denial message
function Block-Edit {
    param([string]$InstructionFile)

    $denialMessage = "REPEAT THIS COMMAND but first you must read the instructions in @instructions/$InstructionFile before you can edit this type of file. Read the file and try again."

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

# Check command for language-check-tool
if ($COMMAND -match "language-check-tool") {
    if (-not (Check-InstructionRead -InstructionFile "translations.md")) {
        Block-Edit -InstructionFile "translations.md"
    }
}

# Check if file is in frontend directory but outside working directory
if ($FILE_PATH) {
    $absFile = (Resolve-Path $FILE_PATH -ErrorAction SilentlyContinue).Path
    $absDir = (Resolve-Path $env:WORKING_DIR -ErrorAction SilentlyContinue).Path

    if ($absFile -and $absDir -and (-not $absFile.StartsWith($absDir)) -and ($FILE_PATH -match "frontend")) {
        $response = @{
            hookSpecificOutput = @{
                hookEventName = "PreToolUse"
                permissionDecision = "deny"
                permissionDecisionReason = "Your frontend code is in $env:WORKING_DIR. Please move it there and try again."
            }
        } | ConvertTo-Json -Depth 3

        Write-Output $response
        exit 1
    }
}

# Check file type and required instructions
if ($FILE_PATH) {
    $extension = [System.IO.Path]::GetExtension($FILE_PATH)

    switch -Regex ($FILE_PATH) {
        '\.tsx$' {
            if (-not (Check-InstructionRead -InstructionFile "react-components.md")) {
                Block-Edit -InstructionFile "react-components.md"
            }
        }
        '/common/requests/' {
            if (-not (Check-InstructionRead -InstructionFile "api-requests.md")) {
                Block-Edit -InstructionFile "api-requests.md"
            }
        }
        '/common/intl/' {
            if (-not (Check-InstructionRead -InstructionFile "translations.md")) {
                Block-Edit -InstructionFile "translations.md"
            }
        }
        '\.less$' {
            if (-not (Check-InstructionRead -InstructionFile "less-styles.md")) {
                Block-Edit -InstructionFile "less-styles.md"
            }
        }
        '\.py$' {
            if (-not (Check-InstructionRead -InstructionFile "backend.md")) {
                Block-Edit -InstructionFile "backend.md"
            }
        }
    }
}

# If we reach here, all checks passed - allow the edit
exit 0
