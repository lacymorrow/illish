'use server'

import { exec } from 'child_process'
import { ReadableStream } from 'stream/web'

export async function runCliCommand(command: string, args: string[], cwd: string) {
  return new Promise<ReadableStream>((resolve, reject) => {
    const child = exec(`${command} ${args.join(' ')}`, { cwd })
    
    let output = ''
    const stream = new ReadableStream({
      start(controller) {
        child.stdout?.on('data', (data) => {
          output += data
          controller.enqueue(new TextEncoder().encode(data.toString()))
        })
        
        child.stderr?.on('data', (data) => {
          output += data
          controller.enqueue(new TextEncoder().encode(data.toString()))
        })
        
        child.on('close', (code) => {
          if (code === 0) {
            controller.close()
          } else {
            controller.error(new Error(`Process exited with code ${code}\n${output}`))
          }
        })
        
        child.on('error', (err) => {
          controller.error(err)
        })
      }
    })
    
    resolve(stream)
  })
}
