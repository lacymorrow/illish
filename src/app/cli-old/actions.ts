'use server'

import fs from 'fs/promises'
import path from 'path'
import { DEFAULT_COMPONENT_PATH } from './lib/constants'
import { buildShadcnCommand, spawnShadcnCommand } from './lib/shadcn'
import { AddComponentInput, ComponentResult, addComponentSchema } from './lib/types'
import { checkComponentExists, checkConfigExists } from './lib/utils'

interface WriteFileInput {
	path: string
	content: string
}

interface WriteFileResult {
	success: boolean
	error?: string
}

export async function writeFile(input: WriteFileInput): Promise<WriteFileResult> {
	try {
		console.log('Writing file:', input.path)
		console.log('Content length:', input.content.length)

		const cwd = process.cwd()
		const fullPath = path.join(cwd, input.path)
		console.log('Full path:', fullPath)

		// Ensure the directory exists
		const dir = path.dirname(fullPath)
		console.log('Creating directory:', dir)
		await fs.mkdir(dir, { recursive: true })

		// Write the file
		console.log('Writing content to file...')
		await fs.writeFile(fullPath, input.content, 'utf-8')
		console.log('File written successfully')

		return { success: true }
	} catch (error) {
		console.error('Error writing file:', error)
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to write file'
		}
	}
}

export async function getProjectRoot(): Promise<string> {
	const root = process.cwd()

	try {
		// Verify this is actually our project root by checking for package.json
		await fs.access(path.join(root, 'package.json'))
		await fs.access(path.join(root, 'components.json'))
		return root
	} catch {
		throw new Error('Could not find project root. Make sure you are in a Next.js project with components.json')
	}
}

export async function addComponent(input: AddComponentInput): Promise<ComponentResult> {
	const { name, path: targetPath, overwrite } = addComponentSchema.parse(input)
	const cwd = process.cwd()

	try {
		// Check if components.json exists
		if (!await checkConfigExists(cwd)) {
			throw new Error('Configuration is missing. Please run init to create a components.json file.')
		}

		// Check if component already exists
		const componentDir = targetPath || path.join(cwd, DEFAULT_COMPONENT_PATH)
		const exists = await checkComponentExists(name, componentDir)

		if (exists && !overwrite) {
			throw new Error(`Component ${name} already exists. Use --overwrite to overwrite.`)
		}

		// Build the shadcn command
		const command = buildShadcnCommand({
			component: name,
			path: targetPath,
			overwrite
		})

		// Run the command
		const result = await spawnShadcnCommand(command, cwd)

		if (result.error) {
			throw new Error(result.error)
		}

		return {
			success: true,
			message: `Added ${name} component`
		}
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to add component'
		}
	}
}
