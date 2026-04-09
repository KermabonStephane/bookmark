# ADR-004: Email/Password auth via Firebase Auth REST API (no SDK)

**Date**: 2026-04-09
**Status**: Accepted

## Context

Two options were considered:
- (A) Firebase Auth (Google-hosted), using the Firebase JS SDK.
- (B) Custom JWT with a serverless function (e.g. Cloudflare Workers).

Option B requires operating infrastructure. The goal for Phase 1 is zero server infrastructure.

Option A with the full Firebase JS SDK adds ~70KB gzipped to the extension bundle, which is unacceptable for popup performance.

## Decision

Use Firebase Auth REST API directly (`identitytoolkit.googleapis.com`) without importing the Firebase JS SDK. Only two endpoints are called: sign-in and token refresh.

## Consequences

**Positive:**
- Zero server infrastructure.
- Firebase handles password hashing, reset emails, brute-force rate limiting.
- Bundle impact: ~2KB (two fetch calls) vs ~70KB (Firebase SDK).

**Negative:**
- Dependency on Google Firebase. Free tier: 10k sign-ins/month (sufficient for personal use).
- Cannot self-host.
- Must manually implement token refresh logic (not complex, but not automatic like the SDK).
