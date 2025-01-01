export interface RegistryComponent {
  name: string
  path: string
}

export interface RegistryGroup {
  type: string
  components: RegistryComponent[]
}

export interface RegistryStats {
  totalComponents: number
  componentsByType: Record<string, number>
  dependencies: {
    total: number
    unique: number
  }
  registryDependencies: {
    total: number
    unique: number
  }
  styles: {
    componentsWithTailwind: number
    componentsWithCssVars: number
  }
  performance: {
    totalFileSize: string
    processingTime: string
    averageTimePerComponent: string
  }
  docs: {
    totalMapped: number
    withPreviews: number
    categories: string[]
  }
}

export interface RegistryIndex {
  registry: RegistryGroup[]
  stats: RegistryStats
}

export interface ComponentFile {
  path: string
  content: string
  type: string
}

export interface ComponentMeta {
  library: string
  hasPreview: boolean
}

export interface ComponentTailwind {
  config: Record<string, any>
}

export interface ComponentCssVars {
  light: Record<string, any>
  dark: Record<string, any>
}

export interface ComponentDetails {
  name: string
  type: string
  dependencies: string[]
  devDependencies: string[]
  registryDependencies: string[]
  files: ComponentFile[]
  meta: ComponentMeta
  tailwind: ComponentTailwind
  cssVars: ComponentCssVars
}

export interface RegistryError {
  message: string
  statusCode?: number
}
