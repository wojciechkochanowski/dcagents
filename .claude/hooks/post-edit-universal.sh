#!/bin/bash

# Universal post-edit hook for Datacapt project
# Handles formatting, linting, and validation after file edits

source "$(dirname "$0")/common.sh"

# Parse file path from hook input JSON
FILE_PATH=$(parse_file_path_from_json)

if [ -z "$FILE_PATH" ]; then
    echo "Error: No file path found in hook input"
    exit 1
fi

# Check if file exists
if [ ! -f "$FILE_PATH" ]; then
    echo "Warning: File $FILE_PATH does not exist, skipping hook processing"
    exit 0
fi

# Change to frontend directory for proper tool execution
cd "$WORKING_DIR" || {
    echo "Error: Cannot change to frontend directory"
    exit 1
}

echo "Processing file: $FILE_PATH"

# 1. ALWAYS run Prettier first
echo "Running Prettier..."
npx prettier --write "$FILE_PATH" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✓ Prettier formatting completed"
else
    echo "⚠ Prettier formatting failed or not applicable"
fi

# 2. Run linting checks for different file types
LINT_ERRORS=""
LINT_PASSED=""

case "$FILE_PATH" in
    *.ts|*.tsx)
        echo "Running ESLint check..."
        ESLINT_OUTPUT=$(pnpm eslint "$FILE_PATH" 2>&1)
        if echo "$ESLINT_OUTPUT" | grep -q "✖.*problems"; then
            LINT_ERRORS="$LINT_ERRORS$ESLINT_OUTPUT\n"
        else
            LINT_PASSED="$LINT_PASSED✓ ESLint check passed\n"
        fi
        
        echo "Running TypeScript check..."
        TSGO_OUTPUT=$("$WORKING_DIR/.claude/ts/tsgo" --project "$WORKING_DIR/.claude/ts/tsconfig.json" --noEmit 2>&1)
        TSGO_EXIT_CODE=$?
        if [ $TSGO_EXIT_CODE -ne 0 ]; then
            LINT_ERRORS="$LINT_ERRORS$TSGO_OUTPUT\n"
        else
            LINT_PASSED="$LINT_PASSED✓ TypeScript check passed\n"
        fi
        ;;
    *.js|*.jsx)
        echo "Running ESLint check..."
        ESLINT_OUTPUT=$(pnpm eslint "$FILE_PATH" 2>&1)
        if echo "$ESLINT_OUTPUT" | grep -q "✖.*problems"; then
            LINT_ERRORS="$LINT_ERRORS$ESLINT_OUTPUT\n"
        else
            LINT_PASSED="$LINT_PASSED✓ ESLint check passed\n"
        fi
        ;;
    *.less|*.css|*.scss)
        LINT_PASSED="$LINT_PASSED✓ Style file processed\n"
        ;;
    *)
        LINT_PASSED="$LINT_PASSED✓ File type processed (no specific linting)\n"
        ;;
esac

# Output results
if [ -n "$LINT_ERRORS" ]; then
    echo -e "$LINT_ERRORS" >&2
    exit 2
else
    echo -e "$LINT_PASSED"
fi

# 3. Special handling for LESS files
case "$FILE_PATH" in
    *.less)
        echo "🎨 LESS FILE - CHECK DESIGN SYSTEM VARIABLES MANDATORY!" >&2
        echo "- Replace undefined variables with correct ones" >&2
        echo "- Replace hardcoded values with design system variables (only if variable exists)" >&2
        exit 2
        ;;
esac

echo "Hook processing completed for: $FILE_PATH"

# Exit with 0 to show output in transcript (Ctrl-R)
exit 0
