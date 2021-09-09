import React from 'react'
import { isSupported } from '../utils/support'
import Footer from './Footer'
import Header from './Header'
import NotSupported from './NotSupported'
import Root from './Root'

const App = () => {
  return (
    <main className="px-8 py-16 sm:py-32">
      <div className="w-full max-w-xl mx-auto">
        <Header />

        {isSupported() ? <Root /> : <NotSupported />}

        <Footer />
      </div>
    </main>
  )
}

export default App
