#!/bin/bash

# validate-cr-xml.sh - Comprehensive XML validation script for Code Review system
# Author: Claude Code Analysis
# Date: 2025-09-09

set -uo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CR_DIFF_DIR="cr/diff-viewer/public/diffs"
SPEC_FILE="cr/spec.md"
TEMP_FILE="/tmp/xml_validation.tmp"

# Options
SYNTAX_ONLY=false
VALIDATION_MODE="full"  # full, pre, post

# Counters
TOTAL_FILES=0
SYNTAX_PASS=0
SPEC_PASS=0
WARNINGS=0
ERRORS=0

print_header() {
    echo -e "${BLUE}================================"
    echo "CR-XML VALIDATION SCRIPT"
    echo "Date: $(date)"
    echo -e "================================${NC}"
    echo
}

print_section() {
    echo -e "${BLUE}--- $1 ---${NC}"
}

print_success() {
    echo -e "  ${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "  ${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

print_error() {
    echo -e "  ${RED}✗${NC} $1"
    ((ERRORS++))
}

check_dependencies() {
    print_section "Checking Dependencies"
    
    if ! command -v xmllint &> /dev/null; then
        print_error "xmllint not found. Please install libxml2-utils"
        exit 1
    fi
    print_success "xmllint found"
    
    if [ ! -f "$SPEC_FILE" ]; then
        print_error "Spec file not found: $SPEC_FILE"
        exit 1
    fi
    print_success "Spec file found: $SPEC_FILE"
    
    if [ ! -d "$CR_DIFF_DIR" ]; then
        print_error "Diff directory not found: $CR_DIFF_DIR"
        exit 1
    fi
    print_success "Diff directory found: $CR_DIFF_DIR"
    echo
}

validate_xml_syntax() {
    local file="$1"
    local filename=$(basename "$file")
    
    if xmllint --noout "$file" 2>/dev/null; then
        print_success "XML syntax valid: $filename"
        ((SYNTAX_PASS++))
        return 0
    else
        print_error "XML syntax invalid: $filename"
        xmllint --noout "$file" 2>&1 | sed 's/^/    /' || true
        return 1
    fi
}

check_required_elements() {
    local file="$1"
    local filename=$(basename "$file")
    local has_issues=0
    
    # Check for required root elements based on mode
    local required_elements=("metadata" "descriptions" "split-view")
    
    # In pre mode, comments and review-status are optional
    if [ "$VALIDATION_MODE" = "full" ] || [ "$VALIDATION_MODE" = "post" ]; then
        required_elements+=("comments" "review-status")
    fi
    
    for element in "${required_elements[@]}"; do
        if ! grep -q "<$element>" "$file"; then
            if [ "$VALIDATION_MODE" = "pre" ] && [[ "$element" = "comments" || "$element" = "review-status" ]]; then
                print_warning "Missing optional element (pre-enhancement): <$element> in $filename"
            else
                print_error "Missing required element: <$element> in $filename"
                has_issues=1
            fi
        fi
    done
    
    # Check metadata structure
    if ! grep -q '<file path=' "$file"; then
        print_error "Missing <file path=> in metadata: $filename"
        has_issues=1
    fi
    
    if ! grep -q '<created timestamp=' "$file"; then
        print_error "Missing <created timestamp=> in metadata: $filename"
        has_issues=1
    fi
    
    if ! grep -q '<reviewer' "$file"; then
        print_error "Missing <reviewer> in metadata: $filename"
        has_issues=1
    fi
    
    return $has_issues
}

check_comments_structure() {
    local file="$1"
    local filename=$(basename "$file")
    local has_issues=0
    
    # Check if comments section exists and has proper structure
    if grep -q "<comments>" "$file"; then
        # Check if comments section is empty (which is valid)
        if grep -q '<comments></comments>' "$file"; then
            # Empty comments section is valid
            print_success "Empty comments section (valid): $filename"
        elif grep -q '<comment.*line-ref.*author.*timestamp' "$file"; then
            # Check for required sub-elements in comments
            if ! grep -q '<text>' "$file"; then
                print_error "Comments missing <text> elements: $filename"
                has_issues=1
            fi
            if ! grep -q '<status>' "$file"; then
                print_error "Comments missing <status> elements: $filename"
                has_issues=1
            fi
            if ! grep -q '<thread-id>' "$file"; then
                print_error "Comments missing <thread-id> elements: $filename"
                has_issues=1
            fi
        else
            print_error "Invalid comment structure (missing required attributes): $filename"
            has_issues=1
        fi
    else
        print_warning "No comments section found: $filename"
    fi
    
    return $has_issues
}

check_review_status_structure() {
    local file="$1"
    local filename=$(basename "$file")
    local has_issues=0
    
    if grep -q "<review-status>" "$file"; then
        # Check for proper review-status structure according to spec
        if grep -q '<line-status.*line-ref.*status.*reviewer.*timestamp' "$file"; then
            print_success "Proper line-status structure: $filename"
        else
            # Check for old incorrect structure
            if grep -q '<overall-status>.*</overall-status>' "$file" || grep -q '<business-validation>' "$file"; then
                print_error "Incorrect review-status structure (old format): $filename"
                print_error "  Should use: <line-status line-ref=\"...\" status=\"...\" reviewer=\"...\" timestamp=\"...\" />"
                print_error "  Should use: <overall-status status=\"...\" reviewer=\"...\" timestamp=\"...\" />"
                has_issues=1
            fi
        fi
        
        if grep -q '<overall-status.*status.*reviewer.*timestamp' "$file"; then
            print_success "Proper overall-status structure: $filename"
        else
            print_error "Missing or incorrect overall-status structure: $filename"
            has_issues=1
        fi
    else
        print_error "Missing review-status section: $filename"
        has_issues=1
    fi
    
    return $has_issues
}

check_description_refs() {
    local file="$1"
    local filename=$(basename "$file")
    local has_issues=0
    
    # Get all description IDs
    local desc_ids=$(grep -o 'description id="[^"]*"' "$file" | sed 's/description id="//; s/"//' | sort -u)
    
    if [ -n "$desc_ids" ]; then
        # Check if description-refs are properly used in line-pairs
        while read -r desc_id; do
            if ! grep -q "description-ref.*$desc_id" "$file"; then
                print_warning "Description $desc_id not referenced in line-pairs: $filename"
            fi
        done <<< "$desc_ids"
    fi
    
    return $has_issues
}

validate_spec_compliance() {
    local file="$1"
    local filename=$(basename "$file")
    local issues=0
    
    echo -e "    ${BLUE}Checking spec compliance:${NC} $filename"
    
    # Check required elements
    check_required_elements "$file"
    issues=$((issues + $?))
    
    # Check comments structure
    check_comments_structure "$file"
    issues=$((issues + $?))
    
    # Check review-status structure
    check_review_status_structure "$file"
    issues=$((issues + $?))
    
    # Check description references
    check_description_refs "$file"
    issues=$((issues + $?))
    
    if [ $issues -eq 0 ]; then
        print_success "Spec compliance passed: $filename"
        ((SPEC_PASS++))
        return 0
    else
        print_error "Spec compliance failed: $filename ($issues issues)"
        return 1
    fi
}

generate_report() {
    print_section "VALIDATION REPORT"
    echo -e "Total files processed: ${BLUE}$TOTAL_FILES${NC}"
    echo -e "XML syntax passed: ${GREEN}$SYNTAX_PASS${NC}/$TOTAL_FILES"
    echo -e "Spec compliance passed: ${GREEN}$SPEC_PASS${NC}/$TOTAL_FILES"
    echo -e "Warnings: ${YELLOW}$WARNINGS${NC}"
    echo -e "Errors: ${RED}$ERRORS${NC}"
    echo
    
    if [ $ERRORS -eq 0 ]; then
        if [ $WARNINGS -eq 0 ]; then
            echo -e "${GREEN}✓ ALL VALIDATIONS PASSED${NC}"
            exit 0
        else
            echo -e "${YELLOW}⚠ VALIDATION PASSED WITH WARNINGS${NC}"
            exit 0
        fi
    else
        echo -e "${RED}✗ VALIDATION FAILED${NC}"
        exit 1
    fi
}

main() {
    print_header
    check_dependencies
    
    print_section "XML Syntax Validation"
    
    # Find all XML files except list.xml
    for file in "$CR_DIFF_DIR"/*.xml; do
        if [ -f "$file" ] && [ "$(basename "$file")" != "list.xml" ]; then
            ((TOTAL_FILES++))
            validate_xml_syntax "$file"
        fi
    done
    
    # Skip spec validation if syntax-only mode
    if [ "$SYNTAX_ONLY" = false ]; then
        echo
        print_section "Spec Compliance Validation (Mode: $VALIDATION_MODE)"
        
        # Check spec compliance
        for file in "$CR_DIFF_DIR"/*.xml; do
            if [ -f "$file" ] && [ "$(basename "$file")" != "list.xml" ]; then
                validate_spec_compliance "$file"
            fi
        done
    fi
    
    echo
    generate_report
}

# Help function
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo "Validate XML files in the Code Review system"
    echo
    echo "Options:"
    echo "  -h, --help          Show this help message"
    echo "  -d, --dir DIR       Specify diff directory (default: $CR_DIFF_DIR)"
    echo "  -s, --spec FILE     Specify spec file (default: $SPEC_FILE)"
    echo "  --syntax-only       Only validate XML syntax, skip spec compliance"
    echo "  --mode MODE         Validation mode: full|pre|post (default: full)"
    echo "                      pre  = before enhancement (comments/review-status optional)"
    echo "                      post = after enhancement (strict compliance required)"
    echo "                      full = complete validation (default)"
    echo
    echo "Examples:"
    echo "  $0                                    # Full validation with default settings"
    echo "  $0 --syntax-only                     # Quick XML syntax check only"
    echo "  $0 --mode=pre                        # Before enhancement validation"
    echo "  $0 --mode=post                       # After enhancement validation"
    echo "  $0 -d custom/diff/dir --mode=pre     # Custom directory, pre-enhancement mode"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -d|--dir)
            CR_DIFF_DIR="$2"
            shift 2
            ;;
        -s|--spec)
            SPEC_FILE="$2"
            shift 2
            ;;
        --syntax-only)
            SYNTAX_ONLY=true
            shift
            ;;
        --mode=*)
            VALIDATION_MODE="${1#*=}"
            if [[ "$VALIDATION_MODE" != "full" && "$VALIDATION_MODE" != "pre" && "$VALIDATION_MODE" != "post" ]]; then
                echo "Invalid mode: $VALIDATION_MODE. Use: full, pre, or post"
                exit 1
            fi
            shift
            ;;
        --mode)
            VALIDATION_MODE="$2"
            if [[ "$VALIDATION_MODE" != "full" && "$VALIDATION_MODE" != "pre" && "$VALIDATION_MODE" != "post" ]]; then
                echo "Invalid mode: $VALIDATION_MODE. Use: full, pre, or post"
                exit 1
            fi
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Run main function
main