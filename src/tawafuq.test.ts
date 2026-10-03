import { describe, expect, it } from 'vitest';

import {
  calculate,
  commonDivisors,
  gcd,
  validateInputs,
  type DivisionOperation,
} from './tawafuq';

function divisorList(operations: DivisionOperation[]): number[] {
  return operations.map((operation) => operation.divisor);
}

function generatedPairs(count: number): Array<[number, number]> {
  let state = 0x6d2b79f5;

  const next = (): number => {
    state = (state * 1_664_525 + 1_013_904_223) >>> 0;
    return (state % 1_000_000) + 1;
  };

  return Array.from({ length: count }, () => [next(), next()]);
}

describe('calculate', () => {
  it.each([
    [22, 88, [2, 11, 22]],
    [214, 316, [2]],
    [12, 16, [2, 4]],
    [100, 250, [2, 5, 10, 25, 50]],
    [6, 6, [2, 3, 6]],
    [4, 8, [2, 4]],
    [36, 36, [2, 3, 4, 6, 9, 12, 18, 36]],
    [5, 7, []],
    [13, 17, []],
    [1, 999, []],
    [999_983, 999_983, [999_983]],
  ])('returns every common divisor for %i and %i', (first, second, expected) => {
    expect(divisorList(calculate(first, second))).toEqual(expected);
  });

  it('deduplicates the square-root divisor for a perfect-square gcd', () => {
    expect(divisorList(calculate(36, 36))).toEqual([2, 3, 4, 6, 9, 12, 18, 36]);
  });

  it('returns the exact ascending divisors for one million', () => {
    const operations = calculate(1_000_000, 1_000_000);
    const divisors = divisorList(operations);

    // 1,000,000 = 2^6 * 5^6, so it has 49 total divisors and 48 after omitting 1.
    expect(divisors).toHaveLength(48);
    expect(divisors).toEqual([...divisors].sort((a, b) => a - b));
    expect(new Set(divisors).size).toBe(divisors.length);
  });

  it('preserves entered order in quotient positions', () => {
    expect(calculate(22, 88)).toEqual([
      { divisor: 2, firstQuotient: 11, secondQuotient: 44 },
      { divisor: 11, firstQuotient: 2, secondQuotient: 8 },
      { divisor: 22, firstQuotient: 1, secondQuotient: 4 },
    ]);
    expect(calculate(88, 22)).toEqual([
      { divisor: 2, firstQuotient: 44, secondQuotient: 11 },
      { divisor: 11, firstQuotient: 8, secondQuotient: 2 },
      { divisor: 22, firstQuotient: 4, secondQuotient: 1 },
    ]);
  });

  it('holds the divisor and quotient invariants for generated pairs', () => {
    for (const [first, second] of generatedPairs(48)) {
      const operations = calculate(first, second);
      const divisors = divisorList(operations);
      const commonGreatestDivisor = gcd(first, second);

      for (let index = 0; index < operations.length; index += 1) {
        const operation = operations[index];
        expect(operation.divisor).toBeGreaterThan(1);
        expect(first % operation.divisor).toBe(0);
        expect(second % operation.divisor).toBe(0);
        expect(operation.firstQuotient * operation.divisor).toBe(first);
        expect(operation.secondQuotient * operation.divisor).toBe(second);

        if (index > 0) {
          expect(operation.divisor).toBeGreaterThan(operations[index - 1].divisor);
        }
      }

      expect(new Set(divisors).size).toBe(divisors.length);

      if (commonGreatestDivisor > 1) {
        expect(divisors.at(-1)).toBe(commonGreatestDivisor);
      } else {
        expect(divisors).toEqual([]);
      }

      const swapped = calculate(second, first);
      expect(divisorList(swapped)).toEqual(divisors);
      expect(swapped.map((operation) => operation.firstQuotient)).toEqual(
        operations.map((operation) => operation.secondQuotient),
      );
      expect(swapped.map((operation) => operation.secondQuotient)).toEqual(
        operations.map((operation) => operation.firstQuotient),
      );
    }
  });

  it('uses gcd only to narrow the divisor search', () => {
    expect(gcd(22, 88)).toBe(22);
    expect(commonDivisors(22, 88)).toEqual([2, 11, 22]);
  });
});

describe('validateInputs', () => {
  it.each([
    ['', '7', 'Enter both numbers.'],
    ['7', '', 'Enter both numbers.'],
    [' ', '7', 'Enter both numbers.'],
    ['0', '7', 'Enter a positive whole number.'],
    ['-5', '7', 'Only whole numbers are supported.'],
    ['1.5', '7', 'Only whole numbers are supported.'],
    ['3e4', '7', 'Only whole numbers are supported.'],
    ['abc', '7', 'Only whole numbers are supported.'],
    ['1000001', '7', 'Numbers must be between 1 and 1,000,000.'],
  ])('rejects %j with a useful message', (first, second, message) => {
    expect(validateInputs(first, second)).toEqual({ isValid: false, message });
  });

  it('parses a valid digit string only after validating it', () => {
    expect(validateInputs('00022', '88')).toEqual({
      isValid: true,
      first: 22,
      second: 88,
    });
  });
});
