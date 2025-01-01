import path from 'path'
import { ComponentDetails, RegistryError, ComponentIndex, RegistryGroup, isRegistryRoot, isComponentIndex, isComponentDetails } from './registry-types'

const BASE_URL = 'http://localhost:3000/ui/download'

export async function fetchRootRegistry(): Promise<[RegistryGroup[] | null, RegistryError | null]> {
  try {
    const url = `${BASE_URL}/index.json`
    console.log('Fetching root registry:', url)
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch root registry: ${response.statusText} (${response.status})`)
    }
    
    const data = await response.json()
    console.log('Root registry response:', data)
    
    if (!isRegistryRoot(data)) {
      console.error('Invalid root registry format:', data)
      throw new Error('Invalid root registry format')
    }
    
    return [data, null]
  } catch (error) {
    console.error('Error fetching root registry:', error)
    return [null, {
      error: true,
      message: error instanceof Error ? error.message : 'Failed to fetch root registry'
    }]
  }
}

export async function fetchComponentIndex(indexPath: string): Promise<[ComponentIndex | null, RegistryError | null]> {
  try {
    const url = indexPath.startsWith('http') ? indexPath : `${BASE_URL}/${indexPath}`
    console.log('Fetching component index:', url)
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch component index: ${response.statusText} (${response.status})`)
    }
    
    const data = await response.json()
    console.log('Component index response:', data)
    
    if (!isComponentIndex(data)) {
      console.error('Invalid component index format:', data)
      throw new Error('Invalid component index format')
    }
    
    return [data, null]
  } catch (error) {
    console.error('Error fetching component index:', error)
    return [null, {
      error: true,
      message: error instanceof Error ? error.message : 'Failed to fetch component index'
    }]
  }
}

export async function fetchComponentDetails(componentPath: string, basePath: string): Promise<[ComponentDetails | null, RegistryError | null]> {
  try {
    // Get the directory part of the base path
    const baseDir = basePath.split('/').slice(0, -1).join('/')
    // Remove ./ from component path if present
    const cleanPath = componentPath.replace(/^\.\//, '')
    // Combine paths
    const fullPath = `${baseDir}/${cleanPath}`
    
    const url = `${BASE_URL}/${fullPath}`
    console.log('Fetching component details:', {
      baseDir,
      componentPath,
      cleanPath,
      fullPath,
      url
    })
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch component details: ${response.statusText} (${response.status})`)
    }
    
    const data = await response.json()
    console.log('Component details response:', data)
    
    if (!isComponentDetails(data)) {
      console.error('Invalid component details format:', data)
      throw new Error('Invalid component details format')
    }
    
    return [data, null]
  } catch (error) {
    console.error('Error fetching component details:', error)
    return [null, {
      error: true,
      message: error instanceof Error ? error.message : 'Failed to fetch component details'
    }]
  }
}
