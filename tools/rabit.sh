#!/bin/bash

# CodeRabbit CLI script with project instructions
# Usage: ./rabit.sh [coderabbit arguments]
# Usage: ./rabit.sh tui [coderabbit arguments] - runs without --prompt-only

# Change to frontend directory
cd /Users/bartek/work/datacapt/frontend || {
    echo "Error: Cannot change to frontend directory"
    exit 1
}

# Check if first argument is 'tui'
if [ "$1" = "tui" ]; then
    # Remove 'tui' from arguments
    shift
    # Run coderabbit without --prompt-only
    coderabbit review \
        -c /Users/bartek/work/datacapt/CLAUDE.md \
        -c /Users/bartek/work/datacapt/instructions/translations.md \
        -c /Users/bartek/work/datacapt/instructions/react-components.md \
        -c /Users/bartek/work/datacapt/instructions/less-styles.md \
        -c /Users/bartek/work/datacapt/instructions/design-system.md \
        -c /Users/bartek/work/datacapt/instructions/api-requests.md \
        "$@"
else
    # Run coderabbit with --prompt-only
    coderabbit review \
        --prompt-only \
        -c /Users/bartek/work/datacapt/CLAUDE.md \
        -c /Users/bartek/work/datacapt/instructions/translations.md \
        -c /Users/bartek/work/datacapt/instructions/react-components.md \
        -c /Users/bartek/work/datacapt/instructions/less-styles.md \
        -c /Users/bartek/work/datacapt/instructions/design-system.md \
        -c /Users/bartek/work/datacapt/instructions/api-requests.md \
        "$@"
fi