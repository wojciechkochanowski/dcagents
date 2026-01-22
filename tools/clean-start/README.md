# clean-start CLI script

`clean-start.zsh` automates resetting the local backend tenant and loading the Clean Start fixture packages.

## Prerequisites

- Docker compose services (`app`, `db`) available w katalogu `backend/`
- Fixture JSON files stored w katalogu wskazanym przez `--fixtures-dir` (domyślnie `dcagents/tools/clean-start/`; zawiera również `clean-start-users.json`)

## Usage

```bash
# Default: tenant=develop, fixtures + users from script directory
./clean-start.zsh

# Inny tenant i katalog fixtur
./clean-start.zsh --tenant staging --fixtures-dir ~/fixtures/datacapt/clean-start
```

### Options

| Flag | Description |
| ---- | ----------- |
| `--tenant TENANT` | Tenant schema to reset (default `develop`) |
| `--fixtures-dir DIR` | Directory containing fixture JSON files (default: script directory) |
| `--users-json FILE` | Optional additional users dump to load |
| `--extra-fixtures FILE` | Additional fixture files (repeatable) |

### Sequence

1. Stop backend container `app`
2. Drop & recreate Postgres schema
3. Run migrations
4. Create tenant + update permissions
5. Load fixture packages in deterministic order (files present in directory)
6. Load optional extra fixtures
7. Restart backend `app`

### Example with extra fixtures

```bash
./clean-start.zsh \
  --tenant develop \
  --fixtures-dir ~/fixtures/datacapt/clean-start \
  --extra-fixtures ~/fixtures/datacapt/custom/custom-payments.json \
  --extra-fixtures ~/fixtures/datacapt/custom/custom-recruitment.json
```

### Notes

- Script runs commands from `backend/` directory.
- Default users (`admin@datacapt.test` / `qweASD123_`) są ładowani automatycznie z `clean-start-users.json` (skrypt kopiuje fixtury do katalogu tymczasowego `backend/clean-start-fixtures-tmp`).
- All docker compose commands assume local `compose.yml` configuration.
- Ensure fixtures use PK ranges documented in `tmp/clean-start-mapping.md`.
