# Domain Notes

This tool performs arithmetic between two positive integers. It uses the title
Tawafuq Bain Al A'dadain (توافق بين العددين) as a label for that arithmetic
operation only.

## Algorithm

1. Validate the two input strings, then parse each valid string to a number once.
2. Use Euclid's algorithm to calculate gcd(A, B).
3. Trial-divide from 1 through the square root of the gcd. When d divides the
   gcd, collect d and gcd / d.
4. Do not collect the paired value twice when d times d equals the gcd.
5. Sort ascending, drop 1, and map each remaining divisor to divisor,
   firstQuotient, and secondQuotient.

Every divisor of gcd(A, B) divides both inputs, so gcd only reduces the search.
It is never the result by itself. One is excluded because this instrument lists
common divisors greater than one.

## Worked Values

For 22 and 88, gcd is 22 and the displayed divisors are 2, 11, and 22.
The operations for 11 are 22 ÷ 11 = 2 and 88 ÷ 11 = 8.

For 214 and 316, gcd is 2 and the displayed list is 2.

For 12 and 16, gcd is 4 and the displayed list is 2 and 4.

## Input Range

Inputs must be digit strings representing an integer from 1 through 1,000,000.
The implementation uses number, not BigInt. This cap keeps values and quotients
far below Number.MAX_SAFE_INTEGER, limits the trial scan to 1,000 iterations,
and keeps the candidate divisor count bounded. The largest divisor count below
one million is 240 before the required exclusion of 1, leaving at most 239
displayed divisors.

As a useful distinction, 1,000,000 itself is 2^6 times 5^6. It has 49 total
divisors, so this tool displays 48 of them after excluding 1.

If the cap is raised past roughly 1e12, revisit both the numeric type and the
possible result-list size.

## Limits

This tool performs arithmetic between two positive integers. It does not identify
heirs, compute shares, distribute estates, or issue rulings. Its terminology is
used only to describe arithmetic.
