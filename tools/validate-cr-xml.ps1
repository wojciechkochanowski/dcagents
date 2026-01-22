# validate-cr-xml.ps1 - Comprehensive XML validation script for Code Review system
# PowerShell version

param(
    [switch]$Help,
    [string]$Dir = "cr/diff-viewer/public/diffs",
    [string]$Spec = "cr/spec.md",
    [switch]$SyntaxOnly,
    [ValidateSet("full", "pre", "post")]
    [string]$Mode = "full"
)

# Configuration
$CR_DIFF_DIR = $Dir
$SPEC_FILE = $Spec
$VALIDATION_MODE = $Mode

# Counters
$script:TOTAL_FILES = 0
$script:SYNTAX_PASS = 0
$script:SPEC_PASS = 0
$script:WARNINGS = 0
$script:ERRORS = 0

function Print-Header {
    Write-Host "================================" -ForegroundColor Blue
    Write-Host "CR-XML VALIDATION SCRIPT"
    Write-Host "Date: $(Get-Date)"
    Write-Host "================================" -ForegroundColor Blue
    Write-Host ""
}

function Print-Section {
    param([string]$Title)
    Write-Host "--- $Title ---" -ForegroundColor Blue
}

function Print-Success {
    param([string]$Message)
    Write-Host "  ✓ $Message" -ForegroundColor Green
}

function Print-Warning {
    param([string]$Message)
    Write-Host "  ⚠ $Message" -ForegroundColor Yellow
    $script:WARNINGS++
}

function Print-Error {
    param([string]$Message)
    Write-Host "  ✗ $Message" -ForegroundColor Red
    $script:ERRORS++
}

function Check-Dependencies {
    Print-Section "Checking Dependencies"

    # Check for xmllint
    $xmllint = Get-Command xmllint -ErrorAction SilentlyContinue
    if (-not $xmllint) {
        Print-Error "xmllint not found. Please install libxml2"
        exit 1
    }
    Print-Success "xmllint found"

    # Check spec file
    if (-not (Test-Path $SPEC_FILE)) {
        Print-Error "Spec file not found: $SPEC_FILE"
        exit 1
    }
    Print-Success "Spec file found: $SPEC_FILE"

    # Check diff directory
    if (-not (Test-Path $CR_DIFF_DIR)) {
        Print-Error "Diff directory not found: $CR_DIFF_DIR"
        exit 1
    }
    Print-Success "Diff directory found: $CR_DIFF_DIR"
    Write-Host ""
}

function Validate-XmlSyntax {
    param([string]$FilePath)

    $filename = Split-Path $FilePath -Leaf

    $result = xmllint --noout $FilePath 2>&1
    if ($LASTEXITCODE -eq 0) {
        Print-Success "XML syntax valid: $filename"
        $script:SYNTAX_PASS++
        return $true
    } else {
        Print-Error "XML syntax invalid: $filename"
        $result | ForEach-Object { Write-Host "    $_" }
        return $false
    }
}

function Check-RequiredElements {
    param([string]$FilePath)

    $filename = Split-Path $FilePath -Leaf
    $content = Get-Content $FilePath -Raw
    $hasIssues = 0

    # Check for required root elements based on mode
    $requiredElements = @("metadata", "descriptions", "split-view")

    # In pre mode, comments and review-status are optional
    if ($VALIDATION_MODE -eq "full" -or $VALIDATION_MODE -eq "post") {
        $requiredElements += @("comments", "review-status")
    }

    foreach ($element in $requiredElements) {
        if ($content -notmatch "<$element>") {
            if ($VALIDATION_MODE -eq "pre" -and ($element -eq "comments" -or $element -eq "review-status")) {
                Print-Warning "Missing optional element (pre-enhancement): <$element> in $filename"
            } else {
                Print-Error "Missing required element: <$element> in $filename"
                $hasIssues = 1
            }
        }
    }

    # Check metadata structure
    if ($content -notmatch '<file path=') {
        Print-Error "Missing <file path=> in metadata: $filename"
        $hasIssues = 1
    }

    if ($content -notmatch '<created timestamp=') {
        Print-Error "Missing <created timestamp=> in metadata: $filename"
        $hasIssues = 1
    }

    if ($content -notmatch '<reviewer') {
        Print-Error "Missing <reviewer> in metadata: $filename"
        $hasIssues = 1
    }

    return $hasIssues
}

function Check-CommentsStructure {
    param([string]$FilePath)

    $filename = Split-Path $FilePath -Leaf
    $content = Get-Content $FilePath -Raw
    $hasIssues = 0

    if ($content -match "<comments>") {
        if ($content -match '<comments></comments>') {
            Print-Success "Empty comments section (valid): $filename"
        } elseif ($content -match '<comment.*line-ref.*author.*timestamp') {
            if ($content -notmatch '<text>') {
                Print-Error "Comments missing <text> elements: $filename"
                $hasIssues = 1
            }
            if ($content -notmatch '<status>') {
                Print-Error "Comments missing <status> elements: $filename"
                $hasIssues = 1
            }
            if ($content -notmatch '<thread-id>') {
                Print-Error "Comments missing <thread-id> elements: $filename"
                $hasIssues = 1
            }
        } else {
            Print-Error "Invalid comment structure (missing required attributes): $filename"
            $hasIssues = 1
        }
    } else {
        Print-Warning "No comments section found: $filename"
    }

    return $hasIssues
}

function Check-ReviewStatusStructure {
    param([string]$FilePath)

    $filename = Split-Path $FilePath -Leaf
    $content = Get-Content $FilePath -Raw
    $hasIssues = 0

    if ($content -match "<review-status>") {
        if ($content -match '<line-status.*line-ref.*status.*reviewer.*timestamp') {
            Print-Success "Proper line-status structure: $filename"
        } else {
            if ($content -match '<overall-status>.*</overall-status>' -or $content -match '<business-validation>') {
                Print-Error "Incorrect review-status structure (old format): $filename"
                Print-Error "  Should use: <line-status line-ref=`"...`" status=`"...`" reviewer=`"...`" timestamp=`"...`" />"
                Print-Error "  Should use: <overall-status status=`"...`" reviewer=`"...`" timestamp=`"...`" />"
                $hasIssues = 1
            }
        }

        if ($content -match '<overall-status.*status.*reviewer.*timestamp') {
            Print-Success "Proper overall-status structure: $filename"
        } else {
            Print-Error "Missing or incorrect overall-status structure: $filename"
            $hasIssues = 1
        }
    } else {
        Print-Error "Missing review-status section: $filename"
        $hasIssues = 1
    }

    return $hasIssues
}

function Validate-SpecCompliance {
    param([string]$FilePath)

    $filename = Split-Path $FilePath -Leaf
    $issues = 0

    Write-Host "    Checking spec compliance: $filename" -ForegroundColor Blue

    $issues += Check-RequiredElements -FilePath $FilePath
    $issues += Check-CommentsStructure -FilePath $FilePath
    $issues += Check-ReviewStatusStructure -FilePath $FilePath

    if ($issues -eq 0) {
        Print-Success "Spec compliance passed: $filename"
        $script:SPEC_PASS++
        return $true
    } else {
        Print-Error "Spec compliance failed: $filename ($issues issues)"
        return $false
    }
}

function Generate-Report {
    Print-Section "VALIDATION REPORT"
    Write-Host "Total files processed: $($script:TOTAL_FILES)" -ForegroundColor Blue
    Write-Host "XML syntax passed: $($script:SYNTAX_PASS)/$($script:TOTAL_FILES)" -ForegroundColor Green
    Write-Host "Spec compliance passed: $($script:SPEC_PASS)/$($script:TOTAL_FILES)" -ForegroundColor Green
    Write-Host "Warnings: $($script:WARNINGS)" -ForegroundColor Yellow
    Write-Host "Errors: $($script:ERRORS)" -ForegroundColor Red
    Write-Host ""

    if ($script:ERRORS -eq 0) {
        if ($script:WARNINGS -eq 0) {
            Write-Host "✓ ALL VALIDATIONS PASSED" -ForegroundColor Green
            exit 0
        } else {
            Write-Host "⚠ VALIDATION PASSED WITH WARNINGS" -ForegroundColor Yellow
            exit 0
        }
    } else {
        Write-Host "✗ VALIDATION FAILED" -ForegroundColor Red
        exit 1
    }
}

function Show-Help {
    Write-Host "Usage: .\validate-cr-xml.ps1 [OPTIONS]"
    Write-Host "Validate XML files in the Code Review system"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -Help               Show this help message"
    Write-Host "  -Dir DIR            Specify diff directory (default: $CR_DIFF_DIR)"
    Write-Host "  -Spec FILE          Specify spec file (default: $SPEC_FILE)"
    Write-Host "  -SyntaxOnly         Only validate XML syntax, skip spec compliance"
    Write-Host "  -Mode MODE          Validation mode: full|pre|post (default: full)"
    Write-Host "                      pre  = before enhancement (comments/review-status optional)"
    Write-Host "                      post = after enhancement (strict compliance required)"
    Write-Host "                      full = complete validation (default)"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\validate-cr-xml.ps1                           # Full validation with default settings"
    Write-Host "  .\validate-cr-xml.ps1 -SyntaxOnly               # Quick XML syntax check only"
    Write-Host "  .\validate-cr-xml.ps1 -Mode pre                 # Before enhancement validation"
    Write-Host "  .\validate-cr-xml.ps1 -Mode post                # After enhancement validation"
    Write-Host "  .\validate-cr-xml.ps1 -Dir custom/diff/dir -Mode pre  # Custom directory, pre-enhancement mode"
}

# Main function
function Main {
    if ($Help) {
        Show-Help
        exit 0
    }

    Print-Header
    Check-Dependencies

    Print-Section "XML Syntax Validation"

    # Find all XML files except list.xml
    $xmlFiles = Get-ChildItem -Path $CR_DIFF_DIR -Filter "*.xml" | Where-Object { $_.Name -ne "list.xml" }

    foreach ($file in $xmlFiles) {
        $script:TOTAL_FILES++
        Validate-XmlSyntax -FilePath $file.FullName
    }

    # Skip spec validation if syntax-only mode
    if (-not $SyntaxOnly) {
        Write-Host ""
        Print-Section "Spec Compliance Validation (Mode: $VALIDATION_MODE)"

        foreach ($file in $xmlFiles) {
            Validate-SpecCompliance -FilePath $file.FullName
        }
    }

    Write-Host ""
    Generate-Report
}

# Run main function
Main
