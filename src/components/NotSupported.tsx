import React from 'react'
import ChromeIcon from './icons/ChromeIcon'
import EdgeIcon from './icons/EdgeIcon'

const NotSupported = () => {
  return (
    <div className="p-6 mt-6 text-gray-200 border-2 border-gray-700 border-dashed rounded-xl">
      <h2 className="flex items-center space-x-4 text-xl font-bold">
        <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-gray-1000">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <span className="inline-block">
          This browser is currently unsupported
        </span>
      </h2>

      <p className="mt-3 text-lg ml-14">
        We use features that are currently only supported in the most modern
        browsers. You can find links to download supported browsers below:
      </p>

      <ul className="mt-3 ml-9">
        <li>
          <a
            href="//www.google.com/chrome/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-5 py-4 space-x-3 text-sm font-semibold transition-colors ease-in-out rounded-full sm:text-lg hover:bg-gray-800 focus:bg-gray-800 focus:outline-none duration-250"
          >
            <div className="flex items-center space-x-3">
              <ChromeIcon className="flex-shrink-0 opacity-75 w-7 h-7 filter grayscale" />

              <span>Google Chrome</span>
              <span className="inline-block px-2 py-1 text-xs font-normal bg-gray-700 rounded-full top-px">
                v86+
              </span>
            </div>

            <svg
              className="inline-block w-4 h-4 ml-auto text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </li>
        <li>
          <a
            href="//www.microsoft.com/edge"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-5 py-4 space-x-3 text-sm font-semibold transition-colors ease-in-out rounded-full sm:text-lg hover:bg-gray-800 focus:bg-gray-800 focus:outline-none duration-250"
          >
            <div className="flex items-center space-x-3">
              <EdgeIcon className="flex-shrink-0 opacity-75 w-7 h-7 filter grayscale" />

              <span>Microsoft Edge</span>
              <span className="inline-block px-2 py-1 text-xs font-normal bg-gray-700 rounded-full top-px">
                v86+
              </span>
            </div>

            <svg
              className="inline-block w-4 h-4 ml-auto text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </li>
      </ul>
    </div>
  )
}

NotSupported.displayName = 'NotSupported'

export default NotSupported
