
export default function listVersionLabel(version: any): string {
  return `v${version.major}.${version.minor}.${version.patch}`
}
