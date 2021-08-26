export interface Repository<T> {
  getAll(page?: number): Promise<T>
}
