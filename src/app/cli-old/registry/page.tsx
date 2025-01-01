'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { useEffect, useRef, useState } from 'react'
import { Toaster, toast } from 'sonner'
import { getProjectRoot } from '../actions'
import { fetchComponentDetails, fetchRegistry, isRegistryError } from '../lib/registry-service'
import { ComponentDetails, RegistryComponent, RegistryIndex } from '../lib/registry-types'
import { runCliCommand } from './actions'

// Get this from your environment or configuration
const BASE_URL = 'http://localhost:3000/ui/download'

export default function RegistryPage() {
  const [registry, setRegistry] = useState<RegistryIndex | null>(null)
  const [selectedComponent, setSelectedComponent] = useState<RegistryComponent | null>(null)
  const [componentDetails, setComponentDetails] = useState<ComponentDetails | null>(null)
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [installing, setInstalling] = useState(false)
  const [projectRoot, setProjectRoot] = useState<string>('')
  const [installOutput, setInstallOutput] = useState<string[]>([])
  const outputRef = useRef<HTMLDivElement>(null)

  // Auto-scroll output to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [installOutput])

  useEffect(() => {
    async function init() {
      try {
        console.log('Getting project root...')
        const root = await getProjectRoot()
        console.log('Project root:', root)
        setProjectRoot(root)
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Failed to get project root'
        console.error('Error getting project root:', error)
        setError(error)
      }
    }

    init()
  }, [])

  useEffect(() => {
    async function loadRegistry() {
      console.log('Loading registry...')
      const data = await fetchRegistry()

      if (isRegistryError(data)) {
        console.error('Failed to load registry:', data.message)
        setError(data.message)
        setLoading(false)
        return
      }

      console.log('Registry loaded successfully')
      console.log('Registry data:', JSON.stringify(data, null, 2))
      setRegistry(data)
      setLoading(false)
    }

    loadRegistry()
  }, [])

  async function handleComponentClick(component: RegistryComponent) {
    console.log('Component clicked:', component.name)
    console.log('Component details:', JSON.stringify(component, null, 2))
    setSelectedComponent(component)
    setLoadingDetails(true)
    setComponentDetails(null)
    setInstallOutput([]) // Clear previous output

    console.log('Fetching component details from:', component.path)
    const details = await fetchComponentDetails(component.path)

    if (isRegistryError(details)) {
      console.error('Failed to load component details:', details.message)
      setError(details.message)
      setLoadingDetails(false)
      return
    }

    console.log('Component details loaded:', JSON.stringify(details, null, 2))
    setComponentDetails(details)
    setLoadingDetails(false)
  }

  async function handleInstall() {
    if (!componentDetails || !selectedComponent) {
      console.error('No component details available')
      return
    }

    if (!projectRoot) {
      console.error('Project root not found')
      toast.error('Project root not found. Please make sure you are in a Next.js project with components.json')
      return
    }

    console.log('Starting installation of component:', componentDetails.name)
    setInstalling(true)
    setInstallOutput([]) // Clear previous output

    try {
      // Run the shadcn CLI command
      const url = `${BASE_URL}/${selectedComponent.path}`
      const command = `npx shadcn@latest add "${url}" --overwrite --yes`
      const args = ['shadcn@latest', 'add', `"${url}"`, '--overwrite', '--yes']

      console.log('Installation details:')
      console.log('- Command:', command)
      console.log('- URL:', url)
      console.log('- Args:', JSON.stringify(args))
      console.log('- CWD:', projectRoot)

      const stream = await runCliCommand('npx', args, projectRoot)

      const reader = stream.getReader()
      if (!reader) {
        throw new Error('No response stream available')
      }

      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk
          .split('\n')
          .filter(line => line.trim().startsWith('data: '))
          .map(line => {
            try {
              const data = JSON.parse(line.slice(6))
              return data.content || ''
            } catch {
              return ''
            }
          })
          .filter(Boolean)

        setInstallOutput(prev => [...prev, ...lines])
      }

      console.log('Installation complete for component:', componentDetails.name)
      toast.success(`Installed ${componentDetails.name} component`)
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to install component'
      console.error('Installation error:', error)
      toast.error(error)
      setError(error)
    } finally {
      setInstalling(false)
    }
  }

  const renderComponentList = () => {
    if (!registry) return null

    return (
      <ScrollArea className="h-[600px] rounded-md border">
        <div className="p-4">
          {registry?.registry?.map((group) => {
            return (
              <div key={group.type} className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-lg font-semibold capitalize">
                    {group.type.replace('registry:', '')}
                  </h2>
                  <Badge variant="secondary">
                    {registry.stats?.componentsByType?.[group.type] || 0}
                  </Badge>
                </div>
                <div className="space-y-1">
                  {group.components?.map((component) => (
                    <button
                      key={component.name}
                      onClick={() => handleComponentClick(component)}
                      className={`w-full text-left px-3 py-2 rounded-lg hover:bg-accent ${
                        selectedComponent?.name === component.name
                          ? 'bg-accent'
                          : ''
                      }`}
                    >
                      {component.name}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    )
  }

  const renderComponentDetails = () => {
    if (loadingDetails) {
      return <ComponentDetailsSkeleton />
    }

    if (!componentDetails) {
      return (
        <div className="p-8 text-center text-muted-foreground">
          Select a component to view its details
        </div>
      )
    }

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
                  const url = `${BASE_URL}/${selectedComponent?.path}`
                  console.log('Copying URL:', url)
                  navigator.clipboard.writeText(url)
                  toast.success('URL copied to clipboard')
                }}
              >
                Copy URL
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const url = `${BASE_URL}/${selectedComponent?.path}`
                  const command = `npx shadcn@latest add "${url}" --overwrite --yes`
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
              <pre className="text-sm">
                {installOutput.join('\n')}
              </pre>
            </ScrollArea>
          </div>
        )}

        <div className="pt-4">
          <Button
            className="w-full"
            onClick={handleInstall}
            disabled={installing}
          >
            {installing ? 'Installing...' : 'Install Component'}
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="p-6">
      <Toaster />
      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-2">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Component Registry</h1>
            {registry?.stats?.totalComponents !== undefined && (
              <p className="text-muted-foreground">
                {registry.stats.totalComponents} components available
              </p>
            )}
          </div>
          {renderComponentList()}
        </div>
        <div className="col-span-3">
          <div className="rounded-lg border min-h-[600px]">
            {renderComponentDetails()}
          </div>
        </div>
      </div>
    </div>
  )
}

function ComponentDetailsSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-5 w-20" />
      </div>
      <div>
        <Skeleton className="h-5 w-32 mb-2" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
      <div>
        <Skeleton className="h-5 w-32 mb-2" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-32" />
        </div>
      </div>
      <Skeleton className="h-10 w-full mt-4" />
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="p-8">
      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-2">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="space-y-6">
            {[1, 2, 3].map((group) => (
              <div key={group}>
                <Skeleton className="h-6 w-32 mb-2" />
                <div className="space-y-2">
                  {[1, 2, 3].map((item) => (
                    <Skeleton key={item} className="h-10 w-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-3">
          <div className="rounded-lg border min-h-[600px]">
            <ComponentDetailsSkeleton />
          </div>
        </div>
      </div>
    </div>
  )
}
