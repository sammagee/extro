export default function parseTimestamp(fieldName: string): string {
  return `
    CASE WHEN (${fieldName} > 1000000000) THEN datetime(${fieldName} / 1000000000 + 978307200, 'unixepoch')
      WHEN ${fieldName} <> 0 THEN datetime(${fieldName} + 978307200, 'unixepoch')
      ELSE ${fieldName} END
  `
}
