# Versioning Policy

ModelCap uses semantic versioning for the public SDK and a conservative compatibility policy for catalog data.

## SDK API

Patch releases may:

- Fix SDK bugs.
- Improve TypeScript types without removing existing valid usage.
- Add model entries, fields, error mappings, or validation warnings.
- Add new `ValidationIssueCode` values.

Minor releases may:

- Add new SDK exports.
- Add new filter options.
- Add new structured schema fields.
- Expand model coverage substantially.

Major releases are required for:

- Removing or renaming public SDK exports.
- Removing public TypeScript types.
- Changing return shapes for `getModel`, `listModels`, `validateRequest`, or `normalizeError`.
- Making previously valid TypeScript consumer code invalid without a documented migration.

## Catalog Data

Catalog data changes can affect runtime validation results. ModelCap treats those changes as normal catalog maintenance when they follow official sources.

Patch or minor releases may:

- Add a newly documented hard constraint.
- Change a field from `null` to a documented value.
- Add or update pricing snapshots.
- Add or update provider error-code mappings.
- Mark a source as stale or unavailable.

These changes can make `validateRequest` return new errors for requests that were previously warnings or valid. That is not an SDK breaking change when the new result reflects an official documented constraint.

## Conservative Validation

ModelCap rejects requests only when a violation is represented in structured data. Prose notes are explanatory and are not executable validation rules.

If an official source is missing, ambiguous, or conflicting, ModelCap should prefer:

1. `null` for unknown structured fields.
2. A warning from `validateRequest` where possible.
3. A `note` explaining the uncertainty.

## ModelId Type

`ModelId` is generated from committed catalog data. Adding a model expands the union. Removing or renaming a model can break TypeScript users who rely on that ID and should normally wait for a major release unless the entry was clearly erroneous.
