#!/usr/bin/env zsh
# Usage: clean-start.zsh --tenant develop --fixtures-dir ~/fixtures/datacapt/clean-start

set -euo pipefail
print() { echo "$@"; }

usage() {
  cat <<USAGE
Usage: ${0} [--tenant TENANT] [--fixtures-dir DIR] [--users-json FILE] [--extra-fixtures FILE...]

Options:
  --tenant TENANT             Tenant schema to reset (default: develop)
  --fixtures-dir DIR          Directory containing clean-start fixture JSON files (default: script directory)
  --users-json FILE           Optional additional users JSON to load after core fixtures
  --extra-fixtures FILE       Additional fixture JSON files to load (can be repeated)
  -h, --help                  Show this help message
USAGE
}

TENANT="develop"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FIXTURES_DIR="$SCRIPT_DIR"
USERS_JSON=""
EXTRA_FIXTURES=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --tenant)
      TENANT="$2"; shift 2 ;;
    --fixtures-dir)
      FIXTURES_DIR="$2"; shift 2 ;;
    --users-json)
      USERS_JSON="$2"; shift 2 ;;
    --extra-fixtures)
      EXTRA_FIXTURES+=("$2"); shift 2 ;;
    -h|--help)
      usage; exit 0 ;;
    *)
      echo "Unknown argument: $1" >&2 ; usage; exit 1 ;;
  esac
done

if [[ ! -d "$FIXTURES_DIR" ]]; then
  echo "Fixtures directory not found: $FIXTURES_DIR" >&2
  exit 1
fi
FIXTURES_DIR="$(cd "$FIXTURES_DIR" && pwd)"

if [[ -n "$USERS_JSON" && -f "$USERS_JSON" ]]; then
  USERS_JSON="$(cd "$(dirname "$USERS_JSON")" && pwd)/$(basename "$USERS_JSON")"
fi

if [[ ${#EXTRA_FIXTURES[@]} -gt 0 ]]; then
  ABS_EXTRA_FIXTURES=()
  for extra in "${EXTRA_FIXTURES[@]}"; do
    if [[ -f "$extra" ]]; then
      ABS_EXTRA_FIXTURES+=("$(cd "$(dirname "$extra")" && pwd)/$(basename "$extra")")
    else
      ABS_EXTRA_FIXTURES+=("$extra")
    fi
  done
  EXTRA_FIXTURES=("${ABS_EXTRA_FIXTURES[@]}")
fi

REPO_ROOT="$(cd "$SCRIPT_DIR/../../../" && pwd)"
BACKEND_DIR="$REPO_ROOT/backend"
BACKEND_TESTS_DIR="$BACKEND_DIR/backend/tests"
CYPRESS_FIXTURES_DIR="$BACKEND_TESTS_DIR/cypress_studies"

if [[ ! -d "$CYPRESS_FIXTURES_DIR" ]]; then
  echo "Cypress fixtures directory not found: $CYPRESS_FIXTURES_DIR" >&2
  exit 1
fi

cd "$BACKEND_DIR"

POSTGRES_ENV=".envs/.local/.postgres"
DB_USER="$(grep "^POSTGRES_USER=" "$POSTGRES_ENV" | cut -d= -f2)"
DB_NAME="$(grep "^POSTGRES_DB=" "$POSTGRES_ENV" | cut -d= -f2)"
[[ -z "$DB_USER" ]] && DB_USER="backend"
[[ -z "$DB_NAME" ]] && DB_NAME="backend"

COPIED_FIXTURES=()

cleanup_copied() {
  for file in "${COPIED_FIXTURES[@]}"; do
    rm -f "$file"
  done
}

trap cleanup_copied EXIT

copy_to_cypress() {
  local src="$1"
  local basename="$(basename "$src")"
  local dest="$CYPRESS_FIXTURES_DIR/$basename"

  if [[ -e "$dest" ]]; then
    if cmp -s "$src" "$dest"; then
      echo "$basename"
      return
    fi
    echo "Fixture already exists in Cypress directory with different content: $dest" >&2
    exit 1
  fi

  cp "$src" "$dest"
  COPIED_FIXTURES+=("$dest")
  echo "$basename"
}

print "[1/8] Ensuring backend container is stopped"
docker compose stop app >/dev/null 2>&1 || true

print "[2/8] Resetting PostgreSQL schema for tenant $TENANT"
docker compose exec -T db psql -U "$DB_USER" -d "$DB_NAME" -c "DROP SCHEMA IF EXISTS "$TENANT" CASCADE;" >/dev/null
docker compose exec -T db psql -U "$DB_USER" -d "$DB_NAME" -c "CREATE SCHEMA "$TENANT";" >/dev/null

print "[3/8] Running Django migrations"
docker compose run --rm -e ZERO_DOWNTIME_MIGRATIONS_RAISE_FOR_UNSAFE=False app ./manage.py migrate >/dev/null

print "[4/8] Creating tenant $TENANT"
docker compose run --rm app sh -c "ZERO_DOWNTIME_MIGRATIONS_RAISE_FOR_UNSAFE=False ./manage.py create_tenant --schema_name=$TENANT --name=$TENANT --base_url=localhost:3000/ --domain-domain=localhost --domain-is_primary=True --epro_enabled=True --econsult_enabled=True --econsent_enabled=True --subject_sharing_enabled=True --data_analysis_enabled=True --randomisation_seed=2147483647 --esignature_enabled=False --subject_repository_enabled=True --recruitment_enabled=True --lsa_enabled=True --external_api=True --external_api_key=0jB8pJ7pMm7VguwlWLB6wT31xROkSoDJA8a8nVzI72r4XLX0 --api_enabled=True --side_by_side_enabled=True --payments_enabled=True --calendar_enabled=True --sent_sms_count=1 --min_password_length=8 --default_currency=PLN --noinput"

print "[5/8] Updating permissions"
docker compose run --rm app ./manage.py tenant_command update_permissions --schema "$TENANT"

print "[5b] Loading users"
USER_FIXTURES_PATH="$FIXTURES_DIR/clean-start-users.json"
if [[ -f "$USER_FIXTURES_PATH" ]]; then
  USER_FIXTURE_BASENAME="$(copy_to_cypress "$USER_FIXTURES_PATH")"
  docker compose run --rm app ./manage.py tenant_command loaddata "tests/cypress_studies/$USER_FIXTURE_BASENAME" --schema "$TENANT"
else
  echo "Default users fixture not found: $USER_FIXTURES_PATH" >&2
fi

if [[ -n "$USERS_JSON" ]]; then
  if [[ -f "$USERS_JSON" ]]; then
    USERS_JSON_BASENAME="$(copy_to_cypress "$USERS_JSON")"
    docker compose run --rm app ./manage.py tenant_command loaddata "tests/cypress_studies/$USERS_JSON_BASENAME" --schema "$TENANT"
  else
    echo "Users JSON not found: $USERS_JSON" >&2
  fi
fi

print "[6/8] Loading fixture packages"
FIXTURE_ORDER=(
  clean-start-090_study.json
  clean-start-100_ecrf_design.json
  clean-start-110_ecrf_data.json
  clean-start-120_randomisation.json
  clean-start-130_allocation.json
  clean-start-150_epro.json
  clean-start-160_econsent.json
  clean-start-170_calendar.json
  clean-start-230_recruitment.json
  clean-start-180_payments.json
  clean-start-190_automations.json
  clean-start-210_exports.json
)

for fixture in "${FIXTURE_ORDER[@]}"; do
  FIXTURE_PATH="$FIXTURES_DIR/$fixture"
  if [[ -f "$FIXTURE_PATH" ]]; then
    print "  → $fixture"
    FIXTURE_BASENAME="$(copy_to_cypress "$FIXTURE_PATH")"
    if [[ "$fixture" == "clean-start-170_calendar.json" ]]; then
      docker compose run --rm app sh -c "python - <<'PY'
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.local')
import django
django.setup()
from django.db.models.signals import pre_save
from datacapt_backend.calendar_app.receivers import cache_old_event_instance
from datacapt_backend.calendar_app.models import Event

pre_save.disconnect(cache_old_event_instance, sender=Event)
PY
./manage.py tenant_command loaddata 'tests/cypress_studies/$FIXTURE_BASENAME' --schema '$TENANT'
python - <<'PY'
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.local')
import django
django.setup()
from django.db.models.signals import pre_save
from datacapt_backend.calendar_app.receivers import cache_old_event_instance
from datacapt_backend.calendar_app.models import Event

pre_save.connect(cache_old_event_instance, sender=Event)
PY"
    else
      docker compose run --rm app ./manage.py tenant_command loaddata "tests/cypress_studies/$FIXTURE_BASENAME" --schema "$TENANT"
    fi
  else
    print "  → Skipping $fixture (not found)"
  fi
done

if [[ ${#EXTRA_FIXTURES[@]} -gt 0 ]]; then
  print "  → Loading extra fixtures"
  for extra in "${EXTRA_FIXTURES[@]}"; do
    if [[ -f "$extra" ]]; then
      EXTRA_BASENAME="$(copy_to_cypress "$extra")"
      docker compose run --rm app ./manage.py tenant_command loaddata "tests/cypress_studies/$EXTRA_BASENAME" --schema "$TENANT"
    else
      echo "Extra fixture not found: $extra" >&2
    fi
  done
fi

print "[6b] Creating test user"
docker compose run --rm app ./manage.py tenant_command create_test_user --schema "$TENANT" >/dev/null

print "[6c] Ensuring study-user assignments"
docker compose run --rm -e TENANT_SCHEMA="$TENANT" app python - <<'PY'
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.local')
import django
django.setup()

from django_tenants.utils import schema_context
from datacapt_backend.studies.models import StudyUser

ASSIGNMENTS = [
    (2001, 2010, [2101, 2102]),
    (2001, 2011, [2101]),
    (2001, 2001, [2101, 2102]),
    (2001, 2002, [2101]),
    (2001, 2003, [2101]),
    (2001, 2004, [2102]),
    (2001, 2005, [2101, 2102]),
    (2001, 2006, [2101]),
]

with schema_context(os.environ['TENANT_SCHEMA']):
    for study_id, user_id, centers in ASSIGNMENTS:
        study_user, _ = StudyUser.objects.get_or_create(
            study_id=study_id,
            user_id=user_id,
        )
        study_user.role_id = None
        study_user.save(update_fields=['role'])
        study_user.centers.set(centers)
PY

print "[7/8] Starting backend app container"
docker compose up -d app >/dev/null

print "[8/8] Clean start completed for tenant $TENANT"
print "Done."
