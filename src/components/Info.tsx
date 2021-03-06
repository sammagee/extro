import clsx from 'clsx'
import React, { ReactNode } from 'react'

interface InfoProps {
  children: ReactNode
  type?: 'note' | 'tip' | 'warning' | 'error'
}

const Info = ({ children, type = 'tip' }: InfoProps) => {
  const title = {
    note: 'Note',
    tip: 'Tip',
    warning: 'Warning',
    error: 'Error',
  }[type]
  const classes = {
    note: 'text-gray-400 bg-gray-700',
    tip: 'text-blue-900 bg-blue-200',
    warning: 'text-yellow-900 bg-yellow-200',
    error: 'text-red-900 bg-red-200',
  }[type]

  return (
    <div className="flex items-start px-5 py-4 mt-4 space-x-4 text-sm text-gray-400 bg-gray-800 border border-gray-700 rounded-xl">
      <span
        className={clsx(
          'relative inline-flex px-2 py-1 text-xs font-semibold leading-none uppercase rounded-full top-1',
          classes
        )}
      >
        {title}
      </span>

      <p className="!my-0">{children}</p>
    </div>
  )
}

export default Info
