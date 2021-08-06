import { Database as SqlJsDatabase, SqlJsStatic } from 'sql.js'
import Locations from '@/config/locations'
import { readFileAsync } from '@/utils/file'

class Database {
  private constructor() {}

  public static async load(sql: SqlJsStatic, folder: FileSystemDirectoryHandle, location: string): Promise<SqlJsDatabase> {
    const dirHandle = await folder.getDirectoryHandle((Locations as any)[location].slice(0, 2))
    const fileHandle = await dirHandle.getFileHandle((Locations as any)[location])
    const file = await fileHandle.getFile()
    const arrayBuffer = await readFileAsync(file)

    return new sql.Database(new Uint8Array(arrayBuffer))
  }
}

export default Database;
