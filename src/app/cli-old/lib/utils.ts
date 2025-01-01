import { promises as fs } from 'fs'
import path from 'path'

/**
 * Check if a component exists in the specified directory
 */
export async function checkComponentExists(componentName: string, targetDir: string) {
  const possibleFiles = [
    `${componentName}.tsx`,
    `${componentName}/index.tsx`,
    `${componentName}.jsx`,
    `${componentName}/index.jsx`,
  ]

  for (const file of possibleFiles) {
    try {
      await fs.access(path.join(targetDir, file))
      return true
    } catch {
      // File doesn't exist, continue checking
    }
  }
  return false
}

/**
 * Check if the components.json configuration file exists
 */
export async function checkConfigExists(cwd: string): Promise<boolean> {
  try {
    await fs.access(path.join(cwd, 'components.json'))
    return true
  } catch {
    return false
  }
}

/**
 * Clean CLI error output for better user experience
 */
export function cleanErrorOutput(error: string): string {
  return error
    .replace(/error:/gi, '')
    .trim()
    .replace(/\n+/g, ' ')
}
