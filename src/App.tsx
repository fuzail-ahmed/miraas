import { type FormEvent, useRef, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

import { calculate, validateInputs, type DivisionOperation } from './tawafuq';

const TITLE = "Tawafuq Bain Al A'dadain";
const ARABIC_TITLE = 'توافق بين العددين';

interface CalculationState {
  first: number;
  second: number;
  operations: DivisionOperation[];
}

function copyTextFor(calculation: CalculationState): string {
  const lines = [
    TITLE,
    ARABIC_TITLE,
    'First number: ' + calculation.first,
    'Second number: ' + calculation.second,
    '',
  ];

  if (calculation.operations.length === 0) {
    lines.push('No common divisor greater than 1.');
  } else {
    for (const operation of calculation.operations) {
      lines.push('Common divisor ' + operation.divisor);
      lines.push(
        calculation.first + ' ÷ ' + operation.divisor + ' = ' + operation.firstQuotient,
      );
      lines.push(
        calculation.second +
          ' ÷ ' +
          operation.divisor +
          ' = ' +
          operation.secondQuotient,
      );
      lines.push('');
    }
  }

  return lines.join('\n');
}

export default function App() {
  const firstInputRef = useRef<HTMLInputElement>(null);
  const [firstInput, setFirstInput] = useState('');
  const [secondInput, setSecondInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [calculation, setCalculation] = useState<CalculationState | null>(null);
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const validation = validateInputs(firstInput, secondInput);

    if (!validation.isValid) {
      setErrorMessage(validation.message);
      setCalculation(null);
      return;
    }

    setErrorMessage(null);
    setCalculation({
      first: validation.first,
      second: validation.second,
      operations: calculate(validation.first, validation.second),
    });
  };

  const handleClear = (): void => {
    setFirstInput('');
    setSecondInput('');
    setErrorMessage(null);
    setCalculation(null);
    firstInputRef.current?.focus();
  };

  const handleCopy = async (): Promise<void> => {
    if (calculation === null || !navigator.clipboard) {
      return;
    }

    try {
      await navigator.clipboard.writeText(copyTextFor(calculation));
    } catch {
      // Copy is intentionally best-effort when the Clipboard API is unavailable.
    }
  };

  return (
    <main className="app-shell">
      <section className="instrument" aria-labelledby="app-title">
        <header className="app-header">
          <p className="eyebrow">Arithmetic instrument</p>
          <h1 id="app-title">{TITLE}</h1>
          <p className="arabic-title" lang="ar" dir="rtl">
            {ARABIC_TITLE}
          </p>
          <p className="subtitle">Common divisors and wafq operations</p>
        </header>

        <form className="calculation-form" onSubmit={handleSubmit} noValidate>
          <div className="field-grid">
            <div className="field">
              <label htmlFor="first-number">First number</label>
              <input
                ref={firstInputRef}
                id="first-number"
                name="first-number"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                spellCheck={false}
                value={firstInput}
                onChange={(event) => setFirstInput(event.target.value)}
                aria-invalid={errorMessage ? true : undefined}
                aria-describedby={errorMessage ? 'input-error' : undefined}
              />
            </div>

            <div className="field">
              <label htmlFor="second-number">Second number</label>
              <input
                id="second-number"
                name="second-number"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                spellCheck={false}
                value={secondInput}
                onChange={(event) => setSecondInput(event.target.value)}
                aria-invalid={errorMessage ? true : undefined}
                aria-describedby={errorMessage ? 'input-error' : undefined}
              />
            </div>
          </div>

          <div className="controls">
            <button className="button button-primary" type="submit">
              Calculate
            </button>
            <button
              className="button button-secondary"
              type="button"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>

          {errorMessage ? (
            <p id="input-error" className="input-error" role="alert">
              {errorMessage}
            </p>
          ) : null}
        </form>

        <section
          className="results-region"
          aria-live="polite"
          aria-atomic="true"
          aria-labelledby="results-title"
        >
          <div className="results-heading">
            <div>
              <p className="eyebrow">Calculation</p>
              <h2 id="results-title">Common divisors</h2>
            </div>
            {calculation ? (
              <button
                className="button button-secondary copy-button"
                type="button"
                onClick={() => void handleCopy()}
              >
                Copy
              </button>
            ) : null}
          </div>

          {calculation === null ? (
            <p className="empty-state">Enter two positive integers to begin.</p>
          ) : calculation.operations.length === 0 ? (
            <p className="empty-state">No common divisor greater than 1.</p>
          ) : (
            <div className="divisor-list">
              {calculation.operations.map((operation) => {
                const headingId = 'divisor-' + operation.divisor;

                return (
                  <article
                    className="divisor-result"
                    key={operation.divisor}
                    aria-labelledby={headingId}
                  >
                    <h3 id={headingId}>
                      Common divisor <strong>{operation.divisor}</strong>
                    </h3>
                    <p className="equation" dir="ltr">
                      {calculation.first +
                        ' ÷ ' +
                        operation.divisor +
                        ' = ' +
                        operation.firstQuotient}
                    </p>
                    <p className="equation" dir="ltr">
                      {calculation.second +
                        ' ÷ ' +
                        operation.divisor +
                        ' = ' +
                        operation.secondQuotient}
                    </p>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </section>

      {needRefresh ? (
        <aside className="update-banner" role="status">
          <span>New version available</span>
          <button
            className="button button-update"
            type="button"
            onClick={() => void updateServiceWorker(true)}
          >
            Update
          </button>
        </aside>
      ) : null}
    </main>
  );
}
