# Link script for Windows (PowerShell version)
# Note: Creating symlinks on Windows requires Administrator privileges

# Source directory
$SOURCE_DIR = "C:\praca\datacapt\dcagents"

# Target directory
$TARGET_DIR = "C:\praca\datacapt"

# Ensure target directory exists
if (-not (Test-Path $TARGET_DIR)) {
    New-Item -ItemType Directory -Path $TARGET_DIR -Force | Out-Null
}

# List of files and directories to link
$ITEMS = @(
    ".claude",
    ".opencode",
    "AGENTS.md",
    "CLAUDE.md",
    "GEMINI.md",
    "opencode.json",
    "tools"
)

# Change to target directory
Set-Location $TARGET_DIR

# Create symbolic links
foreach ($item in $ITEMS) {
    $sourcePath = Join-Path $SOURCE_DIR $item
    $targetPath = Join-Path $TARGET_DIR $item

    # Remove existing link/file if it exists
    if (Test-Path $targetPath) {
        Remove-Item $targetPath -Force -Recurse -ErrorAction SilentlyContinue
    }

    # Create symbolic link (requires admin privileges)
    try {
        New-Item -ItemType SymbolicLink -Path $targetPath -Target $sourcePath -Force | Out-Null
        Write-Host "Created symlink: $targetPath -> $sourcePath"
    }
    catch {
        Write-Warning "Failed to create symlink for $item. Try running as Administrator."
        Write-Warning "Error: $_"
    }
}

Write-Host "Link script completed."
