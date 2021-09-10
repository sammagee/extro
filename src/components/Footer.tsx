import clsx from 'clsx'
import React from 'react'
import { isSupported } from '../utils/support'
import Preferences from './Preferences'

const Footer = () => {
  return (
    <footer
      className={clsx(
        'flex items-center mt-12 space-x-6',
        isSupported() ? 'justify-between' : 'justify-center'
      )}
    >
      <p className="flex items-center text-gray-500">
        Made with&nbsp;
        <svg
          className="flex-shrink-0 w-4 h-4 text-brand-500 animate-beat"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          />
        </svg>
        &nbsp;by&nbsp;
        <a
          className="font-medium hover:underline focus:ring-2 focus:outline-none focus:ring-brand-500"
          href="https://krafted.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          Krafted
        </a>
      </p>

      {isSupported() && <Preferences />}
    </footer>
  )
}

Footer.displayName = 'Footer'

export default Footer
