# Security Concerns

> Security-relevant items that are intentional today but should be reviewed as GameTool approaches production.

## Table of contents

- [Purpose](#purpose)
- [Public user search](#public-user-search)
- [Shared RGT sessions](#shared-rgt-sessions)
- [Environment and JWT secrets](#environment-and-jwt-secrets)

---
## Purpose

This file is not a vulnerability list and does not mean the current development environment is unsafe.

It records security-related design points that are acceptable for the current development stage but deserve an explicit production review.

---

## Public user search

The shared user-search endpoint is intentionally accessible without authentication.

It returns only the public/basic user representation, currently based on `IUserBase`, such as:

- public user UID;
- username;
- avatar;
- initials.

Users are intentionally discoverable, and requiring login would provide limited protection if account creation is generally available.

The main concern is therefore **enumeration/scraping abuse**, not exposure of private profile information.

Before production, review whether the endpoint needs:

- a minimum search length;
- bounded result counts;
- pagination;
- dedicated rate limiting;
- abuse monitoring.

Do not expand this endpoint to expose private account fields such as email, password-related data, refresh tokens, or application-specific private information.

---

## Shared RGT sessions

RGT user accounts are shared across applications through the common users database.

Current refresh tokens are stored directly on the global user document:

```text
refreshTokens[]
```

They are not currently tagged/scoped by application.

In a multi-application production environment, one application's logout/reuse-detection behavior could therefore interfere with sessions created by another application.

Application-scoped session/refresh-token storage is tracked as a **before-production** task in the root `todo.md`.

---

## Environment and JWT secrets

The real `.env` is intentionally part of the private/local RGT synchronization baseline but is excluded from Git.

Requirements:

- never commit a populated `.env`;
- keep the RGT sync/save location private;
- do not publish or package real secrets with documentation/source distributions;
- keep production JWT secrets stable unless rotation is intentionally required.

JWT secret rotation invalidates existing JWT sessions and effectively logs users out. That consequence is expected when rotation is performed.
