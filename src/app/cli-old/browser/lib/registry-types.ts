export interface RegistryComponent {
  name: string
  path: string
}

export interface RegistryGroup {
  type: string
  indices: {
    path: string
  }[]
}

export interface ComponentIndex {
  components: RegistryComponent[]
}

export interface ComponentFile {
  path: string
  content: string
  type: string
}

export interface ComponentMeta {
  library: string
  theme: string
  hasPreview: boolean
}

export interface ComponentDetails {
  name: string
  type: string
  dependencies: string[]
  devDependencies: string[]
  registryDependencies: string[]
  files: ComponentFile[]
  meta: ComponentMeta
}

export interface RegistryError {
  error: true
  message: string
}

export function isRegistryError(data: unknown): data is RegistryError {
  return (
    typeof data === 'object' &&
    data !== null &&
    'error' in data &&
    'message' in data
  )
}

// The root index.json returns an array of registry groups
export function isRegistryRoot(data: unknown): data is RegistryGroup[] {
  if (!Array.isArray(data)) return false
  
  return data.every(item => 
    typeof item === 'object' &&
    item !== null &&
    'type' in item &&
    'indices' in item &&
    Array.isArray((item as RegistryGroup).indices)
  )
}

// Component index files return a list of components
export function isComponentIndex(data: unknown): data is ComponentIndex {
  if (typeof data !== 'object' || data === null) return false
  
  const index = data as ComponentIndex
  return (
    'components' in index &&
    Array.isArray(index.components) &&
    index.components.every(component => 
      typeof component === 'object' &&
      component !== null &&
      'name' in component &&
      'path' in component &&
      typeof component.name === 'string' &&
      typeof component.path === 'string'
    )
  )
}

export function isComponentDetails(data: unknown): data is ComponentDetails {
  return (
    typeof data === 'object' &&
    data !== null &&
    'name' in data &&
    'type' in data &&
    'dependencies' in data &&
    'files' in data &&
    'meta' in data
  )
}
