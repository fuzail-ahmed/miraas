# Tawafuq Bain Al A'dadain

توافق بين العددين

A small static arithmetic utility that lists every common divisor greater than
one, with the two division operations paired to each divisor.

For 22 and 88, the result is 2, 11, and 22:

```
Common divisor 2
22 ÷ 2 = 11
88 ÷ 2 = 44

Common divisor 11
22 ÷ 11 = 2
88 ÷ 11 = 8

Common divisor 22
22 ÷ 22 = 1
88 ÷ 22 = 4
```

## Commands

```
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
npm run preview
```

## Deployment

Run npm run build and deploy the generated dist directory. The static output
works as-is on Cloudflare Pages, Vercel, and Netlify. It has no environment
variables and needs no rewrites because there is no router.

## Architecture

The pure domain module validates input strings, calculates the gcd with Euclid's
algorithm, and maps all eligible divisors to paired quotient operations. The
single React screen owns the input strings, presentation, copy action, and
service-worker update prompt. CSS supplies the responsive, dark, reduced-motion,
and print behavior without stored preferences.

## License

MIT. See LICENSE.
