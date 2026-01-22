# CodeRabbit CLI script with project instructions
# Usage: .\rabit.ps1 [coderabbit arguments]
# Usage: .\rabit.ps1 tui [coderabbit arguments] - runs without --prompt-only

# Change to frontend directory
Set-Location "C:\praca\datacapt\frontend"
if (-not $?) {
    Write-Error "Error: Cannot change to frontend directory"
    exit 1
}

$contextFiles = @(
    "-c", "C:\praca\datacapt\CLAUDE.md",
    "-c", "C:\praca\datacapt\instructions\translations.md",
    "-c", "C:\praca\datacapt\instructions\react-components.md",
    "-c", "C:\praca\datacapt\instructions\less-styles.md",
    "-c", "C:\praca\datacapt\instructions\design-system.md",
    "-c", "C:\praca\datacapt\instructions\api-requests.md"
)

# Check if first argument is 'tui'
if ($args[0] -eq "tui") {
    # Remove 'tui' from arguments
    $remainingArgs = $args[1..($args.Length-1)]

    # Run coderabbit without --prompt-only
    & coderabbit review @contextFiles @remainingArgs
} else {
    # Run coderabbit with --prompt-only
    & coderabbit review --prompt-only @contextFiles @args
}
