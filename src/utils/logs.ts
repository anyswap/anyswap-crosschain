export function log({ name, value }: { name: string; value: any }) {
  console.group('%c log', 'color: brown;')
  console.log(`${name}: `, value)
  console.groupEnd()
}
