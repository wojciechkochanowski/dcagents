# Statusline script for Windows (PowerShell version)

# Function: Tokyo Night colors
function Get-Colors {
    param([string]$Key)

    switch ($Key) {
        "datacapt" { return "0;122;204" }      # blue
        "obsidian_main" { return "136;85;255" } # purple
        "azure-tui" { return "0;180;100" }     # green
        default { return "255;179;0" }          # yellow/orange
    }
}

# Read JSON from Claude
$input_data = $input | Out-String
if (-not $input_data) {
    Write-Host "❌ No input provided"
    exit 0
}

# Parse JSON
try {
    $json = $input_data | ConvertFrom-Json
    $proj_dir = $json.cwd
    $proj_last = Split-Path $proj_dir -Leaf
    $output_style = if ($json.output_style.name) { $json.output_style.name } else { "" }
    $model_name = if ($json.model.display_name) { $json.model.display_name } else { "unknown" }
}
catch {
    Write-Host "❌ Failed to parse JSON"
    exit 1
}

# Color selection - check full path, not just last element
if ($proj_dir -match "datacapt") {
    $color_key = "datacapt"
} elseif ($proj_dir -match "obsidian_main") {
    $color_key = "obsidian_main"
} elseif ($proj_dir -match "azure-tui") {
    $color_key = "azure-tui"
} else {
    $color_key = $proj_last
}

$bg = Get-Colors -Key $color_key
$bg_color = "`e[48;2;${bg}m"
$fg_white = "`e[38;2;255;255;255m"
$fg_proj = "`e[38;2;${bg}m"
$reset_all = "`e[0m"
$reset_bg = "`e[49m"

# Build statusline
$status = ""

# First part: background + white text
$status += "${bg_color}${fg_white} ${proj_last} ${reset_all}"

# Remaining: text in first color, default background
$status += " ${reset_bg}${fg_proj}${output_style}${reset_all}"

# Model + context
$status += " ${reset_bg}${fg_proj}| ${model_name}${reset_all}"

# Output the statusline
Write-Host $status
