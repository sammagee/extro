import React, { Fragment, ReactNode } from 'react'
import { Dialog, Transition } from '@headlessui/react'

interface ModalProps {
  actions?: ReactNode
  children: ReactNode
  icon?: ReactNode
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  title: string
}

const Modal = ({
  actions,
  children,
  icon,
  isOpen,
  setIsOpen,
  title
}: ModalProps) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        className="fixed inset-0 w-full z-30 flex items-end sm:items-center justify-center min-h-screen p-4 text-center"
        onClose={() => setIsOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="duration-300 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-200 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 transition-all bg-black backdrop-filter backdrop-blur-sm bg-opacity-90 focus:outline-none" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
          enterTo="translate-y-0 opacity-100 sm:scale-100"
          leave="duration-200 ease-in"
          leaveFrom="translate-y-0 opacity-100 sm:scale-100"
          leaveTo="translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
        >
          <div className="w-full text-left align-bottom transition-all transform bg-gray-900 rounded-lg shadow-xl sm:my-8 sm:align-center sm:max-w-lg">
            <div className="p-4 sm:p-6">
              <div className="flex items-start sm:space-x-6">
                {icon && (
                  <div className="hidden sm:block">
                    <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-gray-800 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                      <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {icon}
                      </svg>
                    </div>
                  </div>
                )}

                <div className="flex-1">
                  <header className="flex items-center">
                    <Dialog.Title className="flex items-center text-lg font-semibold leading-6 text-gray-200 sm:h-10">
                      {title}
                    </Dialog.Title>
                  </header>

                  <div className="mt-3 text-gray-400">
                    {children}
                  </div>
                </div>
              </div>
            </div>

            {actions && (
              <div className="flex flex-row-reverse items-center justify-start p-4 bg-gray-800 rounded-b-lg sm:px-6 sm:py-3">
                {actions}
              </div>
            )}
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}

export default Modal
