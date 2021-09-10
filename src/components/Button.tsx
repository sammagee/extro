import clsx from 'clsx'
import React, { forwardRef, MouseEvent, ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  className?: string
  disabled?: boolean
  loading?: boolean
  offsetClass?: string
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  variant?: 'primary' | 'secondary'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      disabled,
      loading,
      offsetClass = 'focus:ring-offset-gray-900',
      onClick,
      variant = 'primary',
    },
    ref
  ) => {
    const classes = {
      primary: clsx(
        'shadow text-brand-100 bg-brand-500 border-t border-brand-400 focus:ring-2 focus:outline-none focus:ring-brand-500',
        disabled || loading ? 'hover:bg-brand-500' : 'hover:bg-brand-400'
      ),
      secondary: clsx(
        'text-gray-200 focus:ring-2 focus:outline-none focus:ring-gray-700',
        !(disabled || loading) && 'hover:bg-gray-700'
      ),
    }[variant]

    return (
      <button
        ref={ref}
        className={clsx(
          'flex items-center justify-center px-6 py-4 text-base font-semibold uppercase transition-colors duration-200 ease-in-out transform rounded-xl focus:ring-offset-2',
          offsetClass,
          (disabled || loading) && 'opacity-50 cursor-not-allowed select-none',
          classes,
          className
        )}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
