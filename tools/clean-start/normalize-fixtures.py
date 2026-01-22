#!/usr/bin/env python3
"""Normalize Clean Start backend fixtures for Django loaddata."""

from __future__ import annotations

import json
from collections import OrderedDict
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
FIXTURE_GLOB = "clean-start-*.json"
DEFAULT_TIMESTAMP = "2025-02-01T08:00:00Z"

TIMESTAMP_MODELS = {
    "audit_trails.subjectactivity": {"created_at": True, "modified_at": False},
    "automations.log": {"created_at": True, "modified_at": False},
    "calendar_app.event": {"created_at": True, "modified_at": True},
    "calendar_app.eventslot": {"created_at": True, "modified_at": True},
    "calendar_app.schedule": {"created_at": True, "modified_at": True},
    "calendar_app.scheduleavailability": {"created_at": True, "modified_at": True},
    "calendar_app.visit": {"created_at": True, "modified_at": True},
    "calendar_app.visitschedule": {"created_at": True, "modified_at": True},
    "ecrf.answer": {"created_at": True, "modified_at": False},
    "ecrf.repeatedmeasurerow": {"created_at": True, "modified_at": True},
    "payments.payment": {"created_at": True, "modified_at": True},
    "payments.paymentorder": {"created_at": True, "modified_at": True},
    "payments.transaction": {"created_at": True, "modified_at": True},
    "randomizations.randomizationlist": {"created_at": True, "modified_at": False},
    "randomizations.randomizationslot": {"created_at": True, "modified_at": False},
    "randomizations.staticrandomization": {"created_at": True, "modified_at": False},
    "recruitment.recruitmentpool": {"created_at": True, "modified_at": True},
    "recruitment.recruitmentstudy": {"created_at": True, "modified_at": True},
}


def _ensure_iterable(data):
    if isinstance(data, list):
        return data
    if isinstance(data, dict):
        ordered = data
        if not isinstance(data, OrderedDict):
            ordered = OrderedDict(data)
        result = []
        for value in ordered.values():
            if isinstance(value, list):
                result.extend(value)
        return result
    raise ValueError("Unsupported root structure")


def _patch_fields(model: str | None, fields: dict | None) -> None:
    if not isinstance(fields, dict):
        return

    if model == "users.user":
        fields.pop("locale", None)
        fields.pop("timezone", None)
        fields.setdefault("_language", "en")

    meta = TIMESTAMP_MODELS.get(model)
    if not meta:
        return

    if meta.get("created_at"):
        fields.setdefault("created_at", DEFAULT_TIMESTAMP)
    if meta.get("modified_at"):
        fields.setdefault("modified_at", DEFAULT_TIMESTAMP)


def normalize_fixture(path: Path) -> bool:
    with path.open(encoding="utf-8") as handle:
        data = json.load(handle)

    try:
        entries = _ensure_iterable(data)
    except ValueError:
        return False

    if not any(isinstance(entry, dict) and "model" in entry for entry in entries):
        return False

    changed = False
    for entry in entries:
        if not isinstance(entry, dict):
            continue
        before = json.dumps(entry, sort_keys=True)
        _patch_fields(entry.get("model"), entry.get("fields"))
        after = json.dumps(entry, sort_keys=True)
        if before != after:
            changed = True

    if isinstance(data, list):
        root = entries
        changed = changed or any(entry is not orig for entry, orig in zip(entries, data))
    else:
        root = entries
        changed = True

    if changed:
        with path.open("w", encoding="utf-8") as handle:
            json.dump(root, handle, ensure_ascii=False, indent=2)
            handle.write("\n")

    return changed


def main():
    updated = []
    skipped = []
    for fixture_path in sorted(BASE_DIR.glob(FIXTURE_GLOB)):
        if fixture_path.name in {"clean-start-translations.json"}:
            continue
        if normalize_fixture(fixture_path):
            updated.append(fixture_path.name)
        else:
            skipped.append(fixture_path.name)

    if updated:
        print("Updated:")
        for name in updated:
            print(f"  {name}")
    if skipped:
        print("Skipped (non-Django or already normalized):")
        for name in skipped:
            print(f"  {name}")


if __name__ == "__main__":
    main()
