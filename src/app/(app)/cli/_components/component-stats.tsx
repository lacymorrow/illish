'use client'

import { ComponentDetails } from '../lib/registry-types'

interface ComponentStatsProps {
  component: ComponentDetails
}

export function ComponentStats({ component }: ComponentStatsProps) {
  return (
    <dl className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <dt className="font-medium text-muted-foreground">Library</dt>
        <dd>{component.meta.library}</dd>
      </div>
      <div>
        <dt className="font-medium text-muted-foreground">Theme</dt>
        <dd>{component.meta.theme}</dd>
      </div>
      {component.dependencies.length > 0 && (
        <div className="col-span-2">
          <dt className="font-medium text-muted-foreground mb-1">Dependencies</dt>
          <dd className="space-y-1">
            {component.dependencies.map((dep) => (
              <div key={dep} className="flex items-center justify-between px-2 py-1 bg-muted rounded">
                <span>{dep}</span>
              </div>
            ))}
          </dd>
        </div>
      )}
      {component.files.length > 0 && (
        <div className="col-span-2">
          <dt className="font-medium text-muted-foreground mb-1">Files</dt>
          <dd className="space-y-1">
            {component.files.map(file => (
              <div key={file.path} className="px-2 py-1 bg-muted rounded">
                {file.path}
              </div>
            ))}
          </dd>
        </div>
      )}
    </dl>
  )
}
