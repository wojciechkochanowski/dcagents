# Universal post-edit hook for Datacapt project
# Handles formatting, linting, and validation after file edits

# Source common functions
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
. (Join-Path $scriptDir "common.ps1")

# Parse file path from hook input JSON
$jsonInput = $input | Out-String
$FILE_PATH = Parse-FilePathFromJson -JsonInput $jsonInput

if (-not $FILE_PATH) {
    Write-Error "Error: No file path found in hook input"
    exit 1
}

# Check if file exists
if (-not (Test-Path $FILE_PATH)) {
    Write-Output "Warning: File $FILE_PATH does not exist, skipping hook processing"
    exit 0
}

# Change to frontend directory for proper tool execution
Set-Location $env:WORKING_DIR
if (-not $?) {
    Write-Error "Error: Cannot change to frontend directory"
    exit 1
}

Write-Output "Processing file: $FILE_PATH"

# 1. ALWAYS run Prettier first
Write-Output "Running Prettier..."
$prettierResult = npx prettier --write $FILE_PATH 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Output "✓ Prettier formatting completed"
} else {
    Write-Output "⚠ Prettier formatting failed or not applicable"
}

# 2. Run linting checks for different file types
$LINT_ERRORS = ""
$LINT_PASSED = ""

$extension = [System.IO.Path]::GetExtension($FILE_PATH)

switch -Regex ($extension) {
    '\.(ts|tsx)$' {
        Write-Output "Running ESLint check..."
        $eslintOutput = pnpm eslint $FILE_PATH 2>&1 | Out-String
        if ($eslintOutput -match '✖.*problems') {
            $LINT_ERRORS += "$eslintOutput`n"
        } else {
            $LINT_PASSED += "✓ ESLint check passed`n"
        }

        Write-Output "Running TypeScript check..."
        $tsgoPath = Join-Path $env:WORKING_DIR ".claude\ts\tsgo"
        $tsconfigPath = Join-Path $env:WORKING_DIR ".claude\ts\tsconfig.json"
        $tsgoOutput = & $tsgoPath --project $tsconfigPath --noEmit 2>&1 | Out-String
        if ($LASTEXITCODE -ne 0) {
            $LINT_ERRORS += "$tsgoOutput`n"
        } else {
            $LINT_PASSED += "✓ TypeScript check passed`n"
        }
    }
    '\.(js|jsx)$' {
        Write-Output "Running ESLint check..."
        $eslintOutput = pnpm eslint $FILE_PATH 2>&1 | Out-String
        if ($eslintOutput -match '✖.*problems') {
            $LINT_ERRORS += "$eslintOutput`n"
        } else {
            $LINT_PASSED += "✓ ESLint check passed`n"
        }
    }
    '\.(less|css|scss)$' {
        $LINT_PASSED += "✓ Style file processed`n"
    }
    default {
        $LINT_PASSED += "✓ File type processed (no specific linting)`n"
    }
}

# Output results
if ($LINT_ERRORS) {
    Write-Error $LINT_ERRORS
    exit 2
} else {
    Write-Output $LINT_PASSED
}

# 3. Special handling for LESS files
if ($extension -eq ".less") {
    Write-Error "🎨 LESS FILE - CHECK DESIGN SYSTEM VARIABLES MANDATORY!"
    Write-Error "- Replace undefined variables with correct ones"
    Write-Error "- Replace hardcoded values with design system variables (only if variable exists)"
    exit 2
}

Write-Output "Hook processing completed for: $FILE_PATH"

# Exit with 0 to show output in transcript (Ctrl-R)
exit 0
