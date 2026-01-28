# Translation watcher script for Windows (PowerShell version)
# Uses FileSystemWatcher instead of launchd WatchPaths

$LOCK_FILE = Join-Path $env:TEMP "translate-watcher.lock"
$QUEUE_FILE = Join-Path $env:TEMP "translate-watcher.queue"
$LOG_FILE = "C:\praca\datacapt\dcagents\tools\translate-watcher.log"
$WATCH_PATH = "C:\praca\datacapt\frontend\common\intl"

# Function to log messages
function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content -Path $LOG_FILE -Value "$timestamp - $Message"
}

# Function to check if lock file exists
function Test-Lock {
    if (Test-Path $LOCK_FILE) {
        Write-Log "Translation already in progress, queuing request..."
        return $true
    }
    return $false
}

# Function to create lock file
function New-Lock {
    $PID | Out-File -FilePath $LOCK_FILE
    Write-Log "Created lock file with PID $PID"
}

# Function to remove lock file
function Remove-Lock {
    if (Test-Path $LOCK_FILE) {
        $lockPid = Get-Content $LOCK_FILE -ErrorAction SilentlyContinue
        if ($lockPid -eq $PID) {
            Remove-Item $LOCK_FILE -Force
            Write-Log "Removed lock file"
        } else {
            Write-Log "Lock file belongs to different process (PID: $lockPid), not removing"
        }
    }
}

# Function to queue translation request
function Add-ToQueue {
    Get-Date -Format "yyyy-MM-dd HH:mm:ss" | Out-File -FilePath $QUEUE_FILE
    Write-Log "Queued translation request"
}

# Function to check if translation is queued
function Test-Queue {
    return Test-Path $QUEUE_FILE
}

# Function to clear queue
function Clear-Queue {
    if (Test-Path $QUEUE_FILE) {
        Remove-Item $QUEUE_FILE -Force
        Write-Log "Cleared translation queue"
    }
}

# Function to speak text (Windows SAPI)
function Invoke-Speech {
    param([string]$Text)
    Add-Type -AssemblyName System.Speech
    $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
    $synth.Speak($Text)
}

# Function to execute translation
function Invoke-Translation {
    Write-Log "Starting translation process triggered by FileSystemWatcher"

    # Announce start
    Invoke-Speech -Text "Checking translations"

    # Change to project directory
    Set-Location "C:\praca\datacapt"

    # Execute claude translation command
    Write-Log "Executing claude translation command..."
    try {
        $result = claude -p "uruchom instrukcje z C:/praca/datacapt/dcagents/.claude/commands/translate.md" 2>&1
        $exitCode = $LASTEXITCODE

        Write-Log "Claude command completed with exit code: $exitCode"
        Write-Log "Claude output: $result"

        # Announce completion
        if ($exitCode -eq 0) {
            Invoke-Speech -Text $result
        } else {
            Invoke-Speech -Text "Translation failed"
            Invoke-Speech -Text $result
        }
    }
    catch {
        Write-Log "Error executing claude: $_"
        Invoke-Speech -Text "Translation error"
    }
}

# Function to schedule next translation
function Invoke-NextTranslation {
    if (Test-Queue) {
        Write-Log "Found queued translation, scheduling next run..."
        Clear-Queue
        Start-Sleep -Seconds 2
        # Re-execute this script
        Write-Log "About to exec: $PSCommandPath"
        & $PSCommandPath
    } else {
        Write-Log "No queued translation found"
    }
}

# Main watcher function using synchronous WaitForChanged (more reliable)
function Start-TranslationWatcher {
    Write-Host "Starting Translation Watcher..."
    Write-Host "Watching: $WATCH_PATH"
    Write-Log "Translation watcher started"

    # Create FileSystemWatcher
    $watcher = New-Object System.IO.FileSystemWatcher
    $watcher.Path = $WATCH_PATH
    $watcher.Filter = "*.json"
    $watcher.IncludeSubdirectories = $false

    Write-Host "Translation watcher is running. Press Ctrl+C to stop."

    # Synchronous polling approach - avoids runspace scope issues
    try {
        while ($true) {
            # Wait for change (blocking call with 5 second timeout)
            $result = $watcher.WaitForChanged([System.IO.WatcherChangeTypes]::Changed -bor [System.IO.WatcherChangeTypes]::Created, 5000)

            if (-not $result.TimedOut) {
                Write-Log "Detected change: $($result.Name) - $($result.ChangeType)"
                Write-Host "Detected change: $($result.Name)"

                # Debounce - wait for file to be fully written
                Start-Sleep -Seconds 2

                # Check if lock exists
                if (Test-Lock) {
                    Add-ToQueue
                    continue
                }

                # Create lock file
                New-Lock

                try {
                    # Execute translation
                    Invoke-Translation
                }
                finally {
                    # Remove lock file
                    Remove-Lock

                    # Check for queued translations and schedule next run
                    Invoke-NextTranslation
                }
            }
        }
    }
    finally {
        # Cleanup
        $watcher.Dispose()
        Write-Log "Translation watcher stopped"
    }
}

# Run the watcher
Start-TranslationWatcher
