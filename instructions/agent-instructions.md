# Sub-Agent Instructions

## Agent Selection Matrix

**api-requests-manager**: API interfaces, request functions, backend integration
**react-component-creator**: New React components, complex UI features
**less-style-reviewer**: Styling, CSS/LESS modifications, design system compliance
**backend-api-analyzer**: Django backend analysis, data structures, validation rules (read-only)
**backend-creator**: Django backend code creation/modification (models, views, serializers, tasks)
**translation-manager**: Multi-language updates, translation consistency
**cr-xml-enhancer**: Code review documentation, business context analysis

## Execution Pattern

**Sequential Only**: All subagents must be executed one at a time

- ✅ **Correct**: Complete one subagent task, then launch next
- ❌ **Forbidden**: Multiple Task calls in single response
- ❌ **Forbidden**: Parallel subagent execution

**Why Sequential**:

- Simplified logging and validation
- Clear execution order and dependencies
- Easier debugging and monitoring
- No resource conflicts between subagents

**Pattern**: Research → Implementation → Validation → Next task

## Integration Responsibilities

**Main Agent**:

- Initial research
- Delegates work via sub-agents
- Coordinates all subagent outputs
- Resolves naming conflicts between domains
- Tests cross-domain integration
- Validates final system coherence

**Sub-Agents**:

- Execute sequentially, never simultaneously
- Focus on domain expertise only
- Complete fully before next subagent starts
- Report specific deliverables
- No integration responsibilities

## Task Tool Formatting

**CRITICAL**: Start prompts with plain text - NEVER markdown headers

## Prompt Structure

1. **Task**: Clear, specific objective
2. **Context**: Sufficient background for execution
3. **Instructions**: Precise action requirements
4. **Report Format**: Expected output structure

## Common Errors

- **Markdown headers at start** → "Last message was not an assistant message" error
- **Generic instructions** → agent confusion
- **Missing report structure** → unclear deliverables
- **Excessive detail** → cognitive overload
