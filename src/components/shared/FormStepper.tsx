'use client';

/**
 * FormStepper
 *
 * A reusable multi-step progress bar component for multi-section forms.
 * Steps that are completed (index < current) show a checkmark.
 * The active step is highlighted in green.
 * Past steps are clickable to go back.
 */

import { cn } from '@/lib/utils';

interface Step {
  label: string;
  /** Optional short description shown below the label */
  description?: string;
}

interface FormStepperProps {
  steps: Step[];
  current: number;
  /** If provided, clicking a past step navigates to it */
  onStepClick?: (index: number) => void;
}

export function FormStepper({ steps, current, onStepClick }: FormStepperProps) {
  return (
    <div className="w-full" aria-label="Form progress">
      {/* Track */}
      <div className="flex items-start gap-0">
        {steps.map((step, i) => {
          const isCompleted = i < current;
          const isActive = i === current;
          const isClickable = isCompleted && !!onStepClick;

          return (
            <div key={i} className="flex-1 flex flex-col items-center relative">
              {/* Connector line — left half */}
              {i > 0 && (
                <div
                  className={cn(
                    'absolute top-4 right-1/2 left-0 h-0.5 -translate-y-1/2',
                    i <= current ? 'bg-teal-500' : 'bg-gray-200'
                  )}
                />
              )}
              {/* Connector line — right half */}
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    'absolute top-4 left-1/2 right-0 h-0.5 -translate-y-1/2',
                    i < current ? 'bg-teal-500' : 'bg-gray-200'
                  )}
                />
              )}

              {/* Step circle */}
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(i)}
                className={cn(
                  'relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all duration-200',
                  isCompleted
                    ? 'border-teal-500 bg-teal-500 text-white cursor-pointer hover:bg-teal-600 hover:border-teal-600'
                    : isActive
                    ? 'border-teal-500 bg-white text-teal-600 shadow-md shadow-teal-100'
                    : 'border-gray-200 bg-white text-gray-400 cursor-default'
                )}
                aria-current={isActive ? 'step' : undefined}
              >
                {isCompleted ? (
                  /* Checkmark */
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span>{i + 1}</span>
                )}
              </button>

              {/* Label */}
              <div className="mt-2 text-center px-1">
                <p
                  className={cn(
                    'text-xs font-medium leading-tight',
                    isActive
                      ? 'text-teal-700'
                      : isCompleted
                      ? 'text-gray-600'
                      : 'text-gray-400'
                  )}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-[10px] text-gray-400 mt-0.5 hidden sm:block">{step.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Thin full-width progress bar underneath */}
      <div className="mt-4 h-1 w-full rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-teal-500 transition-all duration-500"
          style={{ width: `${((current) / (steps.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}
