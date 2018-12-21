export function getStructureKey(key: string) {
  switch (key) {
    case 'projects':
      return 'projects'
      break
    case 'publications':
      return 'publications'
      break
    case 'children':
      return 'children'
      break
    case 'linked':
      return 'linked'
      break
  }
  return null
}
