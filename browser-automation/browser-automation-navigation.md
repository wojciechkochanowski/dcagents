# App Navigation Instructions - MCP Browser Automation

## Map Directory - Navigation Memory

**`~/work/datacapt/dcagents/browser-automation/map/` serves as navigation memory**

- MD files in directory correspond to app pages/sections
- **USE these files during navigation** - check for existing descriptions before exploring
- Files contain cross-references (wiki links) between sections for easy navigation
- These are page types/templates, not specific data-driven pages

## Navigation Memory Usage

**Scenario**: User wants you to go to user settings

1. **Check map**: Open `~/work/datacapt/dcagents/browser-automation/map/main-menu.md` to see Settings access
2. **Use cross-reference**: Find link to `[[settings/main-settings]]` in main-menu.md
3. **Check details**: Open `settings/main-settings.md` for available options
4. **Navigate directly**: Go to `http://localhost:3000/en/settings/users` based on map info

## Page Information Methods

### Preferred Methods (DOM Reading)

- Avoid `mcp__chrome-devtools__take_screenshot` unless visual assessment needed
- Get all page info **via snapshot and DOM manipulation**:
  - **Main method**: `mcp__chrome-devtools__take_snapshot` - gives page structure with uid
  - **For JavaScript**: `mcp__chrome-devtools__evaluate_script` with JS function
  - Get fragments as JSON/text, not images when possible
- Use `mcp__chrome-devtools__evaluate_script` to check page elements
- Wait for dynamic elements: `mcp__chrome-devtools__wait_for`

### When Screenshots Allowed

- `mcp__chrome-devtools__take_screenshot` only when snapshot can't read structure (canvas, SVG without text, graphically rendered dynamic elements)
- Visual analysis uses many tokens – avoid for content extraction only

### When to Stop Element Search

If logged in but can't find target element after extended search or going in circles:
End search and inform user of failure.

## Special UI Elements

### Searchable Dropdown

- **Problem**: Dropdown options hard to handle with simple click
- **Solution**: Use search in dropdown input field
- **Method**:
  1. `mcp__chrome-devtools__take_snapshot` - get element uid
  2. `mcp__chrome-devtools__click` - click dropdown to open
  3. `mcp__chrome-devtools__fill` - type search text (input field uid)
  4. Use JavaScript to press Enter
- **Chrome DevTools MCP Example**:
  ```
  mcp__chrome-devtools__evaluate_script
  function: () => {
    const input = document.querySelector('.ant-select-selection-search-input, input[role="combobox"]');
    if (input) {
      input.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Enter', code: 'Enter', which: 13, keyCode: 13, bubbles: true
      }));
    }
  }
  ```

### App Logout

- **Method 1 (preferred)**: Click user dropdown menu and select "Log out":
  1. `mcp__chrome-devtools__take_snapshot` - find user initials uid
  2. `mcp__chrome-devtools__click` - click user initials (uid from snapshot)
  3. `mcp__chrome-devtools__click` - click "Log out" (uid from new snapshot)
- **Method 2 (fallback)**: Clear session via JavaScript:
  ```
  mcp__chrome-devtools__evaluate_script
  function: () => {
    sessionStorage.clear();
    localStorage.clear();
    document.cookie.split(";").forEach(c =>
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
    );
    window.location.href = "/en/auth/signin";
  }
  ```
- **Method 3**: `mcp__chrome-devtools__navigate_page` to `/logout` or `/en/logout`
- **Result**: Redirect to login page
