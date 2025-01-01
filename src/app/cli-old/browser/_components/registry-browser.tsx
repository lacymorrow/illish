'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import path from 'path'
import { useEffect, useRef, useState } from 'react'
import { Toaster, toast } from 'sonner'
import { getProjectRoot } from '../actions'
import { fetchComponentDetails, fetchComponentIndex, fetchRootRegistry } from '../lib/registry-service'
import { ComponentDetails, ComponentIndex, RegistryGroup } from '../lib/registry-types'
import { runCliCommand } from './actions'
import { Folder, Tree } from './file-tree'
import { RegistrySelector } from './registry-selector'

interface LoadedComponent {
	name: string
	path: string
	indexPath: string
}

interface TreeState {
	[path: string]: {
		loading: boolean
		error: string | null
		data: ComponentIndex | null
	}
}

export function RegistryBrowser() {
	const [registryUrl, setRegistryUrl] = useState('http://localhost:3000/ui/download')
	const [rootRegistry, setRootRegistry] = useState<RegistryGroup[] | null>(null)
	const [treeState, setTreeState] = useState<TreeState>({})
	const [selectedComponent, setSelectedComponent] = useState<LoadedComponent | null>(null)
	const [componentDetails, setComponentDetails] = useState<ComponentDetails | null>(null)
	const [installing, setInstalling] = useState(false)
	const [installOutput, setInstallOutput] = useState<string[]>([])
	const outputRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		console.log('Loading registry from:', registryUrl)
		loadRootRegistry()
	}, [registryUrl])

	useEffect(() => {
		if (outputRef.current) {
			outputRef.current.scrollTop = outputRef.current.scrollHeight
		}
	}, [installOutput])

	const loadRootRegistry = async () => {
		console.log('Loading root registry')
		setRootRegistry(null)
		setTreeState({})

		const [data, error] = await fetchRootRegistry()
		if (error) {
			toast.error(error.message)
			return
		}

		setRootRegistry(data)
	}

	const loadComponentIndex = async (indexPath: string) => {
		console.log('Loading component index:', indexPath)

		// Don't reload if already loaded
		if (treeState[indexPath]?.data) {
			console.log('Index already loaded:', indexPath)
			return
		}

		setTreeState(prev => ({
			...prev,
			[indexPath]: {
				loading: true,
				error: null,
				data: null
			}
		}))

		const [data, error] = await fetchComponentIndex(indexPath)
		console.log('Component index load result:', { indexPath, data, error })

		setTreeState(prev => ({
			...prev,
			[indexPath]: {
				loading: false,
				error: error?.message || null,
				data
			}
		}))
	}

	const handleComponentClick = async (component: { name: string, path: string }, indexPath: string) => {
		console.log('handleComponentClick called with:', {
			component,
			indexPath
		})

		setSelectedComponent({
			...component,
			indexPath
		})
		console.log('Selected component set to:', {
			...component,
			indexPath
		})

		setComponentDetails(null)

		// Construct the full path to the component file
		const baseDir = indexPath.startsWith('http')
			? new URL('.', indexPath).toString()
			: path.dirname(indexPath)
		const fullPath = baseDir + '/' + component.path

		console.log('Component path resolution:', {
			baseDir,
			componentPath: component.path,
			fullPath,
			indexPath
		})

		const [details, error] = await fetchComponentDetails(component.path, indexPath)
		console.log('fetchComponentDetails result:', {
			details,
			error,
			component: component.name,
			path: fullPath
		})

		if (error) {
			console.error('Error fetching component details:', error)
			toast.error(error.message)
			return
		}

		if (details) {
			console.log('Setting component details:', details)
			setComponentDetails(details)
		} else {
			console.log('No details returned for component:', component.name)
		}
	}

	const handleInstall = async () => {
		if (!selectedComponent || !componentDetails) {
			toast.error('No component selected')
			return
		}

		try {
			const projectRoot = await getProjectRoot()
			setInstalling(true)
			setInstallOutput([])

			// Get the full URL for the component
			const baseDir = selectedComponent.indexPath.split('/').slice(0, -1).join('/')
			const cleanPath = selectedComponent.path.replace(/^\.\//, '')
			const fullPath = `${baseDir}/${cleanPath}`
			const fullUrl = `${registryUrl}/${fullPath}`
			const args = ['shadcn@latest', 'add', `"${fullUrl}"`, '--overwrite', '--yes']

			console.log('Installing component:', {
				name: componentDetails.name,
				url: fullUrl,
				projectRoot,
				args
			})

			const stream = await runCliCommand('npx', args, projectRoot)
			const reader = stream.getReader()

			while (true) {
				const { done, value } = await reader.read()
				if (done) break

				const chunk = new TextDecoder().decode(value)
				setInstallOutput(prev => [...prev, chunk])
			}

			toast.success(`Successfully installed ${componentDetails.name}`)
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to install component'
			console.error('Installation error:', error)
			toast.error(message)
		} finally {
			setInstalling(false)
		}
	}

	const [pendingPaths, setPendingPaths] = useState<Set<string>>(new Set())

	useEffect(() => {
		pendingPaths.forEach(async path => {
			await loadComponentIndex(path)
			setPendingPaths(prev => {
				const next = new Set(prev)
				next.delete(path)
				return next
			})
		})
	}, [pendingPaths])

	const renderRegistryGroup = (group: RegistryGroup) => {
		return (
			<Folder
				key={group.type}
				element={group.type.replace('registry:', '')}
				value={group.type}
			>
				{group.indices.reduce((acc, index) => {
					// Split path into [library, theme, type, filename]
					const parts = index.path.split('/')
					const library = parts[0]
					const theme = parts[1]

					// Find or create library folder
					let libraryFolder = acc.find(f => f.library === library)
					if (!libraryFolder) {
						libraryFolder = {
							library,
							themes: []
						}
						acc.push(libraryFolder)
					}

					// Add theme to library
					libraryFolder.themes.push({
						theme,
						path: index.path
					})

					return acc
				}, [] as Array<{
					library: string
					themes: Array<{
						theme: string
						path: string
					}>
				}>).map(lib => (
					<Folder
						key={lib.library}
						element={lib.library}
						value={lib.library}
					>
						{lib.themes.map(theme => (
							<Folder
								key={theme.path}
								element={theme.theme}
								value={theme.path}
								onExpand={() => {
									if (!pendingPaths.has(theme.path)) {
										setPendingPaths(prev => new Set(prev).add(theme.path))
									}
								}}
							>
								{renderComponentIndex(theme.path)}
							</Folder>
						))}
					</Folder>
				))}
			</Folder>
		)
	}

	const renderComponentIndex = (path: string) => {
		const state = treeState[path]
		if (!state) {
			// Queue the path for loading instead of loading directly
			if (!pendingPaths.has(path)) {
				setPendingPaths(prev => new Set(prev).add(path))
			}
			return <div className="pl-4">Loading...</div>
		}

		if (state.loading) {
			return <div className="pl-4">Loading...</div>
		}

		if (state.error) {
			return (
				<div className="pl-4">
					<Alert variant="destructive" className="mb-2">
						<AlertDescription>{state.error}</AlertDescription>
					</Alert>
				</div>
			)
		}

		if (!state.data) {
			return null
		}

		return state.data.components.map(component => {
			const isJsonFile = component.path.endsWith('.json')

			return (
				<Tree
					key={component.path}
					element={component.name}
					value={component.path}
					onSelect={isJsonFile ? () => handleComponentClick(component, path) : undefined}
				/>
			)
		})
	}

	const renderComponentDetails = () => {
		if (!componentDetails) {
			return (
				<div className="p-8 text-center text-muted-foreground">
					Select a component to view its details
				</div>
			)
		}

		// Get the full URL for the component
		const baseDir = selectedComponent?.indexPath.split('/').slice(0, -1).join('/')
		const cleanPath = selectedComponent?.path.replace(/^\.\//, '')
		const fullPath = `${baseDir}/${cleanPath}`
		const fullUrl = `${registryUrl}/${fullPath}`

		return (
			<div className="p-6 space-y-6">
				<div>
					<div className="flex items-center justify-between mb-2">
						<h2 className="text-2xl font-bold">{componentDetails.name}</h2>
						<div className="flex items-center gap-2">
							<Button
								size="sm"
								variant="outline"
								onClick={() => {
									console.log('Copying URL:', fullUrl)
									navigator.clipboard.writeText(fullUrl)
									toast.success('URL copied to clipboard')
								}}
							>
								Copy URL
							</Button>
							<Button
								size="sm"
								variant="outline"
								onClick={() => {
									const command = `npx shadcn@latest add "${fullUrl}" --overwrite --yes`
									console.log('Copying install command:', command)
									navigator.clipboard.writeText(command)
									toast.success('Install command copied to clipboard')
								}}
							>
								Copy Install Command
							</Button>
							<Button
								size="sm"
								variant="outline"
								onClick={() => {
									navigator.clipboard.writeText(JSON.stringify(componentDetails, null, 2))
									toast.success('JSON copied to clipboard')
								}}
							>
								Copy JSON
							</Button>
							<Button
								onClick={handleInstall}
								disabled={installing}
							>
								{installing ? 'Installing...' : 'Install'}
							</Button>
						</div>
					</div>
					<Badge>{componentDetails.type}</Badge>
				</div>

				<div>
					<h3 className="font-medium mb-2">Dependencies</h3>
					<div className="flex flex-wrap gap-1">
						{componentDetails.dependencies?.length ? (
							componentDetails.dependencies.map((dep) => (
								<Badge key={dep} variant="secondary">
									{dep}
								</Badge>
							))
						) : (
							<span className="text-muted-foreground text-sm">No dependencies</span>
						)}
					</div>
				</div>

				<div>
					<h3 className="font-medium mb-2">Files</h3>
					<div className="flex flex-wrap gap-1">
						{componentDetails.files?.length ? (
							componentDetails.files.map((file) => (
								<Badge key={file.path} variant="outline">
									{file.path}
								</Badge>
							))
						) : (
							<span className="text-muted-foreground text-sm">No files</span>
						)}
					</div>
				</div>

				{installOutput.length > 0 && (
					<div>
						<h3 className="font-medium mb-2">Installation Output</h3>
						<ScrollArea
							ref={outputRef}
							className="h-[200px] w-full rounded-md border bg-muted p-4"
						>
							<pre className="text-sm whitespace-pre-wrap">
								{installOutput.join('')}
							</pre>
						</ScrollArea>
					</div>
				)}
			</div>
		)
	}

	return (
		<div className="space-y-6">
			<RegistrySelector value={registryUrl} onChange={setRegistryUrl} />

			<div className="grid grid-cols-[300px_1fr] gap-6">
				<div className="border rounded-lg p-4">
					<h2 className="font-medium mb-4">Components</h2>
					<ScrollArea className="h-[600px]">
						{rootRegistry ? (
							rootRegistry.map(renderRegistryGroup)
						) : (
							<div className="pl-4">Loading registry...</div>
						)}
					</ScrollArea>
				</div>

				<div className="border rounded-lg">
					{renderComponentDetails()}
				</div>
			</div>
			<Toaster />
		</div>
	)
}
