import React, { useEffect, useState } from 'react'
import PreferencesContext, {
  InstructionMode,
  VisibilityMode,
} from '../contexts/PreferencesContext'
import { isSupported } from '../utils/support'
import Footer from './Footer'
import Header from './Header'
import NotSupported from './NotSupported'
import Root from './Root'

const App = () => {
  const [instructionMode, setInstructionMode] = useState<InstructionMode>(
    InstructionMode.Text
  )
  const [visibilityMode, setVisibilityMode] = useState<VisibilityMode>(
    VisibilityMode.Visible
  )

  useEffect(() => {
    const [storedInstructionMode, storedVisibilityMode] = [
      localStorage.getItem('instructionMode'),
      localStorage.getItem('visibilityMode'),
    ]

    if (storedInstructionMode)
      setInstructionMode(JSON.parse(storedInstructionMode) as InstructionMode)
    if (storedVisibilityMode)
      setVisibilityMode(JSON.parse(storedVisibilityMode) as VisibilityMode)
  }, [])

  useEffect(() => {
    localStorage.setItem('instructionMode', JSON.stringify(instructionMode))
  }, [instructionMode])

  useEffect(() => {
    localStorage.setItem('visibilityMode', JSON.stringify(visibilityMode))
  }, [visibilityMode])

  return (
    <PreferencesContext.Provider
      value={{
        instructionMode,
        setInstructionMode,
        visibilityMode,
        setVisibilityMode,
      }}
    >
      <main className="px-8 py-16 sm:py-32">
        <div className="w-full max-w-xl mx-auto">
          <Header />

          {isSupported() ? <Root /> : <NotSupported />}

          <Footer />
        </div>
      </main>
    </PreferencesContext.Provider>
  )
}

export default App
