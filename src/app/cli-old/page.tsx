'use client'

import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { addComponent } from './actions'
import { COMPONENTS, DEFAULT_COMPONENT_PATH } from './lib/constants'
import { Component } from './lib/types'

export default function CLIPage() {
  const [status, setStatus] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [installing, setInstalling] = useState(false)
  const [selectedComponent, setSelectedComponent] = useState<string>(COMPONENTS[0].name)
  const [overwrite, setOverwrite] = useState(false)

  const handleAddComponent = async () => {
    try {
      setInstalling(true)
      setStatus(`Installing ${selectedComponent}...`)
      setError('')

      const result = await addComponent({
        name: selectedComponent,
        path: DEFAULT_COMPONENT_PATH,
        overwrite,
      })

      if (!result.success) {
        throw new Error(result.error)
      }

      setStatus(`${selectedComponent} installed successfully!`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add component')
    } finally {
      setInstalling(false)
    }
  }

  const renderComponentButton = (component: Component) => (
    <button
      key={component.name}
      onClick={() => setSelectedComponent(component.name)}
      className={`p-4 border rounded-lg text-left hover:border-blue-500 transition-colors ${
        selectedComponent === component.name 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
          : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      <div className="font-medium">{component.label}</div>
      {component.description && (
        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {component.description}
        </div>
      )}
      {component.category && (
        <div className="mt-2">
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800">
            {component.category}
          </span>
        </div>
      )}
    </button>
  )

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">ShadCN Component Installer</h1>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <label className="block font-medium">Select Component</label>
          <div className="grid grid-cols-2 gap-2">
            {COMPONENTS.map(renderComponentButton)}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="overwrite"
            checked={overwrite}
            onCheckedChange={setOverwrite}
          />
          <Label htmlFor="overwrite">
            Overwrite existing component
          </Label>
        </div>

        <button
          onClick={handleAddComponent}
          disabled={installing}
          className={`w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700`}
        >
          {installing ? `Installing ${selectedComponent}...` : `Add ${selectedComponent}`}
        </button>

        {status && (
          <div className="p-4 bg-green-100 text-green-700 rounded dark:bg-green-900 dark:text-green-100">
            {status}
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded dark:bg-red-900 dark:text-red-100">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
