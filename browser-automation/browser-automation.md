# MCP Browser Automation Instructions

## ⚠️ CRITICAL: Ask User First

**ALWAYS ASK USER BEFORE USING BROWSER AUTOMATION**

Browser automation is often:

- Complex and time-consuming
- Prone to failures and debugging
- Slower than direct code inspection
- Not always necessary

**Ask user:** "Do you want me to check this in the browser, or would you prefer I analyze the code directly?"

Only proceed with browser automation if user explicitly confirms.

## Basic Info

- App at http://localhost:3000 (notify user if server down)
- Fixtures in `~/work/datacapt/dcagents/browser-automation/fixtures/` loaded on reset
  - Admin credentials in `~/work/datacapt/dcagents/browser-automation/fixtures/users.ts`
  - Test studies: `~/work/datacapt/dcagents/browser-automation/fixtures/100_CYPRESS.json` + `160_CL.json`
- Dynamic app - data can be added/removed

## Configuration

- **Screen sizes**:
  - **Navigation default**: Tablet `width: 768, height: 1024`
  - **Design review default**: Laptop `width: 1366, height: 768`
  - **Other**: Desktop `width: 1920, height: 1080`, Mobile `width: 375, height: 667`
- **Headless mode**: Chrome DevTools MCP runs headless automatically

## Login Process

**STEP BY STEP:**

1. **Navigate to app:**

   ```
   mcp__chrome-devtools__new_page
   url: http://localhost:3000
   ```

2. **Get page snapshot:**

   ```
   mcp__chrome-devtools__take_snapshot
   ```

3. **Fill email:**

   ```
   mcp__chrome-devtools__fill
   uid: [uid_from_snapshot]
   value: admin@cypress.datacapt
   ```

4. **Fill password:**

   ```
   mcp__chrome-devtools__fill
   uid: [uid_from_snapshot]
   value: qweASD123_
   ```

5. **Click login:**

   ```
   mcp__chrome-devtools__click
   uid: [uid_from_snapshot]
   ```

6. **Verify:** Should see Studies page

   ```
   mcp__chrome-devtools__wait_for
   text: "Studies"
   ```

**CRITICAL NOTES:**

- **ALWAYS use `mcp__chrome-devtools__take_snapshot` before interaction** to get element uid
- Use element uid instead of CSS selectors
- Admin login: `admin@cypress.datacapt` / `qweASD123_`
- App redirects to Studies list after login

**Chrome DevTools MCP Commands:**

- `mcp__chrome-devtools__new_page` - open new page
- `mcp__chrome-devtools__take_snapshot` - get page structure with uid
- `mcp__chrome-devtools__fill` - fill field (requires uid)
- `mcp__chrome-devtools__click` - click element (requires uid)
- `mcp__chrome-devtools__wait_for` - wait for text on page
- `mcp__chrome-devtools__navigate_page` - go to URL
- `mcp__chrome-devtools__take_screenshot` - capture screen

## 🗺️ MANDATORY: Page Mapping

**When you visit any page:**

1. **Check if page is mapped**: Look for existing file in `~/work/datacapt/dcagents/browser-automation/map/`
2. **If unmapped or outdated**: Read `~/work/datacapt/dcagents/browser-automation/browser-automation-mapping.md` first
3. **Then create/update** mapping file as instructed

**This is NOT optional** - every browser session must contribute to map knowledge.

## Specialized Instructions

Choose appropriate instructions based on role:

### For navigation and information gathering agents

📖 **Read**: `~/work/datacapt/dcagents/browser-automation/browser-automation-navigation.md`

### For page mapping agents in map/ directory

🗺️ **Read**: `~/work/datacapt/dcagents/browser-automation/browser-automation-mapping.md`
