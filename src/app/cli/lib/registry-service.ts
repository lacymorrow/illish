import { RegistryIndex, RegistryError, ComponentDetails } from './registry-types'

const BASE_URL = 'http://localhost:3000/ui/download'

export async function fetchRegistry(): Promise<RegistryIndex | RegistryError> {
  try {
    console.log('Fetching registry from:', `${BASE_URL}/index.json`)
    const response = await fetch(`${BASE_URL}/index.json`)
    if (!response.ok) {
      return {
        message: `Failed to fetch registry: ${response.statusText}`,
        statusCode: response.status
      }
    }
    const data = await response.json()
    console.log('Registry data:', JSON.stringify(data, null, 2))
    return data
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : 'Failed to fetch registry'
    }
  }
}

export async function fetchComponentDetails(path: string): Promise<ComponentDetails | RegistryError> {
  try {
    console.log('Raw component path:', path)
    // Ensure we have a clean path without leading/trailing slashes
    const cleanPath = path.replace(/^\/+|\/+$/g, '')
    // Construct the full URL - path already includes .json extension
    const url = `${BASE_URL}/${cleanPath}`
    
    console.log('Fetching component details from:', url)
    
    const response = await fetch(url)
    
    if (!response.ok) {
      return {
        message: `Failed to fetch component details: ${response.statusText}`,
        statusCode: response.status
      }
    }
    
    const data = await response.json()
    console.log('Component details:', JSON.stringify(data, null, 2))
    return data as ComponentDetails  // The data already matches our type
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : 'Failed to fetch component details'
    }
  }
}

export function isRegistryError(data: any): data is RegistryError {
  return 'message' in data
}
