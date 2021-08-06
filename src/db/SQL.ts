import initSqlJs, { SqlJsStatic } from 'sql.js'

class SQL {
  private static instance: SqlJsStatic

  private constructor() {}

  public static async getInstance(): Promise<SqlJsStatic> {
    if (!SQL.instance) {
      SQL.instance = await initSqlJs({ locateFile: () => '/sql-wasm.wasm' })
    }

    return SQL.instance
  }
}

export default SQL
