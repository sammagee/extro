import Hex from 'crypto-js/enc-hex'
import sha1 from 'crypto-js/sha1'

export function filehash(path: string, domain: string = 'HomeDomain'): string {
  return Hex.stringify(sha1(`${domain}-${path}`));
}

export function readFileAsync(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  });
}
