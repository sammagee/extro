import { Popover, Transition } from '@headlessui/react'
import React, { Fragment, useContext } from 'react'
import PreferencesContext, {
  InstructionMode,
  VisibilityMode,
} from '../contexts/PreferencesContext'
import Toggle from './Toggle'
import Tooltip from './Tooltip'

const Preferences = () => {
  const {
    instructionMode,
    setInstructionMode,
    visibilityMode,
    setVisibilityMode,
  } = useContext(PreferencesContext)

  return (
    <>
      <Popover className="relative">
        <>
          <Tooltip content="Preferences" placement="left">
            <Popover.Button className="flex items-center justify-center w-10 h-10 space-x-2 font-medium text-gray-400 transition-colors rounded-full -right-1 hover:bg-gray-800 duration-250 focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 focus:ring-offset-gray-900">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </Popover.Button>
          </Tooltip>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200 origin-bottom-right"
            enterFrom="opacity-0 scale-95 translate-y-1"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="transition ease-in duration-150 origin-bottom-right"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-1"
          >
            <Popover.Panel className="absolute z-10 w-screen max-w-sm px-8 mb-5 -right-12 bottom-full">
              <span className="absolute w-4 h-4 transform rotate-45 z-10 bg-gray-800 rounded-sm -bottom-1.5 right-14" />

              <div className="overflow-hidden rounded-lg shadow-lg">
                <div className="p-6 bg-gray-800">
                  <h3 className="m-0 text-lg font-semibold leading-none text-gray-400">
                    Preferences
                  </h3>

                  <div className="mt-4 text-gray-400">
                    <Tooltip content="Coming Soon" placement="bottom">
                      <div className="flex items-start justify-between space-x-3 opacity-50">
                        <div>
                          <strong className="m-0 text-base font-semibold leading-none">
                            Instructions
                          </strong>

                          <p className="m-0 mt-1 text-xs text-gray-500">
                            By default, instructions are shown as text. If you
                            prefer visual instructions, you may switch this on
                            to Video mode.
                          </p>
                        </div>

                        <Toggle
                          on={instructionMode === InstructionMode.Video}
                          disabled
                          offLabel="Change to Text Instructions"
                          onLabel="Change to Video Instructions"
                          offIcon={
                            <path
                              fillRule="evenodd"
                              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                              clipRule="evenodd"
                            />
                          }
                          onIcon={
                            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                          }
                          onChange={() =>
                            setInstructionMode((mode: InstructionMode) =>
                              mode === InstructionMode.Video
                                ? InstructionMode.Text
                                : InstructionMode.Video
                            )
                          }
                        />
                      </div>
                    </Tooltip>

                    <div className="flex items-start justify-between mt-3 space-x-3">
                      <div>
                        <strong className="m-0 text-base font-semibold leading-none">
                          Visibility
                        </strong>

                        <p className="m-0 mt-1 text-xs text-gray-500">
                          By default everything is visible. By switching to
                          Hidden mode, sensitive details are blurred out. This
                          is intended for demo purposes.
                        </p>
                      </div>

                      <Toggle
                        on={visibilityMode === VisibilityMode.Visible}
                        offLabel="Hide Sensitive Data"
                        onLabel="Show Sensitive Data"
                        offIcon={
                          <>
                            <path
                              fillRule="evenodd"
                              d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                              clipRule="evenodd"
                            />
                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                          </>
                        }
                        onIcon={
                          <>
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path
                              fillRule="evenodd"
                              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                              clipRule="evenodd"
                            />
                          </>
                        }
                        onChange={() =>
                          setVisibilityMode((mode: VisibilityMode) =>
                            mode === VisibilityMode.Visible
                              ? VisibilityMode.Hidden
                              : VisibilityMode.Visible
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      </Popover>
    </>
  )
}

Preferences.displayName = 'Preferences'

export default Preferences
