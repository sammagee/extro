import { Database as SqlJsDatabase, SqlJsStatic } from 'sql.js'
import Database from '@/db/Database'

class DatabaseFactory {
  private constructor() {}

  public static async create(sql: SqlJsStatic, folder: FileSystemDirectoryHandle, location: string): Promise<SqlJsDatabase> {
    return await Database.load(sql, folder, location)
  }
}

export default DatabaseFactory
