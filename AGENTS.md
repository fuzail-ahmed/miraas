# Agent Contract

## Project Purpose

This is a static arithmetic utility for Tawafuq Bain Al A'dadain
(توافق بين العددين). The original 2021 source is lost; this project is a
reconstruction from two screenshots and a written specification. Do not claim
to have the original code or invent historical implementation details.

## Hard Rules

1. Never collapse the result to gcd/HCF alone.
2. Never display d = 1.
3. Every displayed divisor gets both quotients, unambiguously paired to it.

## Boundaries

The domain in src/tawafuq.ts stays pure and UI-independent. It imports nothing:
no React, DOM, storage, network, or browser APIs. Inputs are capped at 1,000,000
so number arithmetic remains comfortably safe, the divisor scan is bounded to
1,000 iterations, and the result list stays bounded. Revisit the numeric type
and result-list size if that cap rises past roughly 1e12.

Do not add dependencies without asking first.

## Commands

```
npm run lint
npm run typecheck
npm test
npm run build
npm run preview
```
