---
description: Analyzes and resolves git merge/rebase conflicts one by one with user approval.
---

## Conflicts Resolve Command

When user types **'/conflicts-resolve'** or **'/cr-git'**, execute these steps:

**CRITICAL**: **NEVER resolve conflicts without user approval** - always explain and confirm before modifying files.

### 1. Check Repository Status

```bash
git status
```

**Verify we are in conflict state:**

- If `rebase in progress` or `merge in progress` with conflicted files → continue
- If no conflicts → inform user "Brak konfliktów do rozwiązania" and exit

### 2. Identify Conflicted Files

Parse `git status` output to list all files with conflicts (marked as `UU`, `AA`, `DU`, `UD`, etc.).

**Report to user:**

- List all conflicted files
- Current operation type (rebase/merge)
- Ask: "Znaleziono X konfliktów. Rozwiązuję po kolei?"

### 3. For Each Conflicted File (Sequential Loop)

#### 3.1 Gather Conflict Data

```bash
# Get commit info for HEAD (current branch changes)
git log --oneline -1 HEAD

# Get commit info for incoming changes (REBASE_HEAD or MERGE_HEAD)
git log --oneline -1 REBASE_HEAD 2>/dev/null || git log --oneline -1 MERGE_HEAD 2>/dev/null

# Show what HEAD commit changed in this file
git show HEAD -- [FILE_PATH]

# Show what incoming commit changed in this file
git show REBASE_HEAD -- [FILE_PATH] 2>/dev/null || git show MERGE_HEAD -- [FILE_PATH] 2>/dev/null
```

#### 3.2 Deep Analysis - Understand Intent (CRITICAL)

**BEFORE proposing any resolution, you MUST understand:**

**For HEAD changes:**

- **WHAT changed?** - specific lines, functions, logic modifications
- **WHY?** - what problem was the commit solving? (bugfix ID, feature, refactoring)
- **EFFECT?** - how does the change impact code behavior?

**For INCOMING changes:**

- **WHAT changed?** - specific lines, functions, logic modifications
- **WHY?** - what problem was the commit solving? (bugfix ID, feature, refactoring)
- **EFFECT?** - how does the change impact code behavior?

**Analysis steps:**

1. Read commit messages carefully - often contain bug IDs or feature descriptions
2. Analyze the diff to understand the actual code change
3. If commit message references a bug/task ID - note it for context
4. Identify if changes are:
   - Independent (can coexist)
   - Overlapping (same problem, different solutions)
   - Dependent (one builds on another)
   - Contradictory (mutually exclusive)

**Ask yourself:**

- Will accepting only HEAD break what INCOMING was trying to fix?
- Will accepting only INCOMING revert what HEAD was trying to fix?
- Can both changes coexist? How?
- Is there a risk of regression if we choose wrong?

#### 3.3 Read File with Conflict Markers

Use Read tool to examine the conflicted file and identify:

- `<<<<<<< HEAD` sections (current branch changes)
- `=======` separator
- `>>>>>>> [commit]` sections (incoming changes)

#### 3.4 Present Analysis to User

**Report in Polish with full context:**

1. **Plik:** [filename]

2. **Zmiana HEAD (aktualna gałąź):**

   - **Commit:** [hash + message]
   - **Co zmienia:** [konkretny opis zmian w kodzie]
   - **Dlaczego:** [cel zmiany - jaki bug naprawia / jaką funkcjonalność dodaje]
   - **Efekt:** [jak zmiana wpływa na działanie]

3. **Zmiana przychodząca:**

   - **Commit:** [hash + message]
   - **Co zmienia:** [konkretny opis zmian w kodzie]
   - **Dlaczego:** [cel zmiany - jaki bug naprawia / jaką funkcjonalność dodaje]
   - **Efekt:** [jak zmiana wpływa na działanie]

4. **Analiza konfliktu:**

   - **Typ:** [independent / overlapping / dependent / contradictory]
   - **Ryzyko regresji:** [co możemy zepsuć wybierając źle]

5. **Rekomendacja:** [szczegółowe uzasadnienie wyboru]

   Explain clearly what each resolution option means in context:

   - **Przyjąć HEAD:** zachowamy [opis co HEAD robi], ale stracimy [opis co INCOMING robi]
   - **Przyjąć INCOMING:** zachowamy [opis co INCOMING robi], ale stracimy [opis co HEAD robi]
   - **Połączyć oba:** [konkretny sposób połączenia - które fragmenty z której strony i dlaczego]

   **Moja rekomendacja:** [wybór] - ponieważ [uzasadnienie oparte na analizie obu zmian]

#### 3.5 Wait for User Decision

Ask: "Jak rozwiązać ten konflikt?"

- Present options based on analysis
- Wait for explicit user approval
- If user asks questions - provide more context from git history

#### 3.6 Apply Resolution

**Only after user confirms:**

1. Edit the file to resolve conflict (remove markers, apply chosen solution)
2. Stage the resolved file:

```bash
git add [FILE_PATH]
```

3. Confirm: "Konflikt w [FILE_PATH] rozwiązany i dodany do staging."

#### 3.7 Check for More Conflicts

```bash
git status
```

- If more conflicted files → continue to next file (go to 3.1)
- If no more conflicts → proceed to step 4

### 4. Complete the Operation

After all conflicts are resolved:

```bash
git status
```

**Ask user:** "Wszystkie konflikty rozwiązane. Kontynuować [rebase/merge]?"

**If user confirms:**

For rebase:

```bash
git rebase --continue
```

For merge:

```bash
git commit  # Will use auto-generated merge commit message
```

### 5. Final Status

```bash
git log --oneline -5
git status
```

**Report:** "Operacja zakończona pomyślnie."

---

## Analysis Guidelines

When analyzing conflicts, look for:

1. **Bugfix conflicts** - Both branches fixing related issues

   - Check commit messages for bug IDs
   - Understand what each fix addresses
   - Often need to combine both fixes

2. **Feature vs bugfix** - New feature conflicts with bug fix

   - Usually preserve both: bugfix logic + feature additions

3. **Refactoring conflicts** - Code structure changes

   - Understand the refactoring goal
   - Apply other changes within new structure

4. **Duplicate solutions** - Both branches solving same problem
   - Choose better implementation
   - Or combine best parts of both

## Safety Rules

- **NEVER** auto-resolve without user approval
- **NEVER** use `git checkout --ours` or `--theirs` without explanation
- **ALWAYS** explain trade-offs of each resolution option
- **ALWAYS** verify file compiles/works after resolution (if possible)
- **PRESERVE** important changes from both sides when possible
