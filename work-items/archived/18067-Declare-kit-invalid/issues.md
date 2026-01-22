# Issues: 18067 - Declare a Kit as Invalid

## Known Issues
*No issues identified yet*

## Potential Risks
- **Backend endpoint dependency:** Frontend implementation can proceed with placeholder, but testing requires backend
- **Permission conflicts:** Must ensure allocation.edit properly scoped
- **Visual confusion:** Invalid vs undo states must be clearly distinct

## Dependencies  
- Backend PUT endpoint implementation
- Design system invalid/warning color tokens availability
- Existing AllocationButtonControl stability

## Questions for Clarification
*None pending*