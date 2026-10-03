export const MAX_INPUT = 1_000_000;
// Raising this cap past roughly 1e12 requires revisiting Number safety and result-list size.

export type InputErrorMessage =
  | 'Enter both numbers.'
  | 'Enter a positive whole number.'
  | 'Only whole numbers are supported.'
  | 'Numbers must be between 1 and 1,000,000.';

export type InputValidationResult =
  | {
      isValid: true;
      first: number;
      second: number;
    }
  | {
      isValid: false;
      message: InputErrorMessage;
    };

export interface DivisionOperation {
  divisor: number;
  firstQuotient: number;
  secondQuotient: number;
}

export function validateInputs(
  firstInput: string,
  secondInput: string,
): InputValidationResult {
  if (firstInput.trim().length === 0 || secondInput.trim().length === 0) {
    return { isValid: false, message: 'Enter both numbers.' };
  }

  if (!/^[0-9]+$/.test(firstInput) || !/^[0-9]+$/.test(secondInput)) {
    return { isValid: false, message: 'Only whole numbers are supported.' };
  }

  const first = Number(firstInput);
  const second = Number(secondInput);

  if (first === 0 || second === 0) {
    return { isValid: false, message: 'Enter a positive whole number.' };
  }

  if (first > MAX_INPUT || second > MAX_INPUT) {
    return {
      isValid: false,
      message: 'Numbers must be between 1 and 1,000,000.',
    };
  }

  return { isValid: true, first, second };
}

export function gcd(first: number, second: number): number {
  let larger = Math.abs(first);
  let smaller = Math.abs(second);

  while (smaller !== 0) {
    const remainder = larger % smaller;
    larger = smaller;
    smaller = remainder;
  }

  return larger;
}

export function divisorsOf(commonGreatestDivisor: number): number[] {
  const divisors: number[] = [];

  for (let divisor = 1; divisor * divisor <= commonGreatestDivisor; divisor += 1) {
    if (commonGreatestDivisor % divisor !== 0) {
      continue;
    }

    divisors.push(divisor);
    const pairedDivisor = commonGreatestDivisor / divisor;

    if (pairedDivisor !== divisor) {
      divisors.push(pairedDivisor);
    }
  }

  return divisors.filter((divisor) => divisor > 1).sort((a, b) => a - b);
}

export function commonDivisors(first: number, second: number): number[] {
  return divisorsOf(gcd(first, second));
}

export function calculate(first: number, second: number): DivisionOperation[] {
  return commonDivisors(first, second).map((divisor) => ({
    divisor,
    firstQuotient: first / divisor,
    secondQuotient: second / divisor,
  }));
}
