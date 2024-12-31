import { spawn } from 'child_process'
import path from 'path'
import { cleanErrorOutput } from './utils'

interface SpawnOptions {
  command: string[]
  cwd: string
  onStdout?: (data: string) => void
  onStderr?: (data: string) => void
}

/**
 * Execute a shadcn CLI command and handle its output
 */
export function spawnShadcnCommand({ 
  command,
  cwd,
  onStdout,
  onStderr 
}: SpawnOptions): Promise<{ success: boolean; error?: string }> {
  return new Promise((resolve, reject) => {
    let errorOutput = ''
    let stdoutOutput = ''

    console.log('Running command:', 'shadcn', command.join(' '))

    const child = spawn(path.join(cwd, 'node_modules', '.bin', 'shadcn'), command, {
      cwd,
      stdio: 'pipe',
    })

    child.stdout?.on('data', (data) => {
      const output = data.toString()
      stdoutOutput += output
      console.log('stdout:', output)
      onStdout?.(output)
    })

    child.stderr?.on('data', (data) => {
      const output = data.toString()
      errorOutput += output
      console.log('stderr:', output)
      onStderr?.(output)
    })

    child.on('error', (err) => {
      console.error('Spawn error:', err)
      reject(new Error(`Failed to start command: ${err.message}`))
    })

    child.on('close', (code) => {
      console.log('Exit code:', code)
      const isOverwrite = command.includes('-o')
      
      if (code === 0 || (code === 1 && isOverwrite)) {
        resolve({ success: true })
      } else {
        resolve({ 
          success: false,
          error: cleanErrorOutput(errorOutput) || `Command failed with exit code ${code}`
        })
      }
    })
  })
}

/**
 * Build the command arguments for the shadcn CLI
 */
export function buildShadcnCommand(
  name: string,
  overwrite: boolean,
  targetPath?: string
): string[] {
  const args = [
    'add',
    name,
    '--yes', // Skip confirmation prompts
  ]

  if (overwrite) {
    args.push('-o')
  }

  if (targetPath) {
    args.push('--path', targetPath)
  }

  return args
}
