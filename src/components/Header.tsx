import React from 'react'

const Header = () => {
  return (
    <>
      <header className="md:-ml-10">
        <h1>
          <a
            className="flex items-center space-x-2 text-4xl font-extrabold text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            href="/"
          >
            <svg
              className="w-10 h-10 -mt-2 -ml-2 text-brand-100"
              fill="currentColor"
              viewBox="0 0 512 512"
            >
              <path d="M256 399.627c-11.782 0-21.333 9.551-21.333 21.333 0 11.782 9.551 21.333 21.333 21.333v-42.666zm.178 42.666c11.782 0 21.333-9.551 21.333-21.333 0-11.782-9.551-21.333-21.333-21.333v42.666zm-71.289-271.626v-21.334 21.334zm-35.556 33.372H128h21.333zm0 233.607H128h21.333zm149.334-288.313h-21.334V192h21.334v-42.667zM213.333 192h21.334v-42.667h-21.334V192zM256 442.293h.178v-42.666H256v42.666zm-71.111 50.059h142.222v-42.667H184.889v42.667zm142.222 0c14.667 0 28.984-5.456 39.741-15.553l-29.199-31.11c-2.579 2.42-6.349 3.996-10.542 3.996v42.667zm39.741-15.553C377.656 466.659 384 452.607 384 437.646h-42.667c0 2.741-1.147 5.666-3.68 8.043l29.199 31.11zM384 437.646V204.039h-42.667v233.607H384zm0-233.607c0-14.961-6.344-29.013-17.148-39.153l-29.199 31.11c2.533 2.377 3.68 5.302 3.68 8.043H384zm-17.148-39.153c-10.757-10.097-25.074-15.553-39.741-15.553V192c4.193 0 7.963 1.576 10.542 3.996l29.199-31.11zm-181.963-15.553c-14.667 0-28.984 5.456-39.742 15.553l29.2 31.11c2.579-2.42 6.349-3.996 10.542-3.996v-42.667zm-39.742 15.553C134.344 175.026 128 189.078 128 204.039h42.667c0-2.741 1.147-5.666 3.68-8.043l-29.2-31.11zM128 204.039v233.607h42.667V204.039H128zm0 233.607c0 14.961 6.344 29.013 17.147 39.153l29.2-31.11c-2.533-2.377-3.68-5.302-3.68-8.043H128zm17.147 39.153c10.758 10.097 25.075 15.553 39.742 15.553v-42.667c-4.193 0-7.963-1.576-10.542-3.996l-29.2 31.11zm181.964-327.466h-28.444V192h28.444v-42.667zm-113.778 0H184.892h-.003V192H213.333v-42.667zM156.076 107.103c-8.596 8.058-9.031 21.559-.973 30.154 8.058 8.596 21.559 9.031 30.154.973l-29.181-31.127zM256 42.667l14.591-15.564c-8.206-7.693-20.976-7.693-29.182 0L256 42.667zm70.743 95.563c8.595 8.058 22.096 7.623 30.154-.973 8.058-8.595 7.623-22.096-.973-30.154l-29.181 31.127zM234.667 128v21.333h42.666V128h-42.666zm-49.41 10.23l85.334-80-29.182-31.127-85.333 80 29.181 31.127zm56.152-80l85.334 80 29.181-31.127-85.333-80-29.182 31.127zm-6.742-15.563V128h42.666V42.667h-42.666z" />
            </svg>

            <span>Extro</span>
          </a>
        </h1>
      </header>

      <h2 className="mt-6 text-2xl font-bold text-brand-200">
        View and save your backed up{' '}
        <span className="text-brand-500">conversations</span> and{' '}
        <span className="text-brand-500">voicemails</span> without having to
        download a thing
      </h2>
    </>
  )
}

Header.displayName = 'Header'

export default Header
