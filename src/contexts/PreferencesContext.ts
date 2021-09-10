import { createContext, Dispatch, SetStateAction } from 'react'

export enum InstructionMode {
  Text,
  Video,
}

export enum VisibilityMode {
  Hidden,
  Visible,
}

export interface IPreferencesContext {
  instructionMode: InstructionMode
  setInstructionMode: Dispatch<SetStateAction<InstructionMode>>
  visibilityMode: VisibilityMode
  setVisibilityMode: Dispatch<SetStateAction<VisibilityMode>>
}

const PreferencesContext = createContext<IPreferencesContext>({
  instructionMode: InstructionMode.Text,
  setInstructionMode: () => {
    throw new Error('Unimplemented.')
  },
  visibilityMode: VisibilityMode.Visible,
  setVisibilityMode: () => {
    throw new Error('Unimplemented.')
  },
})

export default PreferencesContext
