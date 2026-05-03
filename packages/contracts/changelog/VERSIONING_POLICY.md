# TAMV Contract Versioning & Compatibility Policy

## Semantic Versioning
All API and event contracts in `packages/contracts/**` follow SemVer:

- `MAJOR` (`v2.0.0`): incompatible contract changes (breaking).
- `MINOR` (`v1.1.0`): backward-compatible additions.
- `PATCH` (`v1.1.1`): non-structural fixes (descriptions, examples, typo corrections).

## Compatibility Rules

### Backward-compatible (`MINOR`/`PATCH`)
- Add optional fields.
- Add new endpoints.
- Add enum values only when consumers are documented as forward-tolerant.
- Add new event types.

### Breaking (`MAJOR`)
- Remove or rename fields/endpoints/event types.
- Change field type, format, or requiredness.
- Narrow accepted enum values.
- Change authentication requirements.

## Active Contract Line
- `v1.0.0`: Baseline release (`tamv.v1.yaml`).
- `v1.1.0+`: Additive improvements only.
- Next major (`v2.0.0`) requires migration guide in `packages/contracts/changelog/`.

## Deprecation Window
- Minimum support for prior `MAJOR`: 180 days.
- End-of-support date must be published in changelog before removal.
