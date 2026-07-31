'use client';

/**
 * PriceInput
 *
 * A reusable currency input:
 * - Currency symbol prefix (default "$")
 * - Starts blank when the incoming value is 0 — no annoying leading zero
 * - Syncs back to the parent as a number on every change
 * - Optional label (append " *" for red asterisk), hint, and error message
 */

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface PriceInputProps {
  id?: string;
  /** Append " *" to get a red asterisk: e.g. "Price (USD) *" */
  label?: string;
  hint?: string;
  value: number | string;
  onChange: (value: number) => void;
  error?: string;
  min?: number;
  currency?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export function PriceInput({
  id,
  label,
  hint,
  value,
  onChange,
  error,
  min = 0,
  currency = '$',
  className,
  disabled,
  required,
}: PriceInputProps) {
  // ── Internal string state ───────────────────────────────────────────────────
  // Show blank instead of "0" so the user doesn't have to delete it first.
  const [raw, setRaw] = useState<string>(() => {
    const n = Number(value);
    return n === 0 ? '' : String(n);
  });

  // Sync when the parent resets the value (e.g. form pre-fill on edit)
  useEffect(() => {
    const n = Number(value);
    // Only override if the parent value meaningfully differs from what we have
    // (avoids clobbering mid-typing)
    if (n !== 0 && n !== Number(raw)) {
      setRaw(String(n));
    }
    if (n === 0 && raw !== '' && raw !== '0') {
      setRaw('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setRaw(text);
    // Parse and forward — empty string becomes 0
    onChange(text === '' ? 0 : Number(text));
  };

  // ── Label helpers ───────────────────────────────────────────────────────────
  const isRequired = label?.endsWith(' *');
  const labelText  = isRequired ? label!.slice(0, -2) : label;

  return (
    <div className={cn('space-y-0', className)}>
      {label && (
        <div className="mb-1.5">
          <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {labelText}
            {isRequired && <span className="text-red-500 ml-0.5">*</span>}
          </label>
          {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
        </div>
      )}

      <div className="relative flex items-center">
        {/* Currency prefix */}
        <span className="absolute left-0 inset-y-0 flex items-center pl-3 pointer-events-none text-sm text-gray-500 select-none">
          {currency}
        </span>

        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          step="0.01"
          value={raw}
          placeholder="0.00"
          disabled={disabled}
          required={required}
          onChange={handleChange}
          className={cn(
            'flex w-full rounded-md border bg-white py-2 pr-3 text-sm text-gray-900 placeholder-gray-400',
            'transition-colors focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
            currency.length <= 1 ? 'pl-7' : 'pl-9',
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-400'
              : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500'
          )}
        />
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
