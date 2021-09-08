import { createContext } from 'react'
import { SqlJsStatic } from 'sql.js'

export interface IBackupContext {
  sql: SqlJsStatic | null
  backupFolder: FileSystemDirectoryHandle | null
}

const BackupContext = createContext<IBackupContext>({
  sql: null,
  backupFolder: null,
})

export default BackupContext
