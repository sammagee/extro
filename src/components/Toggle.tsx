import { Switch } from '@headlessui/react'
import clsx from 'clsx'
import React, { Dispatch, ReactElement, SetStateAction } from 'react'

interface ToggleProps {
  on: boolean
  disabled?: boolean
  onChange: Dispatch<SetStateAction<unknown>>
  offLabel?: string
  onLabel?: string
  offIcon?: ReactElement
  onIcon?: ReactElement
}

const Toggle = ({
  on,
  disabled,
  onChange,
  offLabel = 'Turn Off',
  onLabel = 'Turn On',
  offIcon,
  onIcon,
}: ToggleProps) => {
  return (
    <Switch
      checked={on}
      disabled={disabled}
      onChange={onChange}
      className={clsx(
        'relative inline-flex flex-shrink-0 h-7 w-12 border-2 border-transparent rounded-full transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2  focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        on ? 'bg-green-500' : 'bg-gray-900'
      )}
    >
      <span className="sr-only">{on ? offLabel : onLabel}</span>

      <span
        aria-hidden="true"
        className={clsx(
          'pointer-events-none inline-flex items-center justify-center h-6 w-6 shadow-sm rounded-full bg-white transform ring-0 transition ease-in-out duration-200',
          on ? 'translate-x-5' : 'translate-x-0'
        )}
      >
        {on && onIcon && (
          <svg
            className="w-3 h-3 text-green-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            {onIcon}
          </svg>
        )}

        {!on && offIcon && (
          <svg
            className="w-3 h-3 text-gray-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            {offIcon}
          </svg>
        )}
      </span>
    </Switch>
  )
}

Toggle.displayName = 'Toggle'

export default Toggle
