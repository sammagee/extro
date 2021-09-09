export const isSupported = () => {
  return (
    typeof window.showDirectoryPicker !== 'undefined' &&
    typeof FileSystemDirectoryHandle !== 'undefined' &&
    typeof FileSystemFileHandle !== 'undefined' &&
    typeof File !== 'undefined'
  )
}
